import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('scrolling within overscan moves the cached field without rebuilding every frame', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => {
        (window as any).lifeUploads = 0;
        const put = CanvasRenderingContext2D.prototype.putImageData;
        CanvasRenderingContext2D.prototype.putImageData = function (...args) {
            if (this.canvas.classList.contains('life-background')) (window as any).lifeUploads++;
            return put.apply(this, args);
        };
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    await page.locator('[data-life-speed]').fill('0.5');
    await page.clock.runFor(1000);
    await page.evaluate(() => {
        (window as any).lifeUploads = 0;
        (window as any).lifeTransforms = [];
        (window as any).lifeScrolling = true;
        const scroll = (now: number) => {
            if (!(window as any).lifeScrolling) return;
            window.scrollTo({ top: (now % 1000) / 25, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
            (window as any).lifeTransforms.push((document.querySelector('.life-background') as HTMLElement).style.transform);
            (window as any).lifeScrollFrame = requestAnimationFrame(scroll);
        };
        (window as any).lifeScrollFrame = requestAnimationFrame(scroll);
    });
    await page.clock.runFor(1000);
    const result = await page.evaluate(() => {
        (window as any).lifeScrolling = false;
        cancelAnimationFrame((window as any).lifeScrollFrame);
        const transforms = (window as any).lifeTransforms as string[];
        return { uploads: (window as any).lifeUploads, moves: transforms.filter((value, i) => i > 0 && value !== transforms[i - 1]).length };
    });
    expect(Math.abs(result.uploads - 3)).toBeLessThanOrEqual(1);
    expect(result.moves).toBeGreaterThan(30);
});

test('cache preserves palettes and restores native canvas dimensions on exit', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => localStorage.setItem('otsugua.theme.preference', 'dark'));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    await page.locator('[data-life-speed]').fill('0.5');
    // Visibility reset gives an empty generation phase for the color-only check.
    await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.clock.runFor(100);
    const pixels = () => page.locator('canvas.life-background').evaluate((canvas: HTMLCanvasElement) => {
        const data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
        let color: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 255) {
                color = [...data.slice(i, i + 3)];
                break;
            }
        }
        return { color, width: canvas.width, height: canvas.height };
    });
    const dark = await pixels();
    await page.locator('[data-theme-option="light"]').dispatchEvent('click');
    await page.clock.runFor(34);
    const light = await pixels();
    expect([light.width, light.height]).toEqual([dark.width, dark.height]);
    expect(dark.color).toEqual([155, 184, 168]);
    expect(light.color).toEqual([83, 108, 89]);
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    const geometry = await page.locator('canvas.life-background').evaluate((canvas: HTMLCanvasElement) => ({
        width: canvas.width, height: canvas.height,
        expectedWidth: Math.round(document.documentElement.clientWidth * Math.min(devicePixelRatio, 2)),
        expectedHeight: Math.round(innerHeight * Math.min(devicePixelRatio, 2)),
        style: [canvas.style.height, canvas.style.top, canvas.style.transform, canvas.style.willChange],
    }));
    expect(geometry.width).toBe(geometry.expectedWidth);
    expect(geometry.height).toBe(geometry.expectedHeight);
    expect(geometry.style).toEqual(['', '', '', '']);
});

test('renderer bounds memory, refuses uncovered scroll and restores native DPI', async ({ page }) => {
    const source = await readFile(new URL('../../resources/js/life-renderer.js', import.meta.url), 'utf8');
    await page.route('**/__test-life-renderer.js', route => route.fulfill({ contentType: 'application/javascript', body: source }));
    await page.goto('/');
    const result = await page.evaluate(async () => {
        const { createLifeRenderer } = await import('/__test-life-renderer.js');
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 48;
        const context = canvas.getContext('2d')!;
        const renderer = createLifeRenderer(context);
        const world = { columns: 1, rows: 1, board: Uint8Array.of(1) };
        renderer.resize(32, 24, 2);
        renderer.setColor('rgb(155, 184, 168)');
        const painted = renderer.draw(world, 3, 0, 0, 100);
        const before = context.getImageData(0, 0, canvas.width, canvas.height).data;
        renderer.setColor('rgb(83, 108, 89)');
        renderer.draw(world, 3, 0, 0, 100);
        const after = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const sameAlpha = before.every((value: number, i: number) => i % 4 !== 3 || value === after[i]);
        const palette = [[...before.slice(0, 3)], [...after.slice(0, 3)]];
        const within = renderer.present(132);
        const shifted = canvas.style.transform;
        const uncovered = renderer.present(200);
        const unchanged = canvas.style.transform === shifted;
        renderer.release();
        const restored = [canvas.width, canvas.height, canvas.style.height, canvas.style.transform];
        renderer.resize(5000, 3000, 2);
        const tooLarge = renderer.draw(world, 3, 0, 0, 0);
        return { painted, within, uncovered, unchanged, restored, tooLarge, sameAlpha, palette };
    });
    expect(result).toEqual({ painted: true, within: true, uncovered: false, unchanged: true, restored: [64, 48, '', ''], tooLarge: false,
        sameAlpha: true, palette: [[155, 184, 168], [83, 108, 89]] });
});
