export function initializeNorthlineRollingText(root) {
    root.querySelectorAll('[data-northline-rolling-text]').forEach((element) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        const track = element.querySelector('.northline-rolling-text__track');
        const primaryCopy = element.querySelector('.northline-rolling-text__copy:not(.northline-rolling-text__copy--clone)');

        if (!(track instanceof HTMLElement) || !(primaryCopy instanceof HTMLElement)) {
            return;
        }

        element.classList.remove('is-overflowing');
        element.style.removeProperty('--northline-rolling-distance');
        element.style.removeProperty('--northline-overflow-reveal-distance');
        element.style.removeProperty('--northline-rolling-duration');

        if (element.clientWidth <= 0) {
            return;
        }

        const overflowWidth = Math.max(0, Math.ceil(primaryCopy.scrollWidth - element.clientWidth));

        if (overflowWidth <= 1) {
            return;
        }

        const isOverflowReveal = element.classList.contains('northline-rolling-text--overflow-reveal');

        if (isOverflowReveal) {
            element.classList.add('is-overflowing');
            element.style.setProperty('--northline-overflow-reveal-distance', `${overflowWidth}px`);
            element.style.setProperty('--northline-rolling-duration', '11s');
            return;
        }

        const computedTrackStyle = window.getComputedStyle(track);
        const trackGap = Number.parseFloat(computedTrackStyle.columnGap || computedTrackStyle.gap || '20');
        const gap = Number.isFinite(trackGap) ? trackGap : 20;
        const distance = Math.ceil(primaryCopy.getBoundingClientRect().width + gap);
        const duration = Math.max(18, Math.min(34, Math.round((distance / 18) * 10) / 10));

        element.classList.add('is-overflowing');
        element.style.setProperty('--northline-rolling-distance', `${distance}px`);
        element.style.setProperty('--northline-rolling-duration', `${duration}s`);
    });
}
