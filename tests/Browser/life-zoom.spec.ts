import { expect, test } from '@playwright/test';

test('background mode eases to four times speed over four seconds and restores on exit', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(4100); // Assess manual entry from the settled page, not the startup intro.
    await page.locator('[data-life-enter]').click();
    const speed = page.locator('[data-life-speed]');
    await page.clock.runFor(2000);
    const halfway = Number(await speed.inputValue());
    expect(halfway).toBeGreaterThan(2.3);
    expect(halfway).toBeLessThan(2.7);
    await page.clock.runFor(2100);
    await expect(speed).toHaveValue('4');
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    await expect(speed).toHaveValue('1');
});

test('zoom keeps the viewport center on the same grid coordinate, including after scrolling', async ({ page }) => {
    await page.clock.install();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    test.setTimeout(60_000);
    await page.addInitScript(() => {
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
                (window as any).lifeGrid = {
                    pitch,
                    x: phase((document.documentElement.clientWidth / 2 - x) / pitch),
                    y: phase((innerHeight / 2 - y) / pitch),
                };
            }
            return fill.call(this, x, y, width, height);
        };
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(4100);
    await page.evaluate(() => {
        window.scrollTo({ top: 337, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(100);
    const before = await page.evaluate(() => (window as any).lifeGrid);
    // Dispatch without scrolling the entry button into view.
    await page.locator('[data-life-enter]').dispatchEvent('click');
    for (const elapsed of [2000, 2100]) {
        await page.clock.runFor(elapsed);
        const grid = await page.evaluate(() => (window as any).lifeGrid);
        expect(grid.pitch).toBeLessThan(before.pitch);
        expect(grid.x).toBeCloseTo(before.x, 6);
        expect(grid.y).toBeCloseTo(before.y, 6);
    }
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    const restored = await page.evaluate(() => (window as any).lifeGrid);
    expect(restored.pitch).toBeCloseTo(before.pitch, 6);
    expect(restored.x).toBeCloseTo(before.x, 6);
    expect(restored.y).toBeCloseTo(before.y, 6);
});

test('background zoom preserves website width, height and maximum scroll', async ({ page }) => {
    test.setTimeout(60_000);
    await page.clock.install();
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(500);
    const geometry = () => page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        height: document.documentElement.scrollHeight,
        maxScroll: document.documentElement.scrollHeight - innerHeight,
    }));
    const before = await geometry();
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    expect(await geometry()).toEqual(before);
    await page.evaluate(() => window.scrollTo({ top: 1_000_000, behavior: 'instant' }));
    await page.clock.runFor(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(before.maxScroll);
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    expect(await geometry()).toEqual(before);
});

test('exit narrows active columns and re-entry restores frozen cells without reseeding', async ({ page }) => {
    test.setTimeout(60_000);
    await page.clock.install();
    await page.addInitScript(() => {
        (window as any).lifeBoardAllocations = [];
        (window as any).lifeSeeds = 0;
        const from = Uint8Array.from;
        Uint8Array.from = function (...args) {
            if (args[0]?.length > 1000) (window as any).lifeSeeds++;
            return from.apply(this, args);
        };
        window.Uint8Array = new Proxy(Uint8Array, {
            construct(target, args) {
                if (typeof args[0] === 'number' && args[0] > 1000) {
                    (window as any).lifeBoardAllocations.push(args[0]);
                }
                return Reflect.construct(target, args);
            },
        });
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    const allocations = await page.evaluate(() => (window as any).lifeBoardAllocations);
    expect(allocations.length).toBeGreaterThan(0);
    const seeds = await page.evaluate(() => (window as any).lifeSeeds);
    await page.locator('[data-life-exit]').click({ position: { x: 30, y: 30 } });
    await page.clock.runFor(4100);
    await expect(page.locator('html')).not.toHaveClass(/life-immersed/);
    await expect(page.locator('[data-life-speed]')).toHaveValue('1');
    const narrowed = await page.evaluate(() => (window as any).lifeBoardAllocations.at(-1));
    expect(narrowed).toBeLessThan(allocations.at(-1));
    expect(await page.evaluate(() => (window as any).lifeSeeds)).toBe(seeds);
    // Re-entering restores the saved range, rather than seeding another universe.
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(100);
    expect(await page.evaluate(() => (window as any).lifeBoardAllocations.at(-1))).toBe(allocations.at(-1));
    expect(await page.evaluate(() => (window as any).lifeSeeds)).toBe(seeds);
});

test('manual speed input overrides the automatic ramp', async ({ page }) => {
    await page.clock.install();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(1000);
    const speed = page.locator('[data-life-speed]');
    await speed.fill('1.5');
    await page.clock.runFor(3500);
    await expect(speed).toHaveValue('1.5');
});
