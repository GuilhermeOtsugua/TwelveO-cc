const littleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;

// Steady-mode pitch is an integer >= 3 CSS pixels. Every cell therefore has
// the same fractional edge coverage: calculate one tiny stamp, then copy its
// packed RGBA pixels. Zoom/fade rendering stays on the original fillRect path.
export function rasterizeLife(pixels, width, height, world, pitch, originX, originY, color) {
    pixels.fill(0);
    const square = pitch * 0.58;
    const fractionX = originX - Math.floor(originX);
    const fractionY = originY - Math.floor(originY);
    const stampWidth = Math.ceil(fractionX + square);
    const stampHeight = Math.ceil(fractionY + square);
    const stamp = new Uint32Array(stampWidth * stampHeight);
    const rgb = littleEndian ? color[0] | color[1] << 8 | color[2] << 16
        : color[0] << 24 | color[1] << 16 | color[2] << 8;
    const alphaShift = littleEndian ? 24 : 0;
    for (let y = 0; y < stampHeight; y++) {
        const coverageY = Math.min(fractionY + square, y + 1) - Math.max(fractionY, y);
        for (let x = 0; x < stampWidth; x++) {
            const coverageX = Math.min(fractionX + square, x + 1) - Math.max(fractionX, x);
            const alpha = Math.round(255 * coverageX * coverageY);
            stamp[y * stampWidth + x] = rgb | alpha << alphaShift;
        }
    }
    const firstRow = Math.floor(-originY / pitch);
    const lastRow = Math.ceil((height - originY) / pitch);
    const firstColumn = Math.floor(-originX / pitch);
    const lastColumn = Math.ceil((width - originX) / pitch);
    const firstWrappedColumn = ((firstColumn % world.columns) + world.columns) % world.columns;
    for (let y = firstRow; y < lastRow; y++) {
        const row = ((y % world.rows) + world.rows) % world.rows;
        const top = Math.floor(originY + y * pitch);
        const firstStampY = Math.max(0, -top);
        const lastStampY = Math.min(stampHeight, height - top);
        let column = firstWrappedColumn;
        for (let x = firstColumn; x < lastColumn; x++) {
            if (world.board[row * world.columns + column]) {
                const left = Math.floor(originX + x * pitch);
                const firstStampX = Math.max(0, -left);
                const lastStampX = Math.min(stampWidth, width - left);
                for (let sy = firstStampY; sy < lastStampY; sy++) {
                    let pixel = (top + sy) * width + left + firstStampX;
                    let sample = sy * stampWidth + firstStampX;
                    for (let sx = firstStampX; sx < lastStampX; sx++) pixels[pixel++] = stamp[sample++];
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
    const overscan = 64;
    // At most 48 MB of reusable pixel storage, independent of document height.
    // Fall back to fillRect on exceptionally large CSS-sized viewports.
    const maxPixels = 12_000_000;
    let image;
    let pixels;
    let width = 0;
    let height = 0;
    let ratio = 1;
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
        resize(viewWidth, viewHeight, viewRatio) {
            width = viewWidth;
            height = viewHeight;
            ratio = viewRatio;
            // The tiny Life squares use CSS-pixel coverage; the compositor
            // scales the bitmap on HiDPI displays. Cell spacing, simulation
            // density and the rest of the website's resolution are unchanged.
            const pixelsWide = Math.round(width);
            const pixelsHigh = Math.round(height + overscan * 2);
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
        draw(world, pitch, originX, originY, scrollY) {
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
                pitch, originX, originY - scrollY + overscan, color);
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
