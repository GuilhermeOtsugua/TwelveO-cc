import { expect, test, type Page } from '@playwright/test';

async function prepare(page: Page) {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => {
        const random = Math.random;
        let populate = false;
        Math.random = () => populate ? random() : .9;
        (window as any).allowViewportPopulation = () => { populate = true; };
        (window as any).viewportSeeds = 0;
        (window as any).offscreenPositions = [];
        const from = Uint8Array.from;
        Uint8Array.from = function (...args) {
            if (args[0]?.length > 1000) (window as any).viewportSeeds++;
            return from.apply(this, args);
        };
        const set = Uint8Array.prototype.set;
        Uint8Array.prototype.set = function (source, offset) {
            if (source instanceof Uint8Array && source.length > 1000) {
                if ((window as any).seedOffscreenGlider) {
                    const size = document.documentElement.classList.contains('life-immersed') ? 3 : 10;
                    const originY = size === 3 ? innerHeight * .35 : 0;
                    const columns = Math.ceil(document.documentElement.clientWidth / size);
                    const row = Math.ceil((innerHeight - originY) / size) + 3;
                    source.fill(0);
                    for (const [x, y] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) source[(row + y) * columns + x + 5] = 1;
                    (window as any).seedOffscreenGlider = false;
                }
                const first = source.indexOf(1);
                if (first !== -1) (window as any).offscreenPositions.push(first);
            }
            return set.call(this, source, offset);
        };
    });
    await page.goto('/');
    await page.evaluate(async () => {
        await document.fonts.ready;
        const page = document.querySelector('.otsugua-page')!;
        const height = page.scrollHeight;
        Object.defineProperty(page, 'scrollHeight', { get: () => height });
    });
    await page.clock.runFor(4100);
}

for (const immersed of [false, true]) {
    test(`${immersed ? 'immersed' : 'normal'} viewport repopulates despite a moving offscreen glider`, async ({ page }) => {
        test.setTimeout(120_000);
        await prepare(page);
        if (immersed) {
            await page.locator('[data-life-enter]').click();
            await page.clock.runFor(4100);
        }
        const seeds = await page.evaluate(() => (window as any).viewportSeeds);
        await page.evaluate(() => (window as any).seedOffscreenGlider = true);
        await page.clock.runFor(1500);
        const sample = await page.locator('canvas.life-background').evaluate((canvas: HTMLCanvasElement) => {
            const ratio = canvas.width / document.documentElement.clientWidth;
            const top = Math.round(-canvas.getBoundingClientRect().top * ratio);
            const context = canvas.getContext('2d')!;
            const hasCells = (data: Uint8ClampedArray) => data.some((value, i) => i % 4 === 3 && value !== 0);
            return { visible: hasCells(context.getImageData(0, top, canvas.width, Math.round(innerHeight * ratio)).data),
                entireBitmap: hasCells(context.getImageData(0, 0, canvas.width, canvas.height).data) };
        });
        expect(sample.visible).toBe(false);
        if (immersed) expect(sample.entireBitmap).toBe(true); // Activity in render overscan must not count.
        expect(await page.evaluate(() => new Set((window as any).offscreenPositions).size)).toBeGreaterThan(2);
        await page.evaluate(() => (window as any).allowViewportPopulation());
        await page.clock.fastForward(31_000);
        await page.clock.runFor(1100);
        expect(await page.evaluate(() => (window as any).viewportSeeds)).toBe(seeds + 1);
    });
}

test('scrolling away and back between generations resets the viewport timer', async ({ page }) => {
    test.setTimeout(120_000);
    await prepare(page);
    await page.evaluate(() => {
        window.scrollTo({ top: 1, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(1500);
    const seeds = await page.evaluate(() => (window as any).viewportSeeds);
    await page.clock.fastForward(25_000);
    await page.evaluate(() => {
        for (const top of [2, 1]) {
            window.scrollTo({ top, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
        }
        (window as any).allowViewportPopulation();
    });
    await page.clock.runFor(1500);
    await page.clock.fastForward(6000);
    expect(await page.evaluate(() => (window as any).viewportSeeds)).toBe(seeds);
    await page.clock.fastForward(24_000);
    await page.clock.runFor(1100);
    expect(await page.evaluate(() => (window as any).viewportSeeds)).toBe(seeds + 1);
});
