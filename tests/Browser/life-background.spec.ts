import { expect, test, type Page } from '@playwright/test';
import { createLifeLoopMonitor, createLifeBoard, createLifeWorld, resizeLifeWorld, stepLife } from '../../resources/js/game-of-life.js';

function advance(board: Uint8Array, columns: number, rows: number) {
    const next = new Uint8Array(board.length);
    stepLife(board, next, columns, rows);
    return next;
}

function pattern(columns: number, rows: number, cells: number[][]) {
    const board = new Uint8Array(columns * rows);
    for (const [x, y] of cells) board[y * columns + x] = 1;
    return board;
}

test('Conway rules preserve blocks, oscillate blinkers, and keep empty boards dead', () => {
    const block = pattern(5, 5, [[1, 1], [2, 1], [1, 2], [2, 2]]);
    expect(advance(block, 5, 5)).toEqual(block);
    const blinker = pattern(5, 5, [[1, 2], [2, 2], [3, 2]]);
    const vertical = pattern(5, 5, [[2, 1], [2, 2], [2, 3]]);
    const next = new Uint8Array(25);
    expect(stepLife(blinker, next, 5, 5)).toBe(4);
    expect(next).toEqual(vertical);
    expect(advance(vertical, 5, 5)).toEqual(blinker);
    expect(advance(new Uint8Array(25), 5, 5)).toEqual(new Uint8Array(25));
});

for (const [name, offsetX, offsetY] of [
    ['horizontal seam', 7, 1],
    ['vertical seam', 1, 5],
    ['corner', 7, 5],
] as const) {
    test(`a glider crosses the ${name} in both directions`, () => {
        const columns = 9;
        const rows = 7;
        const cells = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
        for (const direction of [1, -1]) {
            const position = (shift: number) => cells.map(([x, y]) => [
                ((direction * (x + offsetX + shift)) % columns + columns) % columns,
                ((direction * (y + offsetY + shift)) % rows + rows) % rows,
            ]);
            let board = pattern(columns, rows, position(0));
            for (let i = 0; i < 4; i++) board = advance(board, columns, rows);
            expect(board).toEqual(pattern(columns, rows, position(1)));
        }
    });
}

test('edge neighbors interact across top/bottom and both corner seams', () => {
    for (const y of [0, 6]) {
        const horizontal = pattern(9, 7, [[3, y], [4, y], [5, y]]);
        const vertical = pattern(9, 7, [[4, (y + 6) % 7], [4, y], [4, (y + 1) % 7]]);
        const next = new Uint8Array(63);
        expect(stepLife(horizontal, next, 9, 7)).toBe(4);
        expect(next).toEqual(vertical);
        expect(advance(vertical, 9, 7)).toEqual(horizontal);
    }
    const cornerBlock = pattern(9, 7, [[0, 0], [8, 0], [0, 6], [8, 6]]);
    expect(advance(cornerBlock, 9, 7)).toEqual(cornerBlock);
});

test('resize freezes excluded cells, restores them, and retains the active generation', () => {
    let world = createLifeWorld(7, 5, () => 0.9);
    world.board = pattern(7, 5, [[6, 1], [6, 2], [5, 3], [1, 1], [2, 1], [1, 2]]);
    const original = world.board.slice();
    world = resizeLifeWorld(world, 3, 4);
    world.board = advance(world.board, world.columns, world.rows);
    const evolved = world.board.slice();
    world = resizeLifeWorld(world, 7, 5, () => { throw new Error('Stored cells must not be randomized'); });
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 7; x++) {
            expect(world.board[y * 7 + x]).toBe(x < 3 && y < 4 ? evolved[y * 3 + x] : original[y * 7 + x]);
        }
    }
    const restored = world.board.slice();
    let randomCalls = 0;
    world = resizeLifeWorld(world, 9, 7, () => { randomCalls++; return 0; });
    expect(randomCalls).toBe(9 * 7 - 7 * 5);
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 9; x++) {
            expect(world.board[y * 9 + x]).toBe(x < 7 && y < 5 ? restored[y * 7 + x] : 1);
        }
    }
});

test('a fresh seed does not restore cached cells from the previous world', () => {
    let world = createLifeWorld(7, 5, () => 0);
    world = resizeLifeWorld(world, 3, 4);
    world = createLifeWorld(world.columns, world.rows, () => 0.9);
    world = resizeLifeWorld(world, 7, 5, () => 0.9);
    expect(world.board).toEqual(new Uint8Array(35));
});

test('empty and still-life boards require four states followed by 30 active seconds', () => {
    expect(createLifeBoard(2, 2, () => 0)).toEqual(new Uint8Array([1, 1, 1, 1]));
    for (const board of [new Uint8Array(25), pattern(5, 5, [[1, 1], [2, 1], [1, 2], [2, 2]])]) {
        const monitor = createLifeLoopMonitor(board);
        for (let i = 0; i < 3; i++) expect(monitor.record(board, 60_000)).toBe(false);
        expect(monitor.record(board, 29_999)).toBe(false);
        expect(monitor.record(board, 1)).toBe(true);
        expect(createLifeLoopMonitor(board).record(board, 60_000)).toBe(false);
    }
});

test('a real blinker loops for 30 seconds at every speed, including mid-loop changes', () => {
    for (const speeds of [[0.5], [1], [4], [0.5, 4, 1.137, 2.718]]) {
        let board = pattern(7, 7, [[2, 3], [3, 3], [4, 3]]);
        let next = new Uint8Array(49);
        const monitor = createLifeLoopMonitor(board);
        let elapsed = 0;
        for (let generation = 1; generation < 1000; generation++) {
            const delta = 1000 / (6 * speeds[generation % speeds.length]);
            stepLife(board, next, 7, 7);
            [board, next] = [next, board];
            if (generation > 3) elapsed += delta;
            const reseed = monitor.record(board, delta);
            expect(reseed).toBe(elapsed >= 30_000);
            if (reseed) break;
        }
        expect(elapsed).toBeGreaterThanOrEqual(30_000);
    }
});

test('equal populations, moving gliders and longer-period cycles are not two-state loops', () => {
    let glider = pattern(31, 31, [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]);
    const monitor = createLifeLoopMonitor(glider);
    for (let i = 0; i < 200; i++) {
        glider = advance(glider, 31, 31);
        expect(monitor.record(glider, 1000)).toBe(false);
    }
    const states = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(values => Uint8Array.from(values));
    const longerCycle = createLifeLoopMonitor(states[0]);
    for (let i = 1; i <= 100; i++) expect(longerCycle.record(states[i % 3], 1000)).toBe(false);
});

test('a changed cell anywhere breaks the loop and resets the full confirmation window', () => {
    const board = new Uint8Array(180_000);
    const monitor = createLifeLoopMonitor(board);
    for (let i = 0; i < 3; i++) monitor.record(board, 1000);
    expect(monitor.record(board, 29_999)).toBe(false);
    board[board.length - 1] = 1;
    expect(monitor.record(board, 1000)).toBe(false);
    board[board.length - 1] = 0;
    for (let i = 0; i < 4; i++) expect(monitor.record(board, 1000)).toBe(false);
    expect(monitor.record(board, 29_999)).toBe(false);
    expect(monitor.record(board, 1)).toBe(true);
});

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('otsugua.theme.preference', 'dark'));
});

const pixels = (page: Page) => page.locator('.life-background').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());

test('background evolves and has no Life control', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.life-background')).toBeVisible();
    await expect(page.locator('.life-background')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.life-motion-toggle')).toHaveCount(0);
    const initial = await pixels(page);
    await expect.poll(() => pixels(page)).not.toBe(initial);
    await page.screenshot({ path: testInfo.outputPath('life-top.png') });
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    await page.screenshot({ path: testInfo.outputPath('life-body.png') });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
});

test('desktop-mobile-desktop preserves the entire static world including the right edge', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const before = await pixels(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.life-background')).toHaveCSS('opacity', '0.2');
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.life-background')).toHaveCSS('opacity', '0.32');
    expect(await pixels(page)).toBe(before);
    const rightAlive = await page.locator('.life-background').evaluate((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')!;
        const width = Math.floor(canvas.width * 0.1);
        const data = ctx.getImageData(canvas.width - width, 0, width, canvas.height).data;
        return data.some((value, index) => index % 4 === 3 && value > 0);
    });
    expect(rightAlive).toBe(true);
    await page.locator('[data-theme-option="light"]').click();
    await expect(page.locator('.life-background')).toBeVisible();
    await expect(page.locator('.life-background')).toHaveCSS('color', 'rgb(83, 108, 89)');
    await page.locator('[data-theme-option="dark"]').click();
    await page.waitForTimeout(100);
    expect(await pixels(page)).toBe(before);
    await page.waitForTimeout(400);
    expect(await pixels(page)).toBe(before);
});

test('light theme evolves in moss green and recolors without replacing the world', async ({ page }, testInfo) => {
    await page.addInitScript(() => localStorage.setItem('otsugua.theme.preference', 'light'));
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const canvas = page.locator('.life-background');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCSS('color', 'rgb(83, 108, 89)');
    await expect(canvas).toHaveCSS('opacity', page.viewportSize()!.width < 640 ? '0.14' : '0.22');
    const initial = await pixels(page);
    await expect.poll(() => pixels(page)).not.toBe(initial);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    const lightWorld = await pixels(page);
    await page.waitForTimeout(400);
    expect(await pixels(page)).toBe(lightWorld);
    await page.screenshot({ path: testInfo.outputPath('life-light-top.png') });
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    await page.waitForTimeout(100);
    await page.screenshot({ path: testInfo.outputPath('life-light-body.png') });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.locator('[data-theme-option="dark"]').click();
    await expect(canvas).toHaveCSS('color', 'rgb(155, 184, 168)');
    await expect.poll(() => pixels(page)).not.toBe(lightWorld);
    await page.locator('[data-theme-option="light"]').click();
    await expect.poll(() => pixels(page)).toBe(lightWorld);
    expect(errors).toEqual([]);
});

test('system theme changes recolor a static world without losing it', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('otsugua.theme.preference', 'system'));
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto('/');
    const canvas = page.locator('.life-background');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCSS('color', 'rgb(83, 108, 89)');
    await page.waitForTimeout(150);
    const lightWorld = await pixels(page);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(canvas).toHaveCSS('color', 'rgb(155, 184, 168)');
    await expect.poll(() => pixels(page)).not.toBe(lightWorld);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(() => pixels(page)).toBe(lightWorld);
});

test('original dot size and square grid survive desktop and mobile resizing', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.addInitScript(() => {
        const fillRect = CanvasRenderingContext2D.prototype.fillRect;
        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
            if (this.canvas.classList.contains('life-background')) {
                (window as any).lifeDotSize = { width, height };
                (window as any).lifeGridX = x;
                (window as any).lifeGridY = y;
            }
            fillRect.call(this, x, y, width, height);
        };
    });
    await page.goto('/');
    const dotSize = () => page.evaluate(() => (window as any).lifeDotSize);
    await expect.poll(async () => (await dotSize())?.width).toBeCloseTo(5.8);
    await page.locator('.otsugua-page').evaluate((element: HTMLElement) => {
        element.style.minHeight = '10000px';
    });
    await page.waitForTimeout(150);
    expect((await dotSize()).width).toBeCloseTo(5.8);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    expect((await dotSize()).width).toBeCloseTo(5.8);
    expect((await dotSize()).height).toBeCloseTo(5.8);
    expect(await page.evaluate(() => (window as any).lifeGridX % 10)).toBe(0);
    expect(await page.evaluate(() => (window as any).lifeGridY % 10)).toBe(0);
});

for (const [theme, speed] of [['dark', 0.5], ['light', 4], ['light-to-dark', 1]] as const) {
    test(`reseeding counts active time in ${theme} at ${speed}x, excluding hidden time`, async ({ page }) => {
        await page.clock.install();
        await page.addInitScript((initialTheme) => {
            localStorage.setItem('otsugua.theme.preference', initialTheme);
        }, theme === 'dark' ? 'dark' : 'light');
        // Keep resize-created cells empty until the expected reseed window.
        await page.addInitScript(() => {
            const random = Math.random;
            let firstSeed = true;
            Math.random = () => firstSeed ? 0.9 : random();
            (window as any).allowLifePopulation = () => { firstSeed = false; };
        });
        await page.goto('/');
        await page.evaluate(async () => {
            await document.fonts.ready;
            const world = document.querySelector('.otsugua-page')!;
            const height = world.scrollHeight;
            // Isolate timing from native-control/layout rounding across themes.
            // Actual world-bound changes intentionally reset loop detection.
            Object.defineProperty(world, 'scrollHeight', { get: () => height });
        });
        await page.evaluate(value => {
            const slider = document.querySelector('[data-life-speed]') as HTMLInputElement;
            slider.value = String(value);
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }, speed);
        await page.clock.runFor(1500); // Establish all four loop states first.
        const empty = await pixels(page);
        await page.clock.fastForward(18_000);
        expect(await pixels(page)).toBe(empty);
        if (theme === 'light-to-dark') {
            // A palette change must not restart the confirmed loop timer.
            await page.locator('[data-theme-option="dark"]').click();
            await expect(page.locator('html')).toHaveAttribute('data-theme-effective', 'dark');
        }
        // A suspended document must not accumulate lifetime or reseed.
        await page.evaluate(() => {
            Object.defineProperty(document, 'hidden', { configurable: true, value: true });
            document.dispatchEvent(new Event('visibilitychange'));
        });
        await page.clock.fastForward(120_000);
        expect(await pixels(page)).toBe(empty);
        await page.evaluate(() => {
            Object.defineProperty(document, 'hidden', { configurable: true, value: false });
            document.dispatchEvent(new Event('visibilitychange'));
        });
        await page.clock.fastForward(1000);
        expect(await pixels(page)).toBe(empty);
        await page.clock.fastForward(8000);
        expect(await pixels(page)).toBe(empty);
        // Theme/layout changes can add rows that now wrap into the visible top.
        // Only permit population once those resizes are over, just before reseeding.
        await page.evaluate(() => (window as any).allowLifePopulation());
        await page.clock.fastForward(4000);
        await page.clock.runFor(1100);
        expect(await pixels(page)).not.toBe(empty);
    });
}
