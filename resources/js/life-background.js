import { createLifeActivityMonitor, createLifeWorld, resizeLifeWorld, stepLife } from './game-of-life';

const page = document.querySelector('.otsugua-page');

if (page) initializeLifeBackground(page);

function initializeLifeBackground(page) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.className = 'life-background';
    canvas.setAttribute('aria-hidden', 'true');
    page.prepend(canvas);

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let world;
    let next;
    let cellSize = 10;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let frame = 0;
    let lastStep = 0;
    let lastFrame = 0;
    let dirty = true;
    let suspended = false;
    let activity = createLifeActivityMonitor();
    let fadeElapsed = null;
    let reseeded = false;
    const stepInterval = 1000 / 6;
    const fadeDuration = 800;
    const isDark = () => root.dataset.themeEffective === 'dark';
    const canAnimate = () => isDark() && !reducedMotion.matches && !document.hidden && !suspended;

    function measure() {
        viewportWidth = root.clientWidth;
        viewportHeight = window.innerHeight;
        const worldHeight = Math.max(page.scrollHeight, viewportHeight);
        // Restore the original square pitch and its unusually-large-page safeguard.
        cellSize = Math.max(10, Math.ceil(Math.sqrt(viewportWidth * worldHeight / 180_000)));
        const columns = Math.ceil(viewportWidth / cellSize);
        const rows = Math.ceil(worldHeight / cellSize);
        const previousWorld = world;
        world = world ? resizeLifeWorld(world, columns, rows) : createLifeWorld(columns, rows);
        if (world !== previousWorld) next = new Uint8Array(world.board.length);
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(viewportWidth * ratio);
        canvas.height = Math.round(viewportHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        dirty = true;
    }

    function reseed() {
        // Discard the previous seed's stored edges too, so they cannot reappear later.
        world = createLifeWorld(world.columns, world.rows);
        activity = createLifeActivityMonitor();
        reseeded = true;
    }

    function draw() {
        context.clearRect(0, 0, viewportWidth, viewportHeight);
        context.fillStyle = '#9bb8a8';
        context.globalAlpha = fadeElapsed === null ? 1 : Math.abs(1 - fadeElapsed / (fadeDuration / 2));
        const scrollY = Math.max(0, window.scrollY);
        const firstRow = Math.floor(scrollY / cellSize);
        const lastRow = Math.min(world.rows, Math.ceil((scrollY + viewportHeight) / cellSize));
        const squareSize = cellSize * 0.58;
        for (let y = firstRow; y < lastRow; y++) {
            for (let x = 0; x < world.columns; x++) {
                if (world.board[y * world.columns + x]) {
                    context.fillRect(x * cellSize, y * cellSize - scrollY, squareSize, squareSize);
                }
            }
        }
        dirty = false;
    }

    function tick(now) {
        frame = 0;
        if (!isDark() || document.hidden || suspended) return;
        if (canAnimate()) {
            if (fadeElapsed !== null) {
                fadeElapsed = Math.min(fadeDuration, fadeElapsed + now - lastFrame);
                if (fadeElapsed >= fadeDuration / 2 && !reseeded) reseed();
                if (fadeElapsed >= fadeDuration) fadeElapsed = null;
                lastStep = now;
                dirty = true;
            } else if (now - lastStep >= stepInterval) {
                const changed = stepLife(world.board, next, world.columns, world.rows);
                [world.board, next] = [next, world.board];
                if (activity.record(changed, world.board.length, now - lastStep)) {
                    fadeElapsed = 0;
                    reseeded = false;
                }
                lastStep = now;
                dirty = true;
            }
        }
        lastFrame = now;
        if (dirty) draw();
        if (canAnimate()) frame = requestAnimationFrame(tick);
    }

    function requestDraw() {
        dirty = true;
        if (!frame && world && isDark() && !document.hidden && !suspended) {
            frame = requestAnimationFrame(tick);
        }
    }

    function sync() {
        cancelAnimationFrame(frame);
        frame = 0;
        lastStep = lastFrame = performance.now();
        // Reduced motion never leaves a partially faded canvas or runs a transition.
        if (reducedMotion.matches && fadeElapsed !== null) {
            fadeElapsed = null;
        }
        if (isDark() && !suspended) {
            measure();
            requestDraw();
        }
    }

    window.addEventListener('scroll', requestDraw, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    const themeObserver = new MutationObserver(sync);
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme-effective'] });
    const sizeObserver = new ResizeObserver(() => {
        if (isDark() && !suspended) {
            measure();
            requestDraw();
        }
    });
    sizeObserver.observe(page);
    window.addEventListener('pagehide', () => {
        suspended = true;
        cancelAnimationFrame(frame);
        frame = 0;
    });
    window.addEventListener('pageshow', () => {
        suspended = false;
        sync();
    });
    sync();
}
