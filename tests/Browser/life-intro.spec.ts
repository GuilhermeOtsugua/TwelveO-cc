import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
        (window as any).introPaints = [];
        (window as any).introModeEvents = 0;
        document.addEventListener('otsugua:life-mode', () => (window as any).introModeEvents++);
        let sampled = false;
        const clear = CanvasRenderingContext2D.prototype.clearRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
            if (this.canvas.classList.contains('life-background')) sampled = false;
            return clear.apply(this, args);
        };
        const fill = CanvasRenderingContext2D.prototype.fillRect;
        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
            if (!sampled && this.canvas.classList.contains('life-background')) {
                sampled = true;
                const pitch = width / 0.58;
                const phase = (value: number) => Math.cos(value * Math.PI * 2);
                (window as any).introPaints.push({ pitch,
                    speed: Number((document.querySelector('[data-life-speed]') as HTMLInputElement).value),
                    x: phase((document.documentElement.clientWidth / 2 - x) / pitch),
                    y: phase((innerHeight / 2 - y) / pitch), scroll: window.scrollY });
            }
            return fill.call(this, x, y, width, height);
        };
    });
});

test('first paint starts tiny at 4x and returns to the normal grid without entering immersion', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const geometry = () => page.evaluate(() => ({ width: document.documentElement.clientWidth,
        height: document.documentElement.scrollHeight, max: document.documentElement.scrollHeight - innerHeight }));
    const before = await geometry();
    await page.clock.runFor(17);
    const first = await page.evaluate(() => (window as any).introPaints[0]);
    expect(first.pitch).toBeCloseTo(3, 6);
    expect(first.speed).toBe(4);
    await expect(page.locator('html')).not.toHaveClass(/life-immersed/);
    await expect(page.locator('[data-life-enter]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-life-exit]')).toBeHidden();
    expect(await page.evaluate(() => [...document.querySelectorAll('.otsugua-page > header, .otsugua-page > main')]
        .every(element => !(element as HTMLElement).inert && getComputedStyle(element).opacity === '1'))).toBe(true);
    expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-life-exit'))).toBe(false);
    await page.clock.runFor(1983);
    const half = await page.evaluate(() => (window as any).introPaints.at(-1));
    expect(half.pitch).toBeGreaterThan(6.3);
    expect(half.pitch).toBeLessThan(6.7);
    expect(half.speed).toBeGreaterThan(2.3);
    expect(half.speed).toBeLessThan(2.7);
    await page.clock.runFor(2100);
    const end = await page.evaluate(() => (window as any).introPaints.at(-1));
    expect(end.pitch).toBeCloseTo(10, 6);
    expect(end.speed).toBe(1);
    for (const point of [half, end]) {
        expect(point.x).toBeCloseTo(first.x, 6);
        expect(point.y).toBeCloseTo(first.y, 6);
    }
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => (window as any).introModeEvents)).toBe(0);
});

test('refresh respects restored scroll and starts a fresh intro; pageshow does not replay it', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(4100);
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.clock.runFor(100);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    // Native scroll anchoring may adjust a few pixels as mobile fonts settle.
    // Preserve the position the browser actually restored, rather than forcing it.
    const restoredScroll = await page.evaluate(() => window.scrollY);
    expect(restoredScroll).toBeGreaterThan(0);
    await page.clock.runFor(17);
    const first = await page.evaluate(() => (window as any).introPaints[0]);
    expect(first.speed).toBe(4);
    expect(first.pitch).toBeCloseTo(3, 6);
    expect(first.scroll).toBe(restoredScroll);
    await page.clock.runFor(4100);
    const end = await page.evaluate(() => (window as any).introPaints.at(-1));
    expect(end.pitch).toBeCloseTo(10, 6);
    expect(end.x).toBeCloseTo(first.x, 6);
    expect(end.y).toBeCloseTo(first.y, 6);
    expect(end.scroll).toBe(restoredScroll);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await page.clock.runFor(100);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    expect(await page.evaluate(() => (window as any).introPaints.at(-1).pitch)).toBeCloseTo(10, 6);
});

test('hidden time pauses the intro and reduced motion skips it permanently', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(1000);
    const before = await page.locator('[data-life-speed]').inputValue();
    await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(10_000);
    await expect(page.locator('[data-life-speed]')).toHaveValue(before);
    await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(3100);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.clock.runFor(17);
    expect(await page.evaluate(() => (window as any).introPaints[0].pitch)).toBe(10);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.runFor(4100);
    expect(await page.evaluate(() => (window as any).introPaints.at(-1).pitch)).toBe(10);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
});

test('entering Life during the intro takes over smoothly and later returns to 1x', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(1000);
    const before = await page.evaluate(() => (window as any).introPaints.at(-1));
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(17);
    const next = await page.evaluate(() => (window as any).introPaints.at(-1));
    expect(Math.abs(next.pitch - before.pitch)).toBeLessThan(0.1);
    await page.clock.runFor(4100);
    await expect(page.locator('[data-life-speed]')).toHaveValue('4');
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    expect(await page.evaluate(() => (window as any).introPaints.at(-1).pitch)).toBeCloseTo(10, 6);
});

test('enabling reduced motion during the intro finishes immediately without replay', async ({ page }) => {
    await page.goto('/');
    await page.clock.runFor(1000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.runFor(100);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    expect(await page.evaluate(() => (window as any).introPaints.at(-1).pitch)).toBeCloseTo(10, 6);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.runFor(500);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
});
