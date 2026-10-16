import test from 'node:test';
import assert from 'node:assert/strict';
import { fitLifeWidth } from '../../resources/js/life-layout.js';
import { createLifeWorld, resizeLifeWorld, stepLife } from '../../resources/js/game-of-life.js';

for (const width of [390, 393, 428, 1264, 1283, 1903]) {
    for (const size of [3, 10]) {
        test(`width ${width}, cell size ${size}: exactly one torus spans the viewport`, () => {
            const layout = fitLifeWidth(width, size, 63.2);
            assert.ok(Math.abs(layout.columns * layout.pitch - width) < 1e-9);
            assert.ok(Math.abs((width / 2 - layout.originX) / layout.pitch - 63.2) < 1e-9);
            const firstCenter = layout.originX + layout.firstColumn * layout.pitch + size * .29;
            assert.ok(firstCenter >= -1e-8 && firstCenter < layout.pitch + 1e-8);
            const lastCenter = firstCenter + (layout.columns - 1) * layout.pitch;
            assert.ok(lastCenter < width + 1e-8);
        });
    }
}

test('signed windows freeze both sides and preserve every overlapping cell by identity', () => {
    let world = createLifeWorld(11, 7, () => .9, -4);
    world.board.forEach((_, i) => world.board[i] = Number(i % 3 === 0));
    const original = world.board.slice();
    world = resizeLifeWorld(world, 5, 7, () => { throw Error('Existing cells must not be seeded'); }, -1);
    const next = new Uint8Array(world.board.length);
    stepLife(world.board, next, world.columns, world.rows);
    world.board = next;
    const evolved = world.board.slice();
    world = resizeLifeWorld(world, 11, 7, () => { throw Error('Frozen cells must be restored'); }, -4);
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 11; x++) {
            assert.equal(world.board[y * 11 + x], x >= 3 && x < 8 ? evolved[y * 5 + x - 3] : original[y * 11 + x]);
        }
    }
    let seeds = 0;
    world = resizeLifeWorld(world, 15, 7, () => { seeds++; return .9; }, -7);
    assert.equal(seeds, 4 * 7);
    assert.equal(world.storedFirstColumn, -7);
    for (let y = 0; y < 7; y++) {
        assert.deepEqual(world.board.subarray(y * 15 + 3, y * 15 + 14),
            Uint8Array.from({ length: 11 }, (_, x) => x >= 3 && x < 8 ? evolved[y * 5 + x - 3] : original[y * 11 + x]));
    }
});

for (const columns of [39, 127, 422]) {
    test(`a glider wraps the active ${columns}-column window, not its larger frozen storage`, () => {
        let world = createLifeWorld(columns + 30, 9, () => .9, -15);
        world = resizeLifeWorld(world, columns, 9, () => .9, 0);
        const shape = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
        const pattern = shift => {
            const board = new Uint8Array(columns * 9);
            for (const [x, y] of shape) board[(y + 2) * columns + (x + columns - 2 + shift) % columns] = 1;
            return board;
        };
        world.board = pattern(0);
        for (let i = 0; i < 4; i++) {
            const next = new Uint8Array(world.board.length);
            stepLife(world.board, next, columns, 9);
            world.board = next;
        }
        // A glider advances diagonally by one cell in four generations.
        const expected = new Uint8Array(columns * 9);
        for (const [x, y] of shape) expected[(y + 3) * columns + (x + columns - 1) % columns] = 1;
        assert.deepEqual(world.board, expected);
        assert.equal(world.storedColumns, columns + 30);
    });
}
