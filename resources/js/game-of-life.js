// Conway B3/S23 on a cylinder: horizontal neighbors wrap; vertical edges stay dead.
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
                const neighborY = y + dy;
                if (neighborY < 0 || neighborY >= rows) continue;
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

// Both themes count animation time; hidden/suspended/reduced-motion time is excluded.
export function createLifeActivityMonitor() {
    const graceMs = 60_000;
    const windowMs = 15_000;
    const threshold = 0.0005;
    let ageMs = 0;
    let samples = [];
    let duration = 0;
    let weightedActivity = 0;

    return {
        record(changed, total, elapsedMs) {
            const previousAge = ageMs;
            ageMs += elapsedMs;
            // Do not collect low-activity evidence during the grace period.
            const measuredMs = Math.max(0, ageMs - Math.max(previousAge, graceMs));
            if (!measuredMs) return false;
            const rate = changed / total;
            samples.push({ duration: measuredMs, rate });
            duration += measuredMs;
            weightedActivity += measuredMs * rate;
            while (duration > windowMs) {
                const removed = Math.min(samples[0].duration, duration - windowMs);
                weightedActivity -= removed * samples[0].rate;
                samples[0].duration -= removed;
                duration -= removed;
                if (samples[0].duration <= 0) samples.shift();
            }
            return duration >= windowMs && weightedActivity / duration < threshold;
        },
    };
}
