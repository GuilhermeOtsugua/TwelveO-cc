// Fit a whole number of columns to the drawable width, without an extra
// clipped strip. centerColumn is a logical cell coordinate, not a pixel.
export function fitLifeWidth(width, cellSize, centerColumn = Math.ceil(width / cellSize) / 2) {
    const columns = Math.ceil(width / cellSize);
    const pitch = width / columns;
    const originX = width / 2 - centerColumn * pitch;
    // Select the copy of each cell whose center lies inside the viewport.
    // A partial square at either edge is the same cell, not an extra column.
    const firstColumn = Math.ceil((-originX - cellSize * 0.29) / pitch - 1e-9);
    return { columns, pitch, originX, firstColumn };
}
