import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Real browser media APIs with a synthetic device: never opens the operator's
// microphone. Provider traffic is intercepted before any paid session opens.
test.use({ launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] } });

const providerUrl = /^(?:https:\/\/djinn-voice\.test|http:\/\/127\.0\.0\.1:8080)\//;

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('otsugua.locale.preference', 'en'));
});

test('HTTPS exposes native microphone capture and forwards PCM over the voice protocol', async ({ page }) => {
    let captureVerified = false;
    let binaryFrames = 0;
    let voiceStarted = false;
    await page.route(providerUrl, async (route) => {
        if (route.request().url().endsWith('/health')) {
            // The capture indicator is set by the wrapper only after the native
            // browser getUserMedia call has actually resolved with a live track.
            captureVerified = await page.evaluate(() => (window as any).__nativeCaptureVerified === true);
            await route.fulfill({ json: { demo: true, challengeRequired: false } });
        } else {
            await route.fulfill({ json: { ticket: 'test-only' } });
        }
    });
    await page.routeWebSocket(/\/browser\/voice\?ticket=/, (ws) => {
        ws.send(JSON.stringify({ type: 'ready', protocol: 2 }));
        ws.onMessage((data) => {
            if (typeof data !== 'string') { binaryFrames++; return; }
            const message = JSON.parse(data);
            if (message.type === 'mode' && message.mode === 'voice') {
                voiceStarted = true;
                ws.send(JSON.stringify({ type: 'listening_ready' }));
            }
        });
    });
    await page.addInitScript(() => {
        const original = navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices);
        if (!original) return;
        navigator.mediaDevices.getUserMedia = async (constraints) => {
            const stream = await original(constraints);
            (window as any).__nativeTracks = stream.getTracks();
            (window as any).__nativeCaptureVerified = stream.getAudioTracks().some((track) => track.readyState === 'live');
            return stream;
        };
    });
    await page.goto('/');
    expect(await page.evaluate(() => ({ secure: isSecureContext, capture: typeof navigator.mediaDevices?.getUserMedia })))
        .toEqual({ secure: true, capture: 'function' });
    await page.locator('[data-djinn-open]').click();
    await expect(page.locator('[data-djinn-open]')).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => binaryFrames).toBeGreaterThan(0);
    expect(captureVerified).toBe(true);
    expect(voiceStarted).toBe(true);
    await expect(page.locator('[data-djinn-status]')).toHaveClass(/djinn-activity/);
    await expect(page.locator('[data-djinn-form]')).toBeVisible();
    await expect(page.locator('[data-djinn-compose-microphone]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-djinn-input]').focus();
    await expect.poll(async () => page.evaluate(() => (window as any).__nativeTracks.every((track: MediaStreamTrack) => track.readyState === 'ended'))).toBe(true);
    await expect(page.locator('[data-djinn-form]')).toBeVisible();
    await page.locator('[data-djinn-compose-microphone]').click();
    await expect(page.locator('[data-djinn-compose-microphone]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-home-header] .nav-brand').dispatchEvent('pointerdown');
    await expect(page.locator('[data-djinn-response]')).toBeHidden();
    await expect.poll(async () => page.evaluate(() => (window as any).__nativeTracks.every((track: MediaStreamTrack) => track.readyState === 'ended'))).toBe(true);
});

for (const [error, expected] of [
    ['NotAllowedError', 'Microphone permission is blocked.'],
    ['NotFoundError', 'No microphone was found.'],
    ['NotReadableError', 'The microphone could not be opened.'],
]) {
    test(`${error} explains the capture failure without contacting providers`, async ({ page }) => {
        let providerCalls = 0;
        await page.route(providerUrl, async (route) => { providerCalls++; await route.abort(); });
        await page.addInitScript((name) => {
            navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('Synthetic device failure', name); };
        }, error);
        await page.goto('/');
        await page.locator('[data-djinn-open]').click();
        await expect(page.locator('[data-djinn-status]')).toContainText(expected);
        await expect(page.locator('[data-djinn-form]')).toBeVisible();
        expect(providerCalls).toBe(0);
    });
}

test('an actual insecure HTTP origin explains HTTPS without contacting providers', async ({ page }) => {
    let providerCalls = 0;
    await page.route(/https:\/\/voice\.otsugua\.dev\//, async (route) => { providerCalls++; await route.abort(); });
    // Serve the built static export under an untrusted HTTP .test origin,
    // without overriding isSecureContext or navigator.mediaDevices.
    await page.route('http://insecure-djinn.test/**', async (route) => {
        const pathname = new URL(route.request().url()).pathname;
        const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
        if (relative.includes('..')) { await route.abort(); return; }
        try {
            const body = await readFile(path.join('dist', relative));
            const contentType = relative.endsWith('.html') ? 'text/html' : relative.endsWith('.js') ? 'text/javascript'
                : relative.endsWith('.css') ? 'text/css' : 'application/octet-stream';
            await route.fulfill({ body, contentType });
        } catch { await route.abort(); }
    });
    await page.goto('http://insecure-djinn.test');
    expect(await page.evaluate(() => isSecureContext)).toBe(false);
    expect(await page.evaluate(() => typeof navigator.mediaDevices)).toBe('undefined');
    await page.locator('[data-djinn-open]').click();
    await expect(page.locator('[data-djinn-status]')).toContainText('Microphone access requires HTTPS.');
    await expect(page.locator('[data-djinn-form]')).toBeVisible();
    expect(providerCalls).toBe(0);
});

test('switching to keyboard during permission acquisition releases late microphone tracks', async ({ page }) => {
    let providerCalls = 0;
    await page.route(providerUrl, async (route) => { providerCalls++; await route.abort(); });
    await page.addInitScript(() => {
        const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = async (constraints) => {
            const stream = await original(constraints);
            (window as any).__nativeTracks = stream.getTracks();
            return new Promise((resolve) => { (window as any).__finishCapture = () => resolve(stream); });
        };
    });
    await page.goto('/');
    await page.locator('[data-djinn-open]').click();
    await expect.poll(async () => page.evaluate(() => typeof (window as any).__finishCapture)).toBe('function');
    await page.locator('[data-djinn-keyboard]').click();
    await page.evaluate(() => (window as any).__finishCapture());
    await expect.poll(async () => page.evaluate(() => (window as any).__nativeTracks.every((track: MediaStreamTrack) => track.readyState === 'ended'))).toBe(true);
    await expect(page.locator('[data-djinn-form]')).toBeVisible();
    expect(providerCalls).toBe(0);
});

test('mute restores a saved nonzero level and survives hide/reopen', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('djinn:voice-volume', '0');
        localStorage.setItem('djinn:voice-volume:last', '40');
    });
    await page.goto('/');
    await page.locator('[data-djinn-keyboard]').click();
    await expect(page.locator('[data-djinn-mute]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-djinn-mute]').click();
    await expect(page.locator('[data-djinn-volume]')).toHaveValue('40');
    await page.locator('[data-djinn-mute]').click();
    await page.locator('[data-djinn-input]').press('Escape');
    await page.locator('[data-djinn-keyboard]').click();
    await expect(page.locator('[data-djinn-volume]')).toHaveValue('0');
    await expect(page.locator('[data-djinn-volume-cross]')).toBeVisible();
    await page.locator('[data-djinn-mute]').click();
    await expect(page.locator('[data-djinn-volume]')).toHaveValue('40');
});

test('compact conversation scrolls without a scrollbar and aligns its volume endpoint', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-djinn-keyboard]').click();
    await expect(page.locator('.nav-link__label--full', { hasText: 'Ask Djinn!' })).toHaveText('Ask Djinn!');
    await page.locator('[data-djinn-log]').evaluate((log) => {
        for (let index = 0; index < 20; index++) {
            const row = document.createElement('p');
            row.className = 'djinn-message';
            row.textContent = `Conversation line ${index}. ` .repeat(8);
            log.append(row);
        }
    });
    const geometry = await page.evaluate(() => {
        const log = document.querySelector('[data-djinn-log]')!;
        const panel = document.querySelector('[data-djinn-response]')!;
        return {
            height: panel.getBoundingClientRect().height,
            cap: parseFloat(getComputedStyle(panel).maxHeight),
            overflows: log.scrollHeight > log.clientHeight,
            scrollbar: getComputedStyle(log).scrollbarWidth,
            endpointDifference: Math.abs(document.querySelector('[data-djinn-volume]')!.getBoundingClientRect().right - document.querySelector('[data-djinn-form]')!.getBoundingClientRect().right),
        };
    });
    expect(geometry.height).toBeLessThanOrEqual(geometry.cap + 1);
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect.poll(async () => page.locator('[data-home-header]').evaluate((header) => Math.round(header.getBoundingClientRect().top))).toBe(0);
    const placement = await page.locator('[data-djinn-response]').evaluate((panel) => ({ top: panel.getBoundingClientRect().top, left: panel.getBoundingClientRect().left, right: panel.getBoundingClientRect().right }));
    expect(placement.top).toBeGreaterThan(30);
    expect(placement.left).toBeGreaterThanOrEqual(0);
    expect(placement.right).toBeLessThanOrEqual(page.viewportSize()!.width);
    await expect(page.locator('[data-djinn-close]')).toHaveCount(0);
    expect(geometry.overflows).toBe(true);
    expect(geometry.scrollbar).toBe('none');
    expect(geometry.endpointDifference).toBeLessThan(2);
    await page.locator('[data-djinn-log]').focus();
    await page.keyboard.press('End');
    await expect.poll(() => page.locator('[data-djinn-log]').evaluate((log) => log.scrollTop)).toBeGreaterThan(0);
});

test('backend failure after capture is not presented as a microphone failure', async ({ page }) => {
    await page.route(providerUrl, async (route) => route.fulfill({ status: 503, json: { demo: false } }));
    await page.addInitScript(() => {
        const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = async (constraints) => {
            const stream = await original(constraints);
            (window as any).__nativeTracks = stream.getTracks();
            return stream;
        };
    });
    await page.goto('/');
    await page.locator('[data-djinn-open]').click();
    await expect(page.locator('[data-djinn-status]')).toHaveText('Djinn is offline or unavailable. Please try again later.');
    await expect.poll(async () => page.evaluate(() => (window as any).__nativeTracks?.every((track: MediaStreamTrack) => track.readyState === 'ended'))).toBe(true);
    await expect(page.locator('[data-djinn-form]')).toBeVisible();
});
