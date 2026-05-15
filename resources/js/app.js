import './bootstrap';
import './northline-learning-ops';
import './harbor-ledger';
import { initializeLocalization, translateValue } from './localization';

const themePreferenceStorageKey = 'otsugua.theme.preference';
const themePreferences = ['system', 'dark', 'light'];
const themeRoot = document.documentElement;

const hideDelays = new WeakMap();
const fadeDelays = new WeakMap();

const homeHeader = document.querySelector('[data-home-header]');
const mobileHeaderMediaQuery = window.matchMedia?.('(max-width: 639px)');

initializeLocalization();

function initializeMobileHeaderScroll() {
    if (!homeHeader || !mobileHeaderMediaQuery) {
        return;
    }

    const minimumScrollDelta = 4;
    const transitionLockBuffer = 80;
    const fallbackTransitionLockDuration = 320;
    let lastScrollY = Math.max(window.scrollY, 0);
    let ticking = false;
    let hasSyncedInitialPosition = false;
    let hasUserScrollIntent = false;
    let isHeaderHidden = homeHeader.classList.contains('is-mobile-nav-hidden');
    let accumulatedDistance = 0;
    let lastScrollDirection = 0;
    let transitionLockTimeoutId = null;
    let isTransitionLocked = false;

    const resetScrollTracking = (scrollY = Math.max(window.scrollY, 0)) => {
        lastScrollY = scrollY;
        accumulatedDistance = 0;
        lastScrollDirection = 0;
    };

    const releaseTransitionLock = () => {
        if (transitionLockTimeoutId !== null) {
            window.clearTimeout(transitionLockTimeoutId);
            transitionLockTimeoutId = null;
        }

        isTransitionLocked = false;
    };

    const parseTransitionTime = (value) => {
        const normalizedValue = value.trim();

        if (!normalizedValue) {
            return 0;
        }

        if (normalizedValue.endsWith('ms')) {
            const milliseconds = Number.parseFloat(normalizedValue);

            return Number.isFinite(milliseconds) ? milliseconds : 0;
        }

        if (normalizedValue.endsWith('s')) {
            const seconds = Number.parseFloat(normalizedValue);

            return Number.isFinite(seconds) ? seconds * 1000 : 0;
        }

        return 0;
    };

    const getTransitionLockDuration = () => {
        const computedStyle = window.getComputedStyle(homeHeader);
        const transitionProperties = computedStyle.transitionProperty.split(',');
        const transitionDurations = computedStyle.transitionDuration.split(',');
        const transitionDelays = computedStyle.transitionDelay.split(',');

        const maxTransitionDuration = transitionProperties.reduce((longestDuration, propertyName, index) => {
            const normalizedPropertyName = propertyName.trim();
            const duration = parseTransitionTime(
                transitionDurations[index % transitionDurations.length] ?? '0s',
            );
            const delay = parseTransitionTime(transitionDelays[index % transitionDelays.length] ?? '0s');
            const totalDuration = duration + delay;

            if (
                normalizedPropertyName === 'all'
                || normalizedPropertyName === 'transform'
            ) {
                return Math.max(longestDuration, totalDuration);
            }

            return longestDuration;
        }, 0);

        return Math.max(
            Math.round(maxTransitionDuration + transitionLockBuffer),
            fallbackTransitionLockDuration,
        );
    };

    const armTransitionLock = () => {
        if (transitionLockTimeoutId !== null) {
            window.clearTimeout(transitionLockTimeoutId);
        }

        isTransitionLocked = true;
        transitionLockTimeoutId = window.setTimeout(releaseTransitionLock, getTransitionLockDuration());
    };

    const getHeaderHeight = () => {
        return Math.max(1, Math.round(homeHeader.getBoundingClientRect().height));
    };

    const getViewportHeight = () => {
        return Math.max(
            Math.round(window.visualViewport?.height ?? 0),
            Math.round(window.innerHeight),
            Math.round(document.documentElement.clientHeight),
        );
    };

    const getScrollThresholds = () => {
        const headerHeight = getHeaderHeight();
        const viewportHeight = getViewportHeight();

        return {
            hideDistance: Math.max(
                Math.round(headerHeight * 1.25),
                Math.round(viewportHeight * 0.075),
            ),
            showDistance: Math.max(
                Math.round(headerHeight * 0.65),
                Math.round(viewportHeight * 0.035),
            ),
            visibleTopOffset: Math.max(28, headerHeight),
        };
    };

    const showHeader = () => {
        if (!isHeaderHidden) {
            return;
        }

        homeHeader.classList.remove('is-mobile-nav-hidden');
        isHeaderHidden = false;
        armTransitionLock();
    };

    const hideHeader = () => {
        if (isHeaderHidden) {
            return;
        }

        homeHeader.classList.add('is-mobile-nav-hidden');
        isHeaderHidden = true;
        armTransitionLock();
    };

    const syncHeaderVisibility = () => {
        ticking = false;

        if (!mobileHeaderMediaQuery.matches) {
            showHeader();
            resetScrollTracking();

            return;
        }

        const currentScrollY = Math.max(window.scrollY, 0);
        const scrollDelta = currentScrollY - lastScrollY;
        const scrollThresholds = getScrollThresholds();

        if (!hasSyncedInitialPosition || !hasUserScrollIntent) {
            showHeader();
            resetScrollTracking(currentScrollY);
            hasSyncedInitialPosition = true;

            return;
        }

        if (currentScrollY <= scrollThresholds.visibleTopOffset) {
            showHeader();
            resetScrollTracking(currentScrollY);

            return;
        }

        lastScrollY = currentScrollY;

        if (Math.abs(scrollDelta) < minimumScrollDelta) {
            return;
        }

        const scrollDirection = scrollDelta > 0 ? 1 : -1;

        if (scrollDirection !== lastScrollDirection) {
            accumulatedDistance = 0;
            lastScrollDirection = scrollDirection;
        }

        accumulatedDistance += Math.abs(scrollDelta);

        if (isTransitionLocked) {
            return;
        }

        if (scrollDirection > 0) {
            if (isHeaderHidden) {
                accumulatedDistance = 0;

                return;
            }

            if (accumulatedDistance >= scrollThresholds.hideDistance) {
                hideHeader();
                accumulatedDistance = 0;
            }
        } else {
            if (!isHeaderHidden) {
                accumulatedDistance = 0;

                return;
            }

            if (accumulatedDistance >= scrollThresholds.showDistance) {
                showHeader();
                accumulatedDistance = 0;
            }
        }
    };

    const requestHeaderVisibilitySync = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(syncHeaderVisibility);
    };

    const recordUserScrollIntent = () => {
        hasUserScrollIntent = true;
    };

    window.addEventListener('wheel', recordUserScrollIntent, { passive: true });
    window.addEventListener('touchmove', recordUserScrollIntent, { passive: true });
    window.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
            recordUserScrollIntent();
        }
    });
    window.addEventListener('scroll', requestHeaderVisibilitySync, { passive: true });
    window.addEventListener('resize', requestHeaderVisibilitySync);

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', requestHeaderVisibilitySync);
    }

    homeHeader.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'transform') {
            releaseTransitionLock();
        }
    });

    if (typeof mobileHeaderMediaQuery.addEventListener === 'function') {
        mobileHeaderMediaQuery.addEventListener('change', syncHeaderVisibility);
    } else if (typeof mobileHeaderMediaQuery.addListener === 'function') {
        mobileHeaderMediaQuery.addListener(syncHeaderVisibility);
    }

    syncHeaderVisibility();
}

function initializeStudioCurrentTopbarScroll() {
    document.querySelectorAll('[data-studio-current-slice]').forEach((slice) => {
        if (!(slice instanceof HTMLElement)) {
            return;
        }

        const viewport = slice.querySelector('[data-studio-current-viewport]');
        const topbar = slice.querySelector('[data-studio-current-topbar]');
        const resetControl = slice.querySelector('[data-studio-current-reset]');
        const navControls = slice.querySelectorAll('[data-studio-current-scroll-target]');

        if (!(viewport instanceof HTMLElement) || !(topbar instanceof HTMLElement)) {
            return;
        }

        const scrolledClass = 'studio-current-topbar--scrolled';
        let ticking = false;

        const syncTopbarState = () => {
            ticking = false;
            topbar.classList.toggle(scrolledClass, viewport.scrollTop > 24);
        };

        const requestSync = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(syncTopbarState);
        };

        viewport.addEventListener('scroll', requestSync, { passive: true });
        window.addEventListener('resize', requestSync);
        resetControl?.addEventListener('click', () => {
            viewport.scrollTo({ top: 0, behavior: 'auto' });
            requestSync();
        });
        navControls.forEach((control) => {
            control.addEventListener('click', () => {
                if (!(control instanceof HTMLElement)) {
                    return;
                }

                const target = slice.querySelector(`[data-studio-current-section="${control.dataset.studioCurrentScrollTarget}"]`);

                if (!(target instanceof HTMLElement)) {
                    return;
                }

                const focalElement = target.matches('.studio-current-feature')
                    ? target.querySelector('.studio-current-feature__copy')
                    : target.querySelector('.studio-current-feature__copy');
                const scrollTarget = focalElement ?? target;
                const viewportRect = viewport.getBoundingClientRect();
                const targetRect = scrollTarget.getBoundingClientRect();
                const viewportScale = viewportRect.height / viewport.clientHeight;
                const targetOffset = viewport.scrollTop + (((targetRect.top - viewportRect.top) - ((viewportRect.height - targetRect.height) / 2)) / viewportScale);
                const maxScroll = viewport.scrollHeight - viewport.clientHeight;
                const nextScroll = Math.max(0, Math.min(targetOffset, maxScroll));

                viewport.scrollTo({ top: nextScroll, behavior: 'smooth' });
                requestSync();
            });
        });
        syncTopbarState();
    });
}

function isThemePreference(value) {
    return themePreferences.includes(value);
}

function readStoredThemePreference() {
    try {
        const storedPreference = window.localStorage.getItem(themePreferenceStorageKey);

        return isThemePreference(storedPreference) ? storedPreference : 'system';
    } catch {
        return 'system';
    }
}

function getSystemThemePreference() {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}

function resolveThemePreference(preference) {
    if (preference === 'dark' || preference === 'light') {
        return preference;
    }

    return getSystemThemePreference();
}

function writeStoredThemePreference(preference) {
    try {
        window.localStorage.setItem(themePreferenceStorageKey, preference);
    } catch {
        // Ignore storage failures and keep the in-memory state in sync.
    }
}

function syncThemeToggleState(preference) {
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
        toggle.querySelectorAll('[data-theme-option]').forEach((option) => {
            const isActive = option.getAttribute('data-theme-option') === preference;

            option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    });
}

function applyThemePreference(preference, shouldPersist = false) {
    const normalizedPreference = isThemePreference(preference) ? preference : 'system';
    const effectiveTheme = resolveThemePreference(normalizedPreference);

    themeRoot.setAttribute('data-theme-root', '');
    themeRoot.setAttribute('data-theme-preference', normalizedPreference);
    themeRoot.setAttribute('data-theme-effective', effectiveTheme);

    if (shouldPersist) {
        writeStoredThemePreference(normalizedPreference);
    }

    syncThemeToggleState(normalizedPreference);
}

applyThemePreference(readStoredThemePreference());
initializeMobileHeaderScroll();
initializeStudioCurrentTopbarScroll();

window.addEventListener('storage', (event) => {
    if (event.key !== themePreferenceStorageKey) {
        return;
    }

    applyThemePreference(isThemePreference(event.newValue) ? event.newValue : 'system');
});

const systemThemeMediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

if (systemThemeMediaQuery instanceof MediaQueryList) {
    const refreshSystemTheme = () => {
        if (themeRoot.getAttribute('data-theme-preference') === 'system') {
            applyThemePreference('system');
        }
    };

    if (typeof systemThemeMediaQuery.addEventListener === 'function') {
        systemThemeMediaQuery.addEventListener('change', refreshSystemTheme);
    } else if (typeof systemThemeMediaQuery.addListener === 'function') {
        systemThemeMediaQuery.addListener(refreshSystemTheme);
    }
}

document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    toggle.querySelectorAll('[data-theme-option]').forEach((option) => {
        option.addEventListener('click', () => {
            const preference = option.getAttribute('data-theme-option') ?? 'system';

            applyThemePreference(preference, true);
        });
    });
});

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

document.querySelectorAll('[data-project-band]').forEach((band) => {
    const toggle = band.querySelector('[data-project-note-toggle]');
    const panel = band.querySelector('[data-project-note-panel]');
    const noteAnchor = toggle?.closest('.project-note-anchor') ?? toggle ?? band;

    if (!toggle || !panel) {
        return;
    }

    const label = toggle.querySelector('span');

    const setOpenState = (isOpen) => {
        const closedLabel = toggle.dataset.projectNoteLabelClosed ?? 'Why it is shaped this way';
        const openLabel = toggle.dataset.projectNoteLabelOpen ?? 'Hide note';

        panel.classList.toggle('hidden', !isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        if (label) {
            label.textContent = isOpen ? openLabel : closedLabel;
        }
    };

    setOpenState(false);

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        setOpenState(!isOpen);
    });

    document.addEventListener('otsugua:localechange', () => {
        setOpenState(toggle.getAttribute('aria-expanded') === 'true');
    });

    document.addEventListener('click', (event) => {
        if (toggle.getAttribute('aria-expanded') !== 'true') {
            return;
        }

        if (!(event.target instanceof Node)) {
            return;
        }

        if (noteAnchor.contains(event.target)) {
            return;
        }

        setOpenState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') {
            return;
        }

        setOpenState(false);
        toggle.focus();
    });
});

const desktopSliceBreakpoint = 1024;

function sizeProjectInterfaceSlices() {
    document.querySelectorAll('[data-project-interface-slice]').forEach((stage) => {
        if (!(stage instanceof HTMLElement)) {
            return;
        }

        if (window.innerWidth < desktopSliceBreakpoint) {
            stage.style.removeProperty('height');

            return;
        }

        const width = stage.getBoundingClientRect().width;
        const height = width * (9 / 16);

        stage.style.height = `${Math.round(height)}px`;
    });
}

sizeProjectInterfaceSlices();
window.addEventListener('resize', sizeProjectInterfaceSlices, { passive: true });

const contactCopyFeedback = document.querySelector('[data-copy-email-feedback]');
const contactSourceStorageKey = 'otsugua.contact-source';
const contactSourceStorageDuration = 24 * 60 * 60 * 1000;
const contactSourceParamNames = ['ref', 'source', 'utm_source'];
const contactCopyFeedbackMessages = {
    success: 'Email copied to clipboard!',
    disabled: 'Temporarily disabled.',
};
let copyFeedbackTimer = null;
let copyFeedbackHideTimer = null;
let contactSourceState = null;

const getCurrentLocale = () => document.documentElement.lang === 'pt-BR' ? 'pt-BR' : 'en';

const getContactCopyFeedbackMessage = (state) => {
    const message = contactCopyFeedbackMessages[state] ?? contactCopyFeedbackMessages.success;

    return translateValue(message, getCurrentLocale());
};

const isUpworkHost = (hostname) => {
    const normalizedHostname = hostname.toLowerCase();

    return normalizedHostname === 'upwork.com' || normalizedHostname.endsWith('.upwork.com');
};

const readStoredContactSource = () => {
    try {
        const storedSource = window.localStorage.getItem(contactSourceStorageKey);

        if (!storedSource) {
            return null;
        }

        const parsedSource = JSON.parse(storedSource);

        if (parsedSource?.source !== 'upwork' || typeof parsedSource.expiresAt !== 'number') {
            window.localStorage.removeItem(contactSourceStorageKey);

            return null;
        }

        if (parsedSource.expiresAt <= Date.now()) {
            window.localStorage.removeItem(contactSourceStorageKey);

            return null;
        }

        return {
            source: parsedSource.source,
            expiresAt: parsedSource.expiresAt,
        };
    } catch {
        try {
            window.localStorage.removeItem(contactSourceStorageKey);
        } catch {
            // Storage may be fully unavailable; ignore and let this page continue normally.
        }

        return null;
    }
};

const writeStoredContactSource = () => {
    const nextSourceState = {
        source: 'upwork',
        expiresAt: Date.now() + contactSourceStorageDuration,
    };

    contactSourceState = nextSourceState;

    try {
        window.localStorage.setItem(contactSourceStorageKey, JSON.stringify(nextSourceState));
    } catch {
        // Ignore private browsing or storage-denied contexts; this page view still uses the detected source.
    }
};

const clearStoredContactSource = () => {
    contactSourceState = null;

    try {
        window.localStorage.removeItem(contactSourceStorageKey);
    } catch {
        // Storage may be unavailable in strict browsing contexts.
    }
};

const getContactSourceFromUrl = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('ref')?.trim().toLowerCase() === 'direct') {
        return 'direct';
    }

    for (const paramName of contactSourceParamNames) {
        const paramValue = params.get(paramName)?.trim().toLowerCase();

        if (paramValue === 'upwork') {
            return paramValue;
        }
    }

    return null;
};

const hasUpworkReferrer = () => {
    if (!document.referrer) {
        return false;
    }

    try {
        return isUpworkHost(new URL(document.referrer).hostname);
    } catch {
        return false;
    }
};

const resolveContactSource = () => {
    const urlSource = getContactSourceFromUrl();

    if (urlSource === 'direct') {
        clearStoredContactSource();

        return null;
    }

    if (urlSource === 'upwork' || hasUpworkReferrer()) {
        writeStoredContactSource();

        return contactSourceState;
    }

    return readStoredContactSource();
};

contactSourceState = resolveContactSource();

const isEmailCopyDisabled = () => {
    if (contactSourceState?.source === 'upwork') {
        if (contactSourceState.expiresAt > Date.now()) {
            return true;
        }

        contactSourceState = readStoredContactSource();

        return contactSourceState?.source === 'upwork';
    }

    return false;
};

const copyTextWithSelectionFallback = (text) => {
    const textarea = document.createElement('textarea');
    const selection = document.getSelection();
    const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.inset = '0 auto auto 0';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    let didCopy = false;

    try {
        didCopy = document.execCommand('copy');
    } catch {
        didCopy = false;
    }

    textarea.remove();

    if (selection) {
        selection.removeAllRanges();

        if (selectedRange) {
            selection.addRange(selectedRange);
        }
    }

    return didCopy;
};

const copyEmailToClipboard = async (email) => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(email);

            return true;
        } catch {
            // Fall through to the selection-based copy path for local HTTP contexts.
        }
    }

    return copyTextWithSelectionFallback(email);
};

const hideContactCopyFeedback = () => {
    if (!contactCopyFeedback) {
        return;
    }

    contactCopyFeedback.classList.remove('is-visible');

    if (copyFeedbackHideTimer) {
        window.clearTimeout(copyFeedbackHideTimer);
    }

    copyFeedbackHideTimer = window.setTimeout(() => {
        contactCopyFeedback.hidden = true;
    }, 180);
};

const showContactCopyFeedback = (message = getContactCopyFeedbackMessage('success'), state = 'success') => {
    if (!contactCopyFeedback) {
        return;
    }

    if (copyFeedbackTimer) {
        window.clearTimeout(copyFeedbackTimer);
    }

    if (copyFeedbackHideTimer) {
        window.clearTimeout(copyFeedbackHideTimer);
    }

    contactCopyFeedback.textContent = message;
    contactCopyFeedback.dataset.copyEmailFeedbackState = state;
    contactCopyFeedback.hidden = false;
    contactCopyFeedback.classList.remove('is-visible');

    window.requestAnimationFrame(() => {
        contactCopyFeedback.classList.add('is-visible');
    });

    copyFeedbackTimer = window.setTimeout(hideContactCopyFeedback, 1800);
};

document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
        const email = button.dataset.copyEmail;

        if (!email) {
            return;
        }

        if (isEmailCopyDisabled()) {
            showContactCopyFeedback(getContactCopyFeedbackMessage('disabled'), 'error');

            return;
        }

        const didCopy = await copyEmailToClipboard(email);

        if (!didCopy) {
            return;
        }

        showContactCopyFeedback();
    });
});
