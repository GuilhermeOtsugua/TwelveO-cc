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

// Two consecutive matches against two generations ago establish A-B-A-B.
// Callers supply active elapsed time only and replace the monitor on world resize.
export function createLifeLoopMonitor(initialBoard) {
    const history = [initialBoard.slice(), new Uint8Array(initialBoard.length)];
    let slot = 1;
    let samples = 1;
    let matches = 0;
    let loopMs = 0;

    return {
        record(board, elapsedMs) {
            const previous = history[slot];
            let equal = samples >= 2;
            for (let i = 0; equal && i < board.length; i++) {
                if (board[i] !== previous[i]) equal = false;
            }
            if (equal) {
                // Start timing only after all four states have confirmed the loop.
                if (matches === 2) loopMs += elapsedMs;
                matches = Math.min(2, matches + 1);
            } else {
                matches = 0;
                loopMs = 0;
            }
            // The simulation reuses its buffers, so retain owned snapshots, not references.
            previous.set(board);
            slot = 1 - slot;
            samples = Math.min(2, samples + 1);
            return loopMs >= 30_000;
        },
    };
}
