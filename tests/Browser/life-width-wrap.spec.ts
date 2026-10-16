import { expect, test } from '@playwright/test';

for (const immersed of [false, true]) {
    test(`${immersed ? 'background' : 'normal'} mode glider crosses the visible width at a non-divisible viewport size`, async ({ page }) => {
        test.setTimeout(90_000);
        const width = 1283;
        const height = 800;
        await page.setViewportSize({ width, height });
        await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(() => {
            Math.random = () => .9;
            (window as any).seedVisibleGlider = true;
            (window as any).wrapBoardCells = 0;
            const set = Uint8Array.prototype.set;
            Uint8Array.prototype.set = function (source, offset) {
                if (source instanceof Uint8Array && source.length > 1000) {
                    (window as any).wrapBoardCells = source.length;
                    if ((window as any).seedVisibleGlider) {
                        const size = document.documentElement.classList.contains('life-immersed') ? 3 : 10;
                        const columns = Math.ceil(document.documentElement.clientWidth / size);
                        source.fill(0);
                        for (const [x, y] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) {
                            source[(y + 2) * columns + (x + columns - 2) % columns] = 1;
                        }
                        (window as any).seedVisibleGlider = false;
                    }
                }
                return set.call(this, source, offset);
            };
        });
        await page.goto('/');
        await page.evaluate(() => document.fonts.ready);
        await page.clock.runFor(100);
        const normalCells = await page.evaluate(() => (window as any).wrapBoardCells);
        if (immersed) {
            await page.evaluate(() => (window as any).seedVisibleGlider = true);
            await page.locator('[data-life-enter]').click();
            await page.clock.runFor(100);
        }
        const sample = () => page.evaluate(immersed => {
            const canvas = document.querySelector('canvas.life-background') as HTMLCanvasElement;
            const width = document.documentElement.clientWidth;
            const size = immersed ? 3 : 10;
            const columns = Math.ceil(width / size);
            const pitch = width / columns;
            const normalColumns = Math.ceil(width / 10);
            const originX = immersed ? width / 2 - normalColumns / 2 * pitch : 0;
            const originY = immersed ? innerHeight / 2 * .7 : 0;
            const first = Math.ceil((-originX - size * .29) / pitch - 1e-9);
            const ratio = canvas.width / width;
            const canvasTop = canvas.getBoundingClientRect().top;
            const data = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
            const alive: number[][] = [];
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < columns; x++) {
                    const px = Math.min(canvas.width - 1, Math.max(0, Math.floor((originX + (first + x) * pitch + size * .29) * ratio)));
                    const py = Math.floor((originY + y * size + size * .29 - canvasTop) * ratio);
                    if (data[(py * canvas.width + px) * 4 + 3]) alive.push([x, y]);
                }
            }
            return { alive, columns, period: columns * pitch, width,
                cells: (window as any).wrapBoardCells, canvasWidth: canvas.getBoundingClientRect().width };
        }, immersed);
        const before = await sample();
        expect(before.period).toBeCloseTo(before.width, 9);
        expect(before.canvasWidth).toBe(before.width);
        const shape = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
        const expected = (shift: number) => shape.map(([x, y]) => [(x + before.columns - 2 + shift) % before.columns, y + 2 + shift])
            .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
        expect(before.alive).toEqual(expected(0));
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await page.clock.runFor(immersed ? 205 : 700);
        const after = await sample();
        expect(after.alive).toEqual(expected(1));
        if (immersed) expect(after.cells).toBeGreaterThan(normalCells);
    });
}
