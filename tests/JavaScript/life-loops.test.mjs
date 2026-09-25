import assert from 'node:assert/strict';
import test from 'node:test';
import { createLifeLoopMonitor, stepLife } from '../../resources/js/game-of-life.js';

function pulsar(withBlinker = false) {
    const board = new Uint8Array(40 * 40);
    const rows = ['..OOO...OOO..', '.............', 'O....O.O....O', 'O....O.O....O', 'O....O.O....O', '..OOO...OOO..', '.............', '..OOO...OOO..', 'O....O.O....O', 'O....O.O....O', 'O....O.O....O', '.............', '..OOO...OOO..'];
    rows.forEach((row, y) => [...row].forEach((cell, x) => { board[(y + 4) * 40 + x + 4] = Number(cell === 'O'); }));
    if (withBlinker) for (const x of [30, 31, 32]) board[30 * 40 + x] = 1;
    return board;
}

for (const mixed of [false, true]) {
    for (const speeds of [[0.5], [1], [4], [0.5, 4, 1.137, 2.718]]) {
        test(`${mixed ? 'period-six mixed world' : 'period-three pulsar'} confirms twelve states, then thirty active seconds (${speeds})`, () => {
            let board = pulsar(mixed), next = new Uint8Array(board.length);
            const original = board.slice(), monitor = createLifeLoopMonitor(board);
            let elapsed = 0, triggered = false;
            for (let generation = 1; generation < 1000; generation++) {
                stepLife(board, next, 40, 40); [board, next] = [next, board];
                if (generation === (mixed ? 6 : 3)) assert.deepEqual(board, original);
                const delta = 1000 / (6 * speeds[generation % speeds.length]);
                if (generation > 11) elapsed += delta;
                triggered = monitor.record(board, delta);
                assert.equal(triggered, elapsed >= 30_000, `generation ${generation}`);
                if (triggered) break;
            }
            assert.equal(triggered, true);
        });
    }
}

for (const period of [4, 5, 7, 32, 156]) {
    test(`period ${period} is intentionally outside the two/six-lag policy`, () => {
        const states = Array.from({ length: period }, (_, i) => Uint8Array.from({ length: period }, (_, j) => Number(i === j)));
        const monitor = createLifeLoopMonitor(states[0]);
        for (let generation = 1; generation <= period * 3 + 50; generation++) {
            assert.equal(monitor.record(states[generation % period], 60_000), false);
        }
    });
}

test('changing the last cell resets the six-lag timer and history owns reused buffers', () => {
    let board = pulsar(true), next = new Uint8Array(board.length);
    const monitor = createLifeLoopMonitor(board);
    const tick = delta => { stepLife(board, next, 40, 40); [board, next] = [next, board]; return monitor.record(board, delta); };
    for (let i = 0; i < 11; i++) assert.equal(tick(60_000), false);
    assert.equal(tick(29_999), false);
    board[board.length - 1] = 1;
    assert.equal(monitor.record(board, 60_000), false);
    board = pulsar(true); next.fill(0);
    for (let i = 0; i < 11; i++) assert.equal(tick(0), false);
    // Whatever phase was retained before the mutation, a complete new pair of cycles suffices.
    assert.equal(tick(0), false);
    assert.equal(tick(29_999), false);
    assert.equal(tick(1), true);
});
