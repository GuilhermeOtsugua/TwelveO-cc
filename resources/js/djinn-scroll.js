// Own both live bottom-following and user-initiated message settling. Provider
// playback, DOM growth and resize events must never masquerade as user scrolling.
export function createChatScroller(log) {
    let following = true;
    let manual = false;
    let pointerDown = false;
    let direction = 0;
    let lastTop = 0;
    let timer = null;
    let animation = null;
    const stopAnimation = () => { if (animation !== null) cancelAnimationFrame(animation); animation = null; };
    const maximum = () => Math.max(0, log.scrollHeight - log.clientHeight);
    const atBottom = () => maximum() - log.scrollTop <= 2;
    const clearTimer = () => { clearTimeout(timer); timer = null; };
    const hasSelection = () => {
        const selection = window.getSelection();
        return selection && !selection.isCollapsed && (log.contains(selection.anchorNode) || log.contains(selection.focusNode));
    };

    function settle() {
        clearTimer();
        if (!manual || pointerDown || !log.clientHeight) return;
        manual = false;
        following = atBottom();
        if (following || !direction || hasSelection()) return;
        const bounds = log.getBoundingClientRect();
        const style = getComputedStyle(log);
        const top = bounds.top + log.clientTop + parseFloat(style.paddingTop);
        const bottom = bounds.top + log.clientTop + log.clientHeight - parseFloat(style.paddingBottom);
        const height = bottom - top;
        const proximity = Math.min(40, height * 0.15);
        let target = null;
        let distance = proximity;
        for (const row of log.querySelectorAll('[data-djinn-message="visitor"], [data-djinn-message="assistant"]')) {
            const rect = row.getBoundingClientRect();
            if (!rect.height || rect.height > height || row.classList.contains('djinn-message--active')) continue;
            // Only finish revealing a message clipped at the leading edge.
            if (rect.bottom <= top || rect.top >= bottom) continue;
            const offset = direction < 0 ? rect.top - top : rect.bottom - bottom;
            if (offset * direction <= 0) continue;
            const candidate = Math.max(0, Math.min(maximum(), log.scrollTop + offset));
            const delta = Math.abs(candidate - log.scrollTop);
            if (delta < distance) { target = candidate; distance = delta; }
        }
        if (target === null || distance < 1) return;
        following = maximum() - target <= 2;
        stopAnimation();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            log.scrollTo({ top: target, behavior: 'instant' });
            return;
        }
        const from = log.scrollTop;
        const started = performance.now();
        const step = (now) => {
            const progress = Math.min(1, (now - started) / 280);
            const eased = progress * progress * (3 - 2 * progress);
            log.scrollTop = from + (target - from) * eased;
            animation = progress < 1 ? requestAnimationFrame(step) : null;
        };
        animation = requestAnimationFrame(step);
    }
    function schedule() {
        clearTimer();
        if (!pointerDown) timer = setTimeout(settle, 200);
    }
    function begin() {
        clearTimer();
        stopAnimation();
        // A new gesture takes precedence over an in-flight smooth adjustment.
        if (!manual) {
            log.scrollTo({ top: log.scrollTop, behavior: 'instant' });
            // Keep the last scroll-event position: a passive wheel event can
            // arrive after the compositor has already moved scrollTop.
            direction = 0;
        }
        manual = true;
        following = false;
        schedule();
    }
    log.addEventListener('wheel', (event) => { if (event.deltaY) begin(); }, { passive: true });
    log.addEventListener('pointerdown', (event) => { if (event.pointerType !== 'touch') { pointerDown = true; begin(); } }, { passive: true });
    log.addEventListener('touchstart', () => { pointerDown = true; begin(); }, { passive: true });
    const release = () => { if (pointerDown) { pointerDown = false; schedule(); } };
    const releasePointer = (event) => { if (event.pointerType !== 'touch') release(); };
    window.addEventListener('pointerup', releasePointer, { passive: true });
    window.addEventListener('pointercancel', releasePointer, { passive: true });
    window.addEventListener('touchend', (event) => { if (!event.touches.length) release(); }, { passive: true });
    window.addEventListener('touchcancel', release, { passive: true });
    log.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) begin();
    });
    log.addEventListener('scroll', () => {
        const top = Math.max(0, Math.min(maximum(), log.scrollTop));
        if (manual && Math.abs(top - lastTop) > 0.5) {
            direction = Math.sign(top - lastTop);
            schedule();
        }
        lastTop = top;
    }, { passive: true });
    log.addEventListener('scrollend', settle);

    return {
        update(change) {
            change();
            if (following && !manual && !pointerDown && !hasSelection()) {
                log.scrollTo({ top: log.scrollHeight, behavior: 'instant' });
                lastTop = log.scrollTop;
            }
        },
        cancel() {
            clearTimer();
            stopAnimation();
            log.scrollTo({ top: log.scrollTop, behavior: 'instant' });
            manual = false;
            pointerDown = false;
            direction = 0;
        },
    };
}
