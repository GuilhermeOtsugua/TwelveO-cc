import assert from 'node:assert/strict';
import test from 'node:test';
import { createLifeLoopMonitor, stepLife } from '../../resources/js/game-of-life.js';
import { visibleLifeSpan } from '../../resources/js/life-viewport.js';

const confirm = (monitor, board, start, length) => {
    for (let i = 0; i < 4; i++) assert.equal(monitor.record(board, 0, start, length), false);
};

test('moving offscreen glider does not prevent a stagnant viewport from repopulating', () => {
    const columns = 20, rows = 1000;
    let board = new Uint8Array(columns * rows), next = new Uint8Array(board.length);
    for (const [x, y] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) board[(y + 400) * columns + x + 8] = 1;
    const visible = createLifeLoopMonitor(board), whole = createLifeLoopMonitor(board);
    let triggered = false;
    for (let generation = 1; generation <= 160; generation++) {
        stepLife(board, next, columns, rows); [board, next] = [next, board];
        assert.equal(whole.record(board, 200), false);
        const result = visible.record(board, 200, 0, columns * 5);
        assert.equal(result, generation >= 154);
        triggered ||= result;
    }
    assert.equal(triggered, true);
});

test('only visible changes reset the timer, including the last visible cell', () => {
    const board = new Uint8Array(36), monitor = createLifeLoopMonitor(board);
    confirm(monitor, board, 6, 6);
    assert.equal(monitor.record(board, 29_999, 6, 6), false);
    board[12] = 1;
    assert.equal(monitor.record(board, 1, 6, 6), true);
    monitor.reset();
    confirm(monitor, board, 6, 6);
    assert.equal(monitor.record(board, 29_999, 6, 6), false);
    board[11] = 1;
    assert.equal(monitor.record(board, 60_000, 6, 6), false);
});

for (const index of [1, 23]) {
    test(`visible span crossing the vertical seam observes cell ${index}`, () => {
        const board = new Uint8Array(24), monitor = createLifeLoopMonitor(board);
        confirm(monitor, board, 18, 12);
        assert.equal(monitor.record(board, 29_999, 18, 12), false);
        board[index] = 1;
        assert.equal(monitor.record(board, 60_000, 18, 12), false);
    });
}

test('changing the view span or explicitly resetting restarts confirmation without retaining old elapsed time', () => {
    const board = new Uint8Array(36), monitor = createLifeLoopMonitor(board);
    confirm(monitor, board, 0, 6);
    assert.equal(monitor.record(board, 29_999, 0, 6), false);
    assert.equal(monitor.record(board, 60_000, 12, 6), false);
    for (let i = 0; i < 3; i++) assert.equal(monitor.record(board, 0, 12, 6), false);
    assert.equal(monitor.record(board, 29_999, 12, 6), false);
    monitor.reset();
    confirm(monitor, board, 12, 6);
    assert.equal(monitor.record(board, 29_999, 12, 6), false);
    assert.equal(monitor.record(board, 1, 12, 6), true);
});

test('empty spans cannot start a repopulation timer', () => {
    const board = new Uint8Array(24), monitor = createLifeLoopMonitor(board);
    for (let i = 0; i < 20; i++) assert.equal(monitor.record(board, 60_000, 0, 0), false);
});

for (const [scroll, origin, height, expected] of [
    [0, 0, 20, { start: 0, length: 8 }],
    [5.8, 0, 20, { start: 4, length: 8 }],
    [6, 0, 3, { start: 4, length: 0 }],
    [0, 25, 20, { start: 28, length: 12 }],
    [95, 0, 20, { start: 36, length: 12 }],
    [0, 0, 120, { start: 0, length: 40 }],
]) {
    test(`visible squares: scroll ${scroll}, origin ${origin}, height ${height}`, () => {
        assert.deepEqual(visibleLifeSpan({ columns: 4, rows: 10 }, 10, origin, scroll, height), expected);
    });
}
