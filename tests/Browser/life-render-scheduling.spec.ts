import { expect, test } from '@playwright/test';

for (const scrolling of [false, true]) {
    test(scrolling
        ? 'continuous scrolling keeps 4x Life evolving on separate calculation and paint frames'
        : 'steady immersive mode calculates and paints on separate frames without losing 4x cadence', async ({ page }) => {
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
            const put = CanvasRenderingContext2D.prototype.putImageData;
            CanvasRenderingContext2D.prototype.putImageData = function (...args) {
                if (this.canvas.classList.contains('life-background')) {
                    (window as any).lifeFrameWork.paint.push(frameTime);
                }
                return put.apply(this, args);
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
        await page.evaluate(scrolling => {
            (window as any).lifeFrameWork = { calculate: [], paint: [] };
            if (!scrolling) return;
            (window as any).lifeScrollRunning = true;
            const scroll = (now: number) => {
                if (!(window as any).lifeScrollRunning) return;
                window.scrollTo({ top: 500 + Math.sin(now / 800) * 400, behavior: 'instant' });
                // Saturate the redraw queue even if native scroll events coalesce.
                window.dispatchEvent(new Event('scroll'));
                (window as any).lifeScrollFrame = requestAnimationFrame(scroll);
            };
            (window as any).lifeScrollFrame = requestAnimationFrame(scroll);
        }, scrolling);
        await page.clock.runFor(1000);
        const work = await page.evaluate(() => (window as any).lifeFrameWork as { calculate: number[], paint: number[] });
        expect(Math.abs(work.calculate.length - 24)).toBeLessThanOrEqual(1);
        if (scrolling) {
            expect(work.paint.length).toBeGreaterThanOrEqual(23);
            expect(work.paint.length).toBeLessThanOrEqual(38);
            expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
        } else {
            expect(Math.abs(work.paint.length - 24)).toBeLessThanOrEqual(1);
        }
        const calculationFrames = new Set(work.calculate);
        expect(work.paint.filter(now => calculationFrames.has(now))).toEqual([]);
        if (scrolling) {
            await page.evaluate(() => {
                (window as any).lifeScrollRunning = false;
                cancelAnimationFrame((window as any).lifeScrollFrame);
                (window as any).lifeFrameWork = { calculate: [], paint: [] };
            });
            await page.clock.runFor(1000);
            const resumed = await page.evaluate(() => (window as any).lifeFrameWork as { calculate: number[], paint: number[] });
            expect(Math.abs(resumed.calculate.length - 24)).toBeLessThanOrEqual(1);
            expect(Math.abs(resumed.paint.length - 24)).toBeLessThanOrEqual(1);
        }
    });
}
