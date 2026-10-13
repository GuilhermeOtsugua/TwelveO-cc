import { createLifeLoopMonitor, createLifeWorld, resizeLifeWorld, stepLife } from './game-of-life';

import { createLifeClock } from './life-clock';

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
    let originX = 0;
    let originY = 0;
    let immersed = false;
    let transition = null;
    let currentSpeed = 1;
    let entrySpeed = 1;
    let worldPitch = Infinity;
    let cellColor;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let frame = 0;
    let lastStep = 0;
    let lastFrame = 0;
    let dirty = true;
    let suspended = false;
    let loop;
    let fadeElapsed = null;
    let reseeded = false;
    const clock = createLifeClock();
    const speedInput = page.querySelector('[data-life-speed]');
    const speedValue = page.querySelector('[data-life-speed-value]');
    speedInput?.addEventListener('input', () => {
        const speed = speedInput.valueAsNumber;
        if (transition) transition.rampSpeed = false;
        const now = performance.now();
        currentSpeed = speed;
        clock.setSpeed(speed, now);
        if (!canAnimate()) clock.reset(now);
        const label = `${speed.toFixed(2)}×`;
        speedValue.textContent = label;
        speedInput.setAttribute('aria-valuetext', label);
        speedInput.style.setProperty('--life-speed-level', `${(speed - 0.5) / 3.5 * 100}%`);
    });
    page.querySelector('[data-life-speed-reset]')?.addEventListener('click', () => {
        speedInput.value = '1';
        speedInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const fadeDuration = 1000;
    const canAnimate = () => !reducedMotion.matches && !document.hidden && !suspended;

    function measure() {
        cellColor = getComputedStyle(canvas).color;
        viewportWidth = root.clientWidth;
        viewportHeight = window.innerHeight;
        const worldHeight = Math.max(page.scrollHeight, viewportHeight);
        const pitch = targetPitch(worldHeight);
        if (!transition) cellSize = pitch;
        // Keep the expanded simulation on exit. Cropping it changes toroidal edge
        // coordinates and replaces visible cells at the end of the zoom-in.
        // Only viewport/page resizes may change its bounds; retain a size safeguard.
        worldPitch = Math.max(
            Math.min(worldPitch, pitch),
            Math.ceil(Math.sqrt(viewportWidth * worldHeight / 2_000_000)),
        );
        const columns = Math.ceil(viewportWidth / worldPitch);
        const rows = Math.ceil(worldHeight / worldPitch);
        const previousWorld = world;
        world = world ? resizeLifeWorld(world, columns, rows) : createLifeWorld(columns, rows);
        if (world !== previousWorld) {
            next = new Uint8Array(world.board.length);
            loop = createLifeLoopMonitor(world.board);
            fadeElapsed = null;
            reseeded = false;
        }
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(viewportWidth * ratio);
        canvas.height = Math.round(viewportHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        dirty = true;
    }

    function targetPitch(worldHeight) {
        const cellBudget = immersed ? 2_000_000 : 180_000;
        return Math.max(immersed ? 3 : 10, Math.ceil(Math.sqrt(viewportWidth * worldHeight / cellBudget)));
    }

    function updateSpeed(speed, now) {
        currentSpeed = speed;
        clock.setSpeed(speed, now);
        if (!speedInput) return;
        speedInput.value = String(speed);
        const label = `${speed.toFixed(2)}×`;
        if (speedValue) speedValue.textContent = label;
        speedInput.setAttribute('aria-valuetext', label);
        speedInput.style.setProperty('--life-speed-level', `${(speed - 0.5) / 3.5 * 100}%`);
    }

    document.addEventListener('otsugua:life-mode', ({ detail }) => {
        immersed = detail.active;
        if (immersed) entrySpeed = currentSpeed;
        const fromSize = cellSize;
        const fromSpeed = currentSpeed;
        // Expand the world once, not on every animation frame.
        if (immersed) {
            transition = { fromSize };
            measure();
        }
        const worldHeight = Math.max(page.scrollHeight, viewportHeight);
        const toSize = targetPitch(worldHeight);
        transition = {
            fromSize, toSize, fromSpeed, toSpeed: immersed ? 4 : entrySpeed,
            fromOriginX: originX, fromOriginY: originY,
            anchorX: viewportWidth / 2,
            anchorY: Math.max(0, window.scrollY) + viewportHeight / 2,
            elapsed: 0, rampSpeed: true,
        };
        lastFrame = performance.now();
        if (reducedMotion.matches) {
            applyZoom(toSize);
            updateSpeed(transition.toSpeed, lastFrame);
            transition = null;
            measure();
        }
        requestDraw();
    });

    function applyZoom(size) {
        const scale = size / transition.fromSize;
        originX = transition.anchorX - (transition.anchorX - transition.fromOriginX) * scale;
        originY = transition.anchorY - (transition.anchorY - transition.fromOriginY) * scale;
        cellSize = size;
    }

    function reseed() {
        // Discard the previous seed's stored edges too, so they cannot reappear later.
        world = createLifeWorld(world.columns, world.rows);
        loop = createLifeLoopMonitor(world.board);
        reseeded = true;
    }

    function draw() {
        context.clearRect(0, 0, viewportWidth, viewportHeight);
        context.fillStyle = cellColor;
        context.globalAlpha = fadeElapsed === null ? 1 : Math.abs(1 - fadeElapsed / (fadeDuration / 2));
        const scrollY = Math.max(0, window.scrollY);
        const firstRow = Math.floor((scrollY - originY) / cellSize);
        const lastRow = Math.ceil((scrollY + viewportHeight - originY) / cellSize);
        const firstColumn = Math.floor(-originX / cellSize);
        const lastColumn = Math.ceil((viewportWidth - originX) / cellSize);
        const squareSize = cellSize * 0.58;
        for (let y = firstRow; y < lastRow; y++) {
            // The simulation is toroidal; wrap newly exposed edges rather than leaving gaps.
            const row = ((y % world.rows) + world.rows) % world.rows;
            for (let x = firstColumn; x < lastColumn; x++) {
                const column = ((x % world.columns) + world.columns) % world.columns;
                if (world.board[row * world.columns + column]) {
                    context.fillRect(originX + x * cellSize, originY + y * cellSize - scrollY, squareSize, squareSize);
                }
            }
        }
        dirty = false;
    }

    function tick(now) {
        frame = 0;
        if (document.hidden || suspended) return;
        if (canAnimate()) {
            if (transition) {
                transition.elapsed = Math.min(4000, transition.elapsed + Math.max(0, now - lastFrame));
                const progress = transition.elapsed / 4000;
                const eased = progress * progress * (3 - 2 * progress);
                applyZoom(transition.fromSize + (transition.toSize - transition.fromSize) * eased);
                if (transition.rampSpeed) updateSpeed(transition.fromSpeed + (transition.toSpeed - transition.fromSpeed) * eased, now);
                dirty = true;
                if (progress === 1) {
                    transition = null;
                    if (!immersed) measure();
                }
            }
            if (fadeElapsed !== null) {
                fadeElapsed = Math.min(fadeDuration, fadeElapsed + now - lastFrame);
                if (fadeElapsed >= fadeDuration / 2 && !reseeded) reseed();
                if (fadeElapsed >= fadeDuration) fadeElapsed = null;
                lastStep = now;
                clock.reset(now);
                dirty = true;
            } else if (clock.advance(now)) {
                stepLife(world.board, next, world.columns, world.rows);
                [world.board, next] = [next, world.board];
                if (loop.record(world.board, now - lastStep)) {
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
        if (!frame && world && !document.hidden && !suspended) {
            frame = requestAnimationFrame(tick);
        }
    }

    function sync() {
        cancelAnimationFrame(frame);
        frame = 0;
        lastStep = lastFrame = performance.now();
        clock.reset(lastFrame);
        // Reduced motion never leaves a partially faded canvas or runs a transition.
        if (reducedMotion.matches) {
            fadeElapsed = null;
            if (transition) {
                applyZoom(transition.toSize);
                if (transition.rampSpeed) updateSpeed(transition.toSpeed, lastFrame);
                transition = null;
            }
        }
        if (!suspended) {
            measure();
            requestDraw();
        }
    }

    window.addEventListener('scroll', requestDraw, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    // A palette change must not restart the generation clock or clear/resize the canvas.
    const themeObserver = new MutationObserver(() => {
        cellColor = getComputedStyle(canvas).color;
        requestDraw();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme-effective'] });
    const sizeObserver = new ResizeObserver(() => {
        if (!suspended) {
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
