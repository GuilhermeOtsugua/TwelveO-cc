import './bootstrap';

const hideDelays = new WeakMap();
const fadeDelays = new WeakMap();

function closeNote(details) {
    const timer = hideDelays.get(details);
    const fadeTimer = fadeDelays.get(details);

    if (timer) {
        window.clearTimeout(timer);
        hideDelays.delete(details);
    }

    if (fadeTimer) {
        window.clearTimeout(fadeTimer);
        fadeDelays.delete(details);
    }

    details.classList.remove('is-fading');
    details.open = false;
}

function armAutoClose(details) {
    const existingTimer = hideDelays.get(details);
    const existingFadeTimer = fadeDelays.get(details);

    if (existingTimer) {
        window.clearTimeout(existingTimer);
        hideDelays.delete(details);
    }

    if (existingFadeTimer) {
        window.clearTimeout(existingFadeTimer);
        fadeDelays.delete(details);
    }

    details.classList.remove('is-fading');

    const fadeTimer = window.setTimeout(() => {
        details.classList.add('is-fading');
    }, 5000);

    const timer = window.setTimeout(() => {
        closeNote(details);
    }, 6200);

    fadeDelays.set(details, fadeTimer);
    hideDelays.set(details, timer);
}

document.querySelectorAll('details.project-card').forEach((details) => {
    details.addEventListener('toggle', () => {
        const timer = hideDelays.get(details);

        if (!details.open) {
            if (timer) {
                window.clearTimeout(timer);
                hideDelays.delete(details);
            }

            return;
        }

        armAutoClose(details);
    });
});
