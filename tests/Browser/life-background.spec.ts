import { expect, test, type Page } from '@playwright/test';
import { createLifeActivityMonitor, createLifeBoard, createLifeWorld, resizeLifeWorld, stepLife } from '../../resources/js/game-of-life.js';

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

test('a glider crosses the horizontal seam and top/bottom do not wrap', () => {
    const cells = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    let board = pattern(7, 7, cells.map(([x, y]) => [(x + 5) % 7, y]));
    for (let i = 0; i < 4; i++) board = advance(board, 7, 7);
    expect(board).toEqual(pattern(7, 7, cells.map(([x, y]) => [(x + 6) % 7, y + 1])));
    const topRow = pattern(7, 7, [[1, 0], [2, 0], [3, 0]]);
    expect(advance(topRow, 7, 7).slice(42)).toEqual(new Uint8Array(7));
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

test('random initialization and low-activity grace/window contracts', () => {
    expect(createLifeBoard(2, 2, () => 0)).toEqual(new Uint8Array([1, 1, 1, 1]));
    expect(createLifeBoard(2, 2, () => 0.9)).toEqual(new Uint8Array(4));
    const activity = createLifeActivityMonitor();
    for (let seconds = 1; seconds <= 74; seconds++) {
        expect(activity.record(0, 10000, 1000)).toBe(false);
    }
    expect(activity.record(0, 10000, 1000)).toBe(true);
    // Each new seed starts its own grace period, regardless of prior inactivity.
    expect(createLifeActivityMonitor().record(0, 10000, 60000)).toBe(false);
});

test('rolling activity distinguishes static populations from a sufficiently active world', () => {
    const activity = createLifeActivityMonitor();
    activity.record(0, 10000, 60000);
    for (let i = 0; i < 30; i++) expect(activity.record(100, 10000, 1000)).toBe(false);
    for (let i = 0; i < 14; i++) expect(activity.record(0, 10000, 1000)).toBe(false);
    expect(activity.record(0, 10000, 1000)).toBe(true);
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
    await expect(page.locator('.life-background')).toBeHidden();
    await page.locator('[data-theme-option="dark"]').click();
    await page.waitForTimeout(100);
    expect(await pixels(page)).toBe(before);
    await page.waitForTimeout(400);
    expect(await pixels(page)).toBe(before);
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

test('an empty world reseeds after grace plus low activity, with hidden time excluded', async ({ page }) => {
    await page.clock.install();
    // Empty first seed; subsequent seed is a normal random board.
    await page.addInitScript(() => {
        const random = Math.random;
        let firstSeed = true;
        Math.random = () => firstSeed ? 0.9 : random();
        (window as any).allowLifePopulation = () => { firstSeed = false; };
    });
    await page.goto('/');
    await page.clock.runFor(200);
    const empty = await pixels(page);
    await page.evaluate(() => (window as any).allowLifePopulation());
    await page.clock.fastForward(59_000);
    expect(await pixels(page)).toBe(empty);
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
    await page.clock.fastForward(14_000);
    expect(await pixels(page)).toBe(empty);
    await page.clock.fastForward(1500);
    await page.clock.runFor(900);
    expect(await pixels(page)).not.toBe(empty);
});
