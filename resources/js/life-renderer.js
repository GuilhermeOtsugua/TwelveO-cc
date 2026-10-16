const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;

// Vertical pitch remains integer in steady mode. Fractional horizontal spacing
// fits the torus exactly to the viewport without stretching the cached bitmap.
export function rasterizeLife(pixels, width, height, world, pitch, originX, originY, color, columnPitch = pitch) {
    pixels.fill(0);
    const square = pitch * 0.58;
    const fractionY = originY - Math.floor(originY);
    const stampHeight = Math.ceil(fractionY + square);
    const rgb = littleEndian ? color[0] | color[1] << 8 | color[2] << 16
        : color[0] << 24 | color[1] << 16 | color[2] << 8;
    const alphaShift = littleEndian ? 24 : 0;
    function makeStamp(fractionX) {
        const width = Math.ceil(fractionX + square);
        const data = new Uint32Array(width * stampHeight);
        for (let y = 0; y < stampHeight; y++) {
            const coverageY = Math.min(fractionY + square, y + 1) - Math.max(fractionY, y);
            for (let x = 0; x < width; x++) {
                const coverageX = Math.min(fractionX + square, x + 1) - Math.max(fractionX, x);
                const alpha = Math.round(255 * coverageX * coverageY);
                data[y * width + x] = alpha ? rgb | alpha << alphaShift : 0;
            }
        }
        return { width, data };
    }
    const uniformStamp = Number.isInteger(columnPitch) ? makeStamp(originX - Math.floor(originX)) : null;
    const firstRow = Math.floor(-originY / pitch);
    const lastRow = Math.ceil((height - originY) / pitch);
    const firstColumn = Math.floor(-originX / columnPitch);
    const lastColumn = Math.ceil((width - originX) / columnPitch);
    const offset = world.firstColumn ?? 0;
    const firstWrappedColumn = (((firstColumn - offset) % world.columns) + world.columns) % world.columns;
    // Prepare each column's coverage once, not once per living cell or row.
    const stamps = [];
    for (let x = firstColumn; x < lastColumn; x++) {
        const position = originX + x * columnPitch;
        const left = Math.floor(position);
        stamps.push({ left, stamp: uniformStamp ?? makeStamp(position - left) });
    }
    for (let y = firstRow; y < lastRow; y++) {
        const row = ((y % world.rows) + world.rows) % world.rows;
        const top = Math.floor(originY + y * pitch);
        const firstStampY = Math.max(0, -top);
        const lastStampY = Math.min(stampHeight, height - top);
        let column = firstWrappedColumn;
        for (let x = firstColumn; x < lastColumn; x++) {
            if (world.board[row * world.columns + column]) {
                const { left, stamp } = stamps[x - firstColumn];
                const firstStampX = Math.max(0, -left);
                const lastStampX = Math.min(stamp.width, width - left);
                for (let sy = firstStampY; sy < lastStampY; sy++) {
                    let pixel = (top + sy) * width + left + firstStampX;
                    let sample = sy * stamp.width + firstStampX;
                    for (let sx = firstStampX; sx < lastStampX; sx++) pixels[pixel++] = stamp.data[sample++];
                }
            }
            column = column === world.columns - 1 ? 0 : column + 1;
        }
    }
}

export function createLifeRenderer(context) {
    const canvas = context.canvas;
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = colorCanvas.height = 1;
    const colorContext = colorCanvas.getContext('2d', { willReadFrequently: true });
    if (!colorContext) return null;
    let overscan = 64;
    // At most 48 MB of reusable pixel storage, independent of document height.
    // Fall back to fillRect on exceptionally large CSS-sized viewports.
    const maxPixels = 12_000_000;
    let image;
    let pixels;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let rasterRatio = 1;
    let color;
    let colorValue;
    let cachedScroll = null;
    let surfaceExpanded = false;

    function invalidate() {
        cachedScroll = null;
    }

    function restoreSurface() {
        if (!surfaceExpanded) return;
        canvas.style.removeProperty('height');
        canvas.style.removeProperty('top');
        canvas.style.removeProperty('transform');
        canvas.style.removeProperty('will-change');
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        surfaceExpanded = false;
        invalidate();
    }

    function release() {
        restoreSurface();
        image = pixels = null;
        invalidate();
    }

    function present(scrollY) {
        if (cachedScroll === null || Math.abs(scrollY - cachedScroll) > overscan) return false;
        // The compositor moves the already-rasterized field. There is no pixel
        // upload or canvas copy on scroll/calculation-only frames.
        canvas.style.transform = `translate3d(0, ${cachedScroll - scrollY}px, 0)`;
        return true;
    }

    return {
        resize(viewWidth, viewHeight, viewRatio, layoutWidth = viewWidth) {
            // Match the CSS breakpoint, including any reserved scrollbar.
            // Fast mobile scrolling needs more travel between Life paints;
            // desktop retains its smaller buffer and rasterization workload.
            const nextOverscan = layoutWidth <= 639 ? 256 : 64;
            if (width !== viewWidth || height !== viewHeight || ratio !== viewRatio || overscan !== nextOverscan) restoreSurface();
            width = viewWidth;
            height = viewHeight;
            ratio = viewRatio;
            overscan = nextOverscan;
            // HiDPI phones need finer edge coverage for the tiny stars. An
            // integer 2x scale preserves the reusable stamp's integer pitch;
            // desktop and 1x displays retain the cheaper CSS-pixel bitmap.
            rasterRatio = layoutWidth <= 639 && ratio > 1 ? 2 : 1;
            const pixelsWide = Math.round(width * rasterRatio);
            const pixelsHigh = Math.round((height + overscan * 2) * rasterRatio);
            if (pixelsWide * pixelsHigh > maxPixels) {
                release();
                return;
            }
            if (image && image.width === pixelsWide && image.height === pixelsHigh) return;
            image = context.createImageData(pixelsWide, pixelsHigh);
            pixels = new Uint32Array(image.data.buffer);
            invalidate();
        },
        setColor(value) {
            if (colorValue === value) return;
            colorContext.clearRect(0, 0, 1, 1);
            colorContext.fillStyle = value;
            colorContext.fillRect(0, 0, 1, 1);
            color = colorContext.getImageData(0, 0, 1, 1).data;
            colorValue = value;
            invalidate();
        },
        draw(world, pitch, originX, originY, scrollY, columnPitch = pitch) {
            if (!image) return false;
            if (!surfaceExpanded) {
                canvas.width = image.width;
                canvas.height = image.height;
                context.setTransform(1, 0, 0, 1, 0, 0);
                canvas.style.height = `${height + overscan * 2}px`;
                canvas.style.top = `${-overscan}px`;
                canvas.style.willChange = 'transform';
                surfaceExpanded = true;
            }
            rasterizeLife(pixels, image.width, image.height, world,
                pitch * rasterRatio, originX * rasterRatio, (originY - scrollY + overscan) * rasterRatio, color, columnPitch * rasterRatio);
            context.putImageData(image, 0, 0);
            cachedScroll = scrollY;
            return present(scrollY);
        },
        present,
        invalidate,
        restoreSurface,
        release,
    };
}
