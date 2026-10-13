import test from 'node:test';
import assert from 'node:assert/strict';
import { stepLife } from '../../resources/js/game-of-life.js';

// Deliberately simple reference: wrapping counts all eight positions even when
// a tiny torus maps several of them to the same cell.
function referenceStep(board, next, columns, rows) {
    let changed = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let neighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx || dy) neighbors += board[((y + dy + rows) % rows) * columns + (x + dx + columns) % columns];
                }
            }
            const i = y * columns + x;
            next[i] = Number(neighbors === 3 || (board[i] === 1 && neighbors === 2));
            changed += Number(next[i] !== board[i]);
        }
    }
    return changed;
}

for (const [columns, rows] of [[1, 1], [1, 7], [8, 1], [2, 2], [2, 9], [11, 2], [3, 3], [39, 84], [144, 417], [480, 1389]]) {
    test(`optimized step matches reference across 20 generations on ${columns}x${rows}`, () => {
        let seed = 17;
        const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
        let board = Uint8Array.from({ length: columns * rows }, () => Number(random() < 0.3));
        let next = new Uint8Array(board.length);
        const expected = new Uint8Array(board.length);
        for (let generation = 0; generation < 20; generation++) {
            const original = board.slice();
            const changed = referenceStep(board, expected, columns, rows);
            assert.equal(stepLife(board, next, columns, rows), changed);
            assert.deepEqual(next, expected);
            assert.deepEqual(board, original, 'input board must remain unchanged');
            [board, next] = [next, board];
        }
    });
}
