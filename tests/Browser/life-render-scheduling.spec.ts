import { expect, test } from '@playwright/test';

test('steady immersive mode calculates and paints on separate frames without losing 4x cadence', async ({ page }) => {
    test.setTimeout(60_000);
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => {
        let frameTime = -1;
        const request = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = callback => request(now => {
            frameTime = now;
            callback(now);
        });
        (window as any).lifeFrameWork = { calculate: [], paint: [] };
        // Each generation copies the finished board into loop history. This
        // observes calculation without exposing a production debugging API.
        const set = Uint8Array.prototype.set;
        Uint8Array.prototype.set = function (source, offset) {
            if (source instanceof Uint8Array && source.length > 1000) {
                (window as any).lifeFrameWork.calculate.push(frameTime);
            }
            return set.call(this, source, offset);
        };
        const clear = CanvasRenderingContext2D.prototype.clearRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
            if (this.canvas.classList.contains('life-background')) {
                (window as any).lifeFrameWork.paint.push(frameTime);
            }
            return clear.apply(this, args);
        };
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    await page.evaluate(() => (window as any).lifeFrameWork = { calculate: [], paint: [] });
    await page.clock.runFor(1000);
    const work = await page.evaluate(() => (window as any).lifeFrameWork as { calculate: number[], paint: number[] });
    expect(Math.abs(work.calculate.length - 24)).toBeLessThanOrEqual(1);
    expect(Math.abs(work.paint.length - 24)).toBeLessThanOrEqual(1);
    const calculationFrames = new Set(work.calculate);
    expect(work.paint.filter(now => calculationFrames.has(now))).toEqual([]);
});
