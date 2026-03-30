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

const contactCopyFeedback = document.querySelector('[data-copy-email-feedback]');
let copyFeedbackTimer = null;

document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
        const email = button.dataset.copyEmail;

        if (!email || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(email);
        } catch {
            return;
        }

        if (!contactCopyFeedback) {
            return;
        }

        contactCopyFeedback.hidden = false;

        if (copyFeedbackTimer) {
            window.clearTimeout(copyFeedbackTimer);
        }

        copyFeedbackTimer = window.setTimeout(() => {
            contactCopyFeedback.hidden = true;
        }, 1800);
    });
});
