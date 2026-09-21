import { expect, test } from '@playwright/test';
import { createLifeClock } from '../../resources/js/life-clock.js';

for (const speed of [0.5, 1, 1.137, 2.718, 4]) {
    test(`clock preserves fractional frames at ${speed}x`, () => {
        const clock = createLifeClock();
        clock.setSpeed(speed, 0);
        let generations = 0;
        for (let frame = 1; frame <= 3600; frame++) {
            generations += Number(clock.advance(frame * 1000 / 60));
        }
        expect(generations).toBe(Math.floor(360 * speed + 1e-7));
    });
}

test('rapid continuous reversals preserve elapsed progress without backlog', () => {
    const clock = createLifeClock();
    let expected = 0;
    let speed = 1;
    let generations = 0;
    for (let ms = 1; ms <= 10_000; ms++) {
        expected += 6 * speed / 1000;
        speed = 0.5 + ((ms % 137) / 136) * 3.5;
        clock.setSpeed(speed, ms);
        if (ms % 10 === 0) generations += Number(clock.advance(ms));
    }
    expect(generations).toBe(Math.floor(expected));
    clock.setSpeed(4, 10_000);
    expect(clock.advance(70_000)).toBe(true);
    expect(clock.advance(70_000)).toBe(false);
    clock.reset(130_000);
    expect(clock.advance(130_001)).toBe(false);
    expect(clock.advance(130_042)).toBe(true);
    expect(clock.advance(130_043)).toBe(false);
});

test('input timestamps ahead of queued frames do not double-count time', () => {
    const clock = createLifeClock();
    clock.setSpeed(4, 100);
    expect(clock.advance(90)).toBe(false);
    expect(clock.advance(120)).toBe(true);
    expect(clock.advance(149)).toBe(false);
    expect(clock.advance(159)).toBe(true);
});

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('otsugua.locale.preference', 'en');
        localStorage.setItem('otsugua.theme.preference', 'dark');
    });
});

test('slider is immersive-only, continuous, keyboard accessible and visit-scoped', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const slider = page.getByRole('slider', { name: 'Simulation speed' });
    await expect(slider).toBeHidden();
    await page.locator('[data-life-enter]').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(slider).toBeFocused();
    await slider.fill('1.137');
    await expect(slider).toHaveAttribute('aria-valuetext', '1.14×');
    await expect(page.locator('[data-life-speed-value]')).toHaveText('1.14×');
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('4');
    await page.keyboard.press('Home');
    await expect(slider).toHaveValue('0.5');
    await page.keyboard.press('Escape');
    await expect(slider).toBeHidden();
    await page.locator('[data-life-enter]').click();
    await page.keyboard.press('Tab');
    await expect(slider).toHaveValue('0.5');
    await page.reload();
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
});

test('rapid pointer scrubbing stays immersive and shares the five-second fade', async ({ page }) => {
    await page.clock.install();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('[data-life-enter]').click();
    await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 })));
    const slider = page.locator('[data-life-speed]');
    const themes = page.locator('[data-theme-toggle]');
    const bounds = (await slider.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.clock.runFor(6000);
    await expect(themes).toHaveJSProperty('inert', false);
    for (let i = 0; i < 24; i++) {
        await page.mouse.move(bounds.x + (i % 2 ? bounds.width - 1 : 1), bounds.y + bounds.height / 2);
        await expect(slider).toHaveValue(i % 2 ? '4' : '0.5');
    }
    await expect(page.locator('html')).toHaveClass(/life-immersed/);
    await page.mouse.move(bounds.x - 100, bounds.y - 80);
    await page.mouse.up();
    await expect(page.locator('html')).toHaveClass(/life-immersed/);
    await page.clock.runFor(4990);
    await expect(themes).toHaveJSProperty('inert', false);
    await page.clock.runFor(20);
    await expect(themes).toHaveJSProperty('inert', true);
    await expect(themes).toHaveCSS('opacity', '0');
});

test('live canvas cadence follows speed and resumes without catching up', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.addInitScript(() => {
        (window as any).lifePaints = 0;
        const clear = CanvasRenderingContext2D.prototype.clearRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
            if (this.canvas.classList.contains('life-background')) (window as any).lifePaints++;
            return clear.apply(this, args);
        };
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-life-enter]').click();
    await page.keyboard.press('Tab');
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.clock.runFor(1000);
    const count = () => page.evaluate(() => (window as any).lifePaints as number);
    for (const speed of [0.5, 4, 1.137]) {
        await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 })));
        await page.locator('[data-life-speed]').fill(String(speed));
        const before = await count();
        await page.clock.runFor(6000);
        expect(Math.abs((await count()) - before - 36 * speed)).toBeLessThanOrEqual(2);
    }
    await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    const hidden = await count();
    await page.clock.runFor(120_000);
    expect(await count()).toBe(hidden);
    await page.evaluate(() => {
        const slider = document.querySelector('[data-life-speed]') as HTMLInputElement;
        slider.value = '4';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(17);
    expect((await count()) - hidden).toBe(1); // Initial redraw, not replayed generations.
    const resumed = await count();
    await page.clock.runFor(1000);
    expect(Math.abs((await count()) - resumed - 24)).toBeLessThanOrEqual(1);
});

test('touch scrubbing changes speed without scrolling or exiting', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Native touch interaction');
    await page.goto('/');
    await page.locator('[data-life-enter]').click();
    await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 })));
    const slider = page.locator('[data-life-speed]');
    const bounds = (await slider.boundingBox())!;
    const scroll = await page.evaluate(() => scrollY);
    const cdp = await page.context().newCDPSession(page);
    const y = bounds.y + bounds.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bounds.x + 10, y }] });
    for (let i = 0; i < 12; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: bounds.x + (i % 2 ? 1 : bounds.width - 1), y }] });
        await expect(slider).toHaveValue(i % 2 ? '0.5' : '4');
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await expect(page.locator('html')).toHaveClass(/life-immersed/);
    await cdp.detach();
});

test('indicator resets speed by click and keyboard without exiting', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-life-enter]').click();
    const slider = page.locator('[data-life-speed]');
    const reset = page.getByRole('button', { name: 'Reset simulation speed' });
    await slider.fill('3.14159');
    await reset.click();
    await expect(slider).toHaveValue('1');
    await expect(slider).toHaveAttribute('aria-valuetext', '1.00×');
    await expect(reset).toHaveText('1.00×');
    await slider.fill('0.5');
    await slider.press('Shift+Tab');
    await expect(reset).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(slider).toHaveValue('1');
    await expect(reset).toHaveText('1.00×');
    await expect(page.locator('html')).toHaveClass(/life-immersed/);
});

test('rapid theme switches keep the same world evolving without clock resets', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => {
        let seed = 17;
        Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
        (window as any).lifeCells = [];
        const clear = CanvasRenderingContext2D.prototype.clearRect;
        const fill = CanvasRenderingContext2D.prototype.fillRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
            if (this.canvas.classList.contains('life-background')) (window as any).lifeCells = [];
            return clear.apply(this, args);
        };
        CanvasRenderingContext2D.prototype.fillRect = function (...args) {
            // Compare interior rows: asynchronous page-height changes can legitimately
            // add world rows whose new cells interact across the top/bottom seam.
            if (this.canvas.classList.contains('life-background') && args[1] >= 200 && args[1] <= 500) {
                (window as any).lifeCells.push(args);
            }
            return fill.apply(this, args);
        };
    });
    const runs: string[][] = [];
    for (const switchThemes of [false, true]) {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        await page.locator('[data-life-enter]').click();
        await page.clock.runFor(200);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        const states: string[] = [];
        for (let i = 0; i < 20; i++) {
            if (switchThemes) await page.locator(`[data-theme-option="${i % 2 ? 'dark' : 'light'}"]`).dispatchEvent('click');
            await page.clock.runFor(100);
            states.push(await page.evaluate(() => JSON.stringify((window as any).lifeCells)));
        }
        // Reloads can offset RAF alignment slightly; compare actual generations,
        // not colour-only repaints or which side of a sample boundary a frame lands.
        runs.push(states.filter((state, i) => i === 0 || state !== states[i - 1]));
    }
    expect(runs[0].length).toBeGreaterThanOrEqual(11);
    expect(runs[1].length).toBeGreaterThanOrEqual(runs[0].length - 1);
    expect(runs[1].slice(0, 10).map((state, i) => state === runs[0][i])).toEqual(Array(10).fill(true));
});

test('speed changes leave reduced-motion pixels untouched', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    const pixels = () => page.locator('canvas.life-background').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
    const before = await pixels();
    await page.locator('[data-life-enter]').click();
    await page.keyboard.press('Tab');
    for (const value of ['4', '0.5', '3.14159', '4']) await page.locator('[data-life-speed]').fill(value);
    await page.waitForTimeout(400);
    expect(await pixels()).toBe(before);
});
