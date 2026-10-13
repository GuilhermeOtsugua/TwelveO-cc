import test from 'node:test';
import assert from 'node:assert/strict';
import { rasterizeLife } from '../../resources/js/life-renderer.js';

function reference(width, height, world, pitch, originX, originY, color) {
    const data = new Uint8ClampedArray(width * height * 4);
    const square = pitch * 0.58;
    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            // The >= 3px pitch leaves over one pixel between squares, so a
            // pixel can intersect at most one square on each axis.
            const x = Math.floor((px + 1 - originX) / pitch);
            const y = Math.floor((py + 1 - originY) / pitch);
            const column = ((x % world.columns) + world.columns) % world.columns;
            const row = ((y % world.rows) + world.rows) % world.rows;
            if (!world.board[row * world.columns + column]) continue;
            const left = originX + x * pitch;
            const top = originY + y * pitch;
            const coverageX = Math.max(0, Math.min(left + square, px + 1) - Math.max(left, px));
            const coverageY = Math.max(0, Math.min(top + square, py + 1) - Math.max(top, py));
            const alpha = Math.round(255 * coverageX * coverageY);
            if (!alpha) continue;
            const pixel = (py * width + px) * 4;
            data.set([...color, alpha], pixel);
        }
    }
    return data;
}

for (const pitch of [3, 4, 10]) {
    for (const [originX, originY] of [[0, 0], [0.25, 0.75], [-9.5, -13.25], [51.75, 46.5]]) {
        test(`raster matches independent pixel coverage at pitch ${pitch}, origin ${originX},${originY}`, () => {
            const width = 41;
            const height = 36;
            const world = { columns: 3, rows: 2, board: Uint8Array.of(1, 0, 1, 0, 1, 0) };
            const color = [155, 184, 168];
            const pixels = new Uint32Array(width * height);
            rasterizeLife(pixels, width, height, world, pitch, originX, originY, color);
            const actual = new Uint8ClampedArray(pixels.buffer);
            const expected = reference(width, height, world, pitch, originX, originY, color);
            for (let i = 0; i < actual.length; i++) {
                // Absolute rectangle coordinates and a reusable fractional stamp
                // can round a half-alpha boundary differently by one byte.
                if (i % 4 === 3) assert.ok(Math.abs(actual[i] - expected[i]) <= 1, `alpha at byte ${i}`);
                else assert.equal(actual[i], expected[i], `color at byte ${i}`);
            }
            // Reusing the same storage must clear the previous generation.
            world.board.fill(0);
            rasterizeLife(pixels, width, height, world, pitch, originX, originY, color);
            assert.equal(actual.some(Boolean), false);
        });
    }
}

test('one-cell torus repeats through negative viewport coordinates', () => {
    const world = { columns: 1, rows: 1, board: Uint8Array.of(1) };
    const pixels = new Uint32Array(31 * 29);
    rasterizeLife(pixels, 31, 29, world, 3, -18.25, -30.5, [83, 108, 89]);
    assert.deepEqual(new Uint8ClampedArray(pixels.buffer), reference(31, 29, world, 3, -18.25, -30.5, [83, 108, 89]));
});
