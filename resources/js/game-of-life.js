// Conway B3/S23 on a torus: both axes wrap across the active world's edges.
export function createLifeBoard(columns, rows, random = Math.random) {
    return Uint8Array.from({ length: columns * rows }, () => random() < 0.3 ? 1 : 0);
}

export function createLifeWorld(columns, rows, random = Math.random, firstColumn = 0) {
    const board = createLifeBoard(columns, rows, random);
    return {
        board, columns, rows,
        storedBoard: board.slice(),
        storedColumns: columns,
        storedRows: rows,
        firstColumn, storedFirstColumn: firstColumn,
    };
}

// Evolve only the active board. Keep excluded cells frozen until they fit again.
export function resizeLifeWorld(world, columns, rows, random = Math.random, firstColumn = world.firstColumn) {
    if (columns === world.columns && rows === world.rows && firstColumn === world.firstColumn) return world;
    const storedFirstColumn = Math.min(firstColumn, world.storedFirstColumn);
    const storedColumns = Math.max(firstColumn + columns, world.storedFirstColumn + world.storedColumns) - storedFirstColumn;
    const storedRows = Math.max(rows, world.storedRows);
    let storedBoard = world.storedBoard;
    if (storedColumns !== world.storedColumns || storedRows !== world.storedRows || storedFirstColumn !== world.storedFirstColumn) {
        storedBoard = new Uint8Array(storedColumns * storedRows);
        for (let y = 0; y < storedRows; y++) {
            for (let x = 0; x < storedColumns; x++) {
                const oldX = x + storedFirstColumn - world.storedFirstColumn;
                storedBoard[y * storedColumns + x] = oldX >= 0 && oldX < world.storedColumns && y < world.storedRows
                    ? world.storedBoard[y * world.storedColumns + oldX]
                    : (random() < 0.3 ? 1 : 0);
            }
        }
    }
    // Save the current generation before changing the viewport's active bounds.
    for (let y = 0; y < world.rows; y++) {
        storedBoard.set(world.board.subarray(y * world.columns, (y + 1) * world.columns),
            y * storedColumns + world.firstColumn - storedFirstColumn);
    }
    const board = new Uint8Array(columns * rows);
    for (let y = 0; y < rows; y++) {
        const start = y * storedColumns + firstColumn - storedFirstColumn;
        board.set(storedBoard.subarray(start, start + columns), y * columns);
    }
    return { board, columns, rows, storedBoard, storedColumns, storedRows, firstColumn, storedFirstColumn };
}

export function stepLife(board, next, columns, rows) {
    let changed = 0;
    for (let y = 0; y < rows; y++) {
        const row = y * columns;
        const above = (y === 0 ? rows - 1 : y - 1) * columns;
        const below = (y === rows - 1 ? 0 : y + 1) * columns;
        // Slide three vertical sums across the row: each new column needs
        // only three neighbor reads, with no modulo or scratch allocations.
        const last = columns - 1;
        let leftSum = board[above + last] + board[row + last] + board[below + last];
        let centerSum = board[above] + board[row] + board[below];
        for (let x = 0; x < columns; x++) {
            const right = x === last ? 0 : x + 1;
            const rightSum = board[above + right] + board[row + right] + board[below + right];
            const index = row + x;
            const alive = board[index];
            const neighbors = leftSum + centerSum + rightSum - alive;
            next[index] = neighbors === 3 || (alive === 1 && neighbors === 2) ? 1 : 0;
            changed += next[index] !== alive ? 1 : 0;
            leftSum = centerSum;
            centerSum = rightSum;
        }
    }
    return changed;
}

// Exact two/six-generation comparisons cover periods 1, 2, 3 and 6, not 4 or 5.
// Confirm two complete lag-length sequences before counting 30 active seconds.
// Callers exclude inactive time. A cyclic span can restrict comparisons to the
// visible rows; history still owns its buffers, independent of simulation swaps.
export function createLifeLoopMonitor(initialBoard) {
    const history = Array.from({ length: 6 }, () => new Uint8Array(initialBoard.length));
    history[0].set(initialBoard);
    const checks = [2, 6].map(period => ({ period, matches: 0, elapsed: 0 }));
    let slot = 1;
    let samples = 1;
    let spanStart = 0;
    let spanLength = initialBoard.length;

    function reset() {
        slot = samples = 0;
        for (const check of checks) check.matches = check.elapsed = 0;
    }

    return {
        reset,
        record(board, elapsedMs, start = 0, length = board.length) {
            if (length === 0) {
                reset();
                return false;
            }
            if (start !== spanStart || length !== spanLength) {
                reset();
                spanStart = start;
                spanLength = length;
            }
            let reseed = false;
            for (const check of checks) {
                const previous = history[(slot + history.length - check.period) % history.length];
                let equal = samples >= check.period;
                const end = Math.min(board.length, start + length);
                for (let i = start; equal && i < end; i++) {
                    if (board[i] !== previous[i]) equal = false;
                }
                for (let i = 0; equal && i < start + length - board.length; i++) {
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
