import { expect, test, type Page } from '@playwright/test';

async function emptyWorld(page: Page) {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.addInitScript(() => {
        let populate = false;
        const random = Math.random;
        Math.random = () => populate ? random() : 0.9;
        (window as any).allowLifePopulation = () => { populate = true; };
        (window as any).lifeFades = [];
        const alpha = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'globalAlpha')!;
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'globalAlpha', {
            ...alpha,
            set(value) {
                if (this.canvas.classList.contains('life-background')) {
                    (window as any).lifeFades.push({ time: performance.now(), alpha: value });
                }
                alpha.set!.call(this, value);
            },
        });
    });
    await page.goto('/');
    await page.evaluate(async () => {
        await document.fonts.ready;
        const world = document.querySelector('.otsugua-page')!;
        const height = world.scrollHeight;
        Object.defineProperty(world, 'scrollHeight', { get: () => height });
    });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.clock.runFor(1500);
}

const pixels = (page: Page) => page.locator('.life-background').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());

test('a confirmed loop fades out and in over one second, then starts a new world', async ({ page }) => {
    await emptyWorld(page);
    const empty = await pixels(page);
    await page.evaluate(() => (window as any).allowLifePopulation());
    await page.clock.fastForward(28_000);
    await page.clock.runFor(4000);
    expect(await pixels(page)).not.toBe(empty);
    const fades: {time: number; alpha: number}[] = await page.evaluate(() => (window as any).lifeFades);
    const first = fades.findIndex(frame => frame.alpha < 1);
    expect(first).toBeGreaterThan(0);
    const complete = fades.findIndex((frame, i) => i > first && frame.alpha === 1);
    expect(complete).toBeGreaterThan(first);
    const start = fades[first - 1].time;
    expect(fades[complete].time - start).toBeGreaterThanOrEqual(1000);
    expect(fades[complete].time - start).toBeLessThanOrEqual(1020);
    const transition = fades.slice(first, complete);
    expect(Math.min(...transition.map(frame => frame.alpha))).toBeLessThan(0.04);
    expect(transition.some(frame => frame.alpha > 0.4 && frame.alpha < 0.6 && frame.time - start < 500)).toBe(true);
    expect(transition.some(frame => frame.alpha > 0.4 && frame.alpha < 0.6 && frame.time - start > 500)).toBe(true);
});

test('world resizing resets confirmation; reduced-motion and suspension time do not count', async ({ page }) => {
    await emptyWorld(page);
    await page.clock.fastForward(25_000);
    const viewport = page.viewportSize()!;
    await page.setViewportSize({ width: viewport.width + 40, height: viewport.height });
    await page.clock.runFor(1500);
    const empty = await pixels(page);
    await page.evaluate(() => (window as any).allowLifePopulation());
    await page.clock.runFor(5000); // The old world's timer would already have expired.
    expect(await pixels(page)).toBe(empty);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.fastForward(120_000);
    expect(await pixels(page)).toBe(empty);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.runFor(1000);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.clock.fastForward(120_000);
    expect(await pixels(page)).toBe(empty);
    await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
    // Changing speed must retain the already accumulated loop time.
    await page.evaluate(() => {
        const slider = document.querySelector('[data-life-speed]') as HTMLInputElement;
        slider.value = '4';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.clock.fastForward(20_000);
    expect(await pixels(page)).toBe(empty);
    await page.clock.fastForward(6000);
    await page.clock.runFor(1100);
    expect(await pixels(page)).not.toBe(empty);
});
