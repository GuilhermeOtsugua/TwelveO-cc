// Settled modes expose every active column. Only rows whose actual squares
// intersect the viewport count, not the cache's vertical overscan or empty gaps.
export function visibleLifeSpan(world, cellSize, originY, scrollY, height) {
    const first = Math.floor((scrollY - originY - cellSize * 0.58) / cellSize) + 1;
    const end = Math.ceil((scrollY + height - originY) / cellSize);
    const row = ((first % world.rows) + world.rows) % world.rows;
    return { start: row * world.columns, length: Math.min(world.rows, end - first) * world.columns };
}
