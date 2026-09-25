// Conway B3/S23 on a torus: both axes wrap across the active world's edges.
export function createLifeBoard(columns, rows, random = Math.random) {
    return Uint8Array.from({ length: columns * rows }, () => random() < 0.3 ? 1 : 0);
}

export function createLifeWorld(columns, rows, random = Math.random) {
    const board = createLifeBoard(columns, rows, random);
    return {
        board, columns, rows,
        storedBoard: board.slice(),
        storedColumns: columns,
        storedRows: rows,
    };
}

// Evolve only the active board. Keep excluded cells frozen until they fit again.
export function resizeLifeWorld(world, columns, rows, random = Math.random) {
    if (columns === world.columns && rows === world.rows) return world;
    const storedColumns = Math.max(columns, world.storedColumns);
    const storedRows = Math.max(rows, world.storedRows);
    let storedBoard = world.storedBoard;
    if (storedColumns !== world.storedColumns || storedRows !== world.storedRows) {
        storedBoard = new Uint8Array(storedColumns * storedRows);
        for (let y = 0; y < storedRows; y++) {
            for (let x = 0; x < storedColumns; x++) {
                storedBoard[y * storedColumns + x] = x < world.storedColumns && y < world.storedRows
                    ? world.storedBoard[y * world.storedColumns + x]
                    : (random() < 0.3 ? 1 : 0);
            }
        }
    }
    // Save the current generation before changing the viewport's active bounds.
    for (let y = 0; y < world.rows; y++) {
        storedBoard.set(world.board.subarray(y * world.columns, (y + 1) * world.columns), y * storedColumns);
    }
    const board = new Uint8Array(columns * rows);
    for (let y = 0; y < rows; y++) {
        board.set(storedBoard.subarray(y * storedColumns, y * storedColumns + columns), y * columns);
    }
    return { board, columns, rows, storedBoard, storedColumns, storedRows };
}

export function stepLife(board, next, columns, rows) {
    let changed = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let neighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
                const neighborY = (y + dy + rows) % rows;
                for (let dx = -1; dx <= 1; dx++) {
                    if (!dx && !dy) continue;
                    const neighborX = (x + dx + columns) % columns;
                    neighbors += board[neighborY * columns + neighborX];
                }
            }
            const index = y * columns + x;
            next[index] = neighbors === 3 || (board[index] === 1 && neighbors === 2) ? 1 : 0;
            changed += next[index] !== board[index] ? 1 : 0;
        }
    }
    return changed;
}

// Exact two/six-generation comparisons cover periods 1, 2, 3 and 6, not 4 or 5.
// Confirm two complete lag-length sequences before counting 30 active seconds.
// Callers exclude inactive time and replace the monitor on resize/repopulation.
export function createLifeLoopMonitor(initialBoard) {
    const history = Array.from({ length: 6 }, () => new Uint8Array(initialBoard.length));
    history[0].set(initialBoard);
    const checks = [2, 6].map(period => ({ period, matches: 0, elapsed: 0 }));
    let slot = 1;
    let samples = 1;

    return {
        record(board, elapsedMs) {
            let reseed = false;
            for (const check of checks) {
                const previous = history[(slot + history.length - check.period) % history.length];
                let equal = samples >= check.period;
                for (let i = 0; equal && i < board.length; i++) {
                    if (board[i] !== previous[i]) equal = false;
                }
                if (equal) {
                    // Independent timers preserve the original four-state fast path.
                    if (check.matches === check.period) check.elapsed += elapsedMs;
                    check.matches = Math.min(check.period, check.matches + 1);
                } else {
                    check.matches = 0;
                    check.elapsed = 0;
                }
                reseed ||= check.elapsed >= 30_000;
            }
            // Both checks read before overwriting; the simulation reuses its buffers.
            history[slot].set(board);
            slot = (slot + 1) % history.length;
            samples = Math.min(history.length, samples + 1);
            return reseed;
        },
    };
}
