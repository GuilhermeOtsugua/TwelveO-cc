const page = document.querySelector('.otsugua-page');
const trigger = page?.querySelector('[data-life-enter]');
const exit = page?.querySelector('[data-life-exit]');
const themes = page?.querySelector('[data-theme-toggle]');

if (trigger && exit && themes && page.querySelector('.life-background')) {
    initializeLifeImmersion();
}

function initializeLifeImmersion() {
    const root = document.documentElement;
    const content = [...page.querySelectorAll(':scope > header, :scope > main')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const fades = new Map();
    let active = false;
    let entryScroll = 0;
    let hideTimer;
    let pointerStart;
    let dragged = false;
    let adjustingSpeed = false;
    const speedControl = themes.querySelector('[data-life-speed-control]');
    const speedInput = themes.querySelector('[data-life-speed]');

    function keyboardInThemes() {
        return themes.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
    }

    function hideThemes() {
        if (!active || adjustingSpeed || keyboardInThemes()) return;
        root.removeAttribute('data-life-controls-visible');
        themes.inert = true;
    }

    function revealThemes() {
        if (!active) return;
        clearTimeout(hideTimer);
        themes.inert = false;
        root.setAttribute('data-life-controls-visible', '');
        hideTimer = setTimeout(hideThemes, 5000);
    }

    function setActive(value, restoreFocus = true) {
        if (active === value) return;
        const opacity = content.map(element => getComputedStyle(element).opacity);
        if (value) {
            entryScroll = window.scrollY;
            // Close media as well as the panel; hiding an active microphone is not sufficient.
            document.dispatchEvent(new CustomEvent('otsugua:life-enter'));
        }
        active = value;
        clearTimeout(hideTimer);
        root.classList.toggle('life-immersed', active);
        root.removeAttribute('data-life-controls-visible');
        trigger.setAttribute('aria-pressed', String(active));
        exit.hidden = !active;
        themes.inert = active;
        if (speedControl) speedControl.hidden = !active;
        adjustingSpeed = false;
        content.forEach((element, index) => {
            element.inert = active;
            fades.get(element)?.cancel();
            const fade = element.animate([{ opacity: opacity[index] }, { opacity: active ? 0 : 1 }], {
                duration: reducedMotion.matches ? 0 : 400,
                easing: 'ease',
            });
            fades.set(element, fade);
        });
        pointerStart = null;
        dragged = false;
        if (active) {
            exit.focus({ preventScroll: true });
            revealThemes();
        } else {
            window.scrollTo({ top: entryScroll, behavior: 'instant' });
            if (restoreFocus) trigger.focus({ preventScroll: true });
        }
    }

    trigger.addEventListener('click', () => setActive(true));
    exit.addEventListener('pointerdown', event => {
        pointerStart = { x: event.clientX, y: event.clientY };
        dragged = !event.isPrimary;
    });
    exit.addEventListener('pointermove', event => {
        if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 10) {
            dragged = true;
        }
    });
    exit.addEventListener('pointercancel', () => { dragged = true; });
    exit.addEventListener('click', event => {
        event.preventDefault();
        if (event.detail === 0 || !dragged) setActive(false);
    });
    window.addEventListener('scroll', revealThemes, { passive: true });
    // Also work at the world's top/bottom, where scroll intent may not move the document.
    window.addEventListener('wheel', revealThemes, { passive: true });
    exit.addEventListener('touchmove', revealThemes, { passive: true });
    speedInput?.addEventListener('pointerdown', event => {
        adjustingSpeed = true;
        speedInput.setPointerCapture(event.pointerId);
        revealThemes();
    });
    function finishSpeedAdjustment() {
        if (!adjustingSpeed) return;
        adjustingSpeed = false;
        revealThemes();
    }
    speedInput?.addEventListener('pointerup', finishSpeedAdjustment);
    speedInput?.addEventListener('pointercancel', finishSpeedAdjustment);
    speedInput?.addEventListener('lostpointercapture', finishSpeedAdjustment);
    speedInput?.addEventListener('input', revealThemes);
    themes.addEventListener('click', revealThemes);
    themes.addEventListener('focusin', revealThemes);
    themes.addEventListener('focusout', () => {
        // Becoming inert can itself blur a pointer-focused option; don't reopen it.
        if (root.hasAttribute('data-life-controls-visible')) revealThemes();
    });
    document.addEventListener('keydown', event => {
        if (!active) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setActive(false);
        } else if (event.key === 'Tab' && (themes.inert || !themes.contains(document.activeElement))) {
            event.preventDefault();
            revealThemes();
            themes.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
        }
    });
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) fades.forEach(fade => fade.finish());
    });
    window.addEventListener('pagehide', () => {
        setActive(false, false);
        clearTimeout(hideTimer);
        fades.forEach(fade => fade.cancel());
    });
}
