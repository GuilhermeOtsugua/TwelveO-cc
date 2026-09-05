import { expect, test, type Page } from '@playwright/test';

async function openHomepage(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
}

function northlineBand(page: Page) {
    return page.locator('[data-project-band-principle="DDD"]');
}

async function openNorthlineSurface(page: Page) {
    const surface = northlineBand(page).locator('[data-project-interface-slice]');
    await surface.scrollIntoViewIfNeeded();

    return northlineBand(page);
}

test.describe('Homepage interactions', () => {
    test.beforeEach(async ({ page }) => {
        await openHomepage(page);
    });

    test('project notes toggle visible explanation panels', async ({ page }) => {
        const bands = page.locator('[data-project-band]');
        const count = await bands.count();

        expect(count).toBe(3);

        for (let index = 0; index < count; index++) {
            const band = bands.nth(index);
            const toggle = band.locator('[data-project-note-toggle]');
            const panel = band.locator('[data-project-note-panel]');

            await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            await expect(panel).toBeHidden();

            await toggle.click();

            await expect(toggle).toHaveAttribute('aria-expanded', 'true');
            await expect(panel).toBeVisible();

            await toggle.click();

            await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            await expect(panel).toBeHidden();
        }
    });

    test('language toggle switches homepage and interface copy without navigation', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const originalUrl = page.url();
        const toggle = page.locator('[data-locale-toggle]');
        const northline = northlineBand(page);

        await expect(toggle.locator('.locale-toggle__active-label')).toHaveText('EN');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveAttribute('src', '/flags/us.svg');
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveAttribute('src', '/flags/br.svg');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveClass(/locale-toggle__flag--active/);
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveClass(/locale-toggle__flag--inactive/);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();

        await toggle.click();

        await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
        await expect(toggle.locator('.locale-toggle__active-label')).toHaveText('BR');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveAttribute('src', '/flags/us.svg');
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveAttribute('src', '/flags/br.svg');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveClass(/locale-toggle__flag--inactive/);
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveClass(/locale-toggle__flag--active/);
        await expect(page.getByRole('link', { name: 'Projetos' })).toBeVisible();
        await expect(northline.locator('[data-northline-view-title]')).toHaveText('Central de tarefas do professor');
        expect(page.url()).toBe(originalUrl);

        await toggle.click();

        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(toggle.locator('.locale-toggle__active-label')).toHaveText('EN');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveAttribute('src', '/flags/us.svg');
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveAttribute('src', '/flags/br.svg');
        await expect(toggle.locator('.locale-toggle__flag--us')).toHaveClass(/locale-toggle__flag--active/);
        await expect(toggle.locator('.locale-toggle__flag--br')).toHaveClass(/locale-toggle__flag--inactive/);
        await expect(northline.locator('[data-northline-view-title]')).toHaveText("Teacher's Task & Grading Center");
        expect(page.url()).toBe(originalUrl);
    });

    test('Upwork contact source disables email copy until direct override', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        await page.evaluate(() => window.localStorage.removeItem('otsugua.locale.preference'));
        await page.goto('/?ref=upwork#contact');
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();

        const emailButton = page.locator('[data-copy-email]').first();
        const feedback = page.locator('[data-copy-email-feedback]');

        await emailButton.scrollIntoViewIfNeeded();
        await emailButton.click();

        await expect(feedback).toHaveText('Temporarily disabled.');
        await expect(feedback).toHaveAttribute('data-copy-email-feedback-state', 'error');

        await page.locator('[data-locale-toggle]').click();
        await emailButton.click();

        await expect(feedback).toHaveText('Temporariamente indisponível.');
        await expect(feedback).toHaveAttribute('data-copy-email-feedback-state', 'error');

        await page.goto('/#contact');
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
        await emailButton.click();

        await expect(feedback).toHaveText('Temporariamente indisponível.');
        await expect(feedback).toHaveAttribute('data-copy-email-feedback-state', 'error');

        await page.goto('/?source=direct#contact');
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
        await emailButton.click();

        await expect(feedback).toHaveText('Temporariamente indisponível.');
        await expect(feedback).toHaveAttribute('data-copy-email-feedback-state', 'error');

        await page.goto('/?ref=direct#contact');
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
        await emailButton.click();

        await expect(feedback).toHaveText('Copiado!');
        await expect(feedback).toHaveAttribute('data-copy-email-feedback-state', 'success');
    });

    test('Harbor review queue selection updates the active transaction workspace', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const workspaceLabel = page.locator('[data-harbor-active-transaction-label]');
        const agent = page.locator('[data-harbor-active-agent]');
        const source = page.locator('[data-harbor-active-source]');
        const counterparty = page.locator('[data-harbor-active-counterparty]');
        const riskScore = page.locator('[data-harbor-active-risk-score]');
        const queueOption = page.locator('[data-harbor-transaction-option][data-harbor-transaction-id="TRX-9904"]');

        await expect(workspaceLabel).toContainText('TRX-9902');

        await queueOption.click();

        await expect(queueOption).toHaveAttribute('aria-pressed', 'true');
        await expect(workspaceLabel).toContainText('TRX-9904');
        await expect(agent).toContainText('Mina Park');
        await expect(source).toContainText('INTER-LEDGER');
        await expect(counterparty).toContainText('INTER_LEDGER_SETTLEMENT');
        await expect(riskScore).toContainText('92/100');
    });

    test('Harbor commentary owns a real scroll range', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const scroller = page.locator('[data-harbor-commentary-scroller]');

        await scroller.evaluate((element) => {
            element.scrollTop = 9999;
        });

        await expect.poll(async () => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    });

    test('product logos reset their interface slices', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const harbor = page.locator('[data-harbor-ledger-slice]');

        await harbor.locator('[data-harbor-transaction-option][data-harbor-transaction-id="TRX-9904"]').click();
        await harbor.locator('[data-harbor-reset]').click();

        await expect(harbor.locator('[data-harbor-transaction-option][data-harbor-transaction-id="TRX-9902"]')).toHaveAttribute('aria-pressed', 'true');
        await expect(harbor.locator('[data-harbor-panel="queue"]')).toHaveAttribute('data-harbor-panel-state', 'expanded');
        await expect(harbor.locator('[data-harbor-panel="summary"]')).toHaveAttribute('data-harbor-panel-state', 'collapsed');

        const northline = await openNorthlineSurface(page);

        await northline.getByRole('button', { name: 'Open event: Outline Review Conference' }).click();
        await northline.locator('[data-northline-reset]').click();

        await expect(northline.locator('[data-northline-view-title]')).toHaveText("Teacher's Task & Grading Center");
        await expect(northline.locator('[data-northline-overlay-layer]')).toBeHidden();

        const studioViewport = page.locator('[data-studio-current-viewport]');

        await studioViewport.scrollIntoViewIfNeeded();
        await studioViewport.evaluate((element) => {
            element.scrollTop = 9999;
        });
        await page.locator('[data-studio-current-reset]').click();

        await expect.poll(async () => studioViewport.evaluate((element) => element.scrollTop)).toBe(0);
    });

    test('Northline grading queue row opens the grading workbench for that assignment', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const northline = await openNorthlineSurface(page);

        await northline.getByRole('button', { name: 'Open grading item: Midterm Paper' }).click();

        const gradingOverlay = northline.locator('[data-northline-overlay="grading"]').filter({ visible: true });

        await expect(gradingOverlay.locator('#northline-grading-title')).toBeVisible();
        await expect(gradingOverlay.locator('[data-northline-grading-assignment]').first()).toHaveValue('whs-midterm-paper');
        await expect(gradingOverlay.locator('[data-northline-grading-student]').first()).toHaveValue('leo-grant');
    });

    test('Northline mobile grading sheet keeps controls contained', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'mobile-chromium');

        const northline = await openNorthlineSurface(page);

        await northline.locator('[data-northline-workflow-action="bulk-grading"]').filter({ visible: true }).click();

        const gradingOverlay = northline.locator('[data-northline-overlay="grading"]').filter({ visible: true });
        const submissionFile = gradingOverlay.locator('.northline-mobile-submission-card .northline-secondary-chip');
        const submissionTime = gradingOverlay.locator('.northline-mobile-submission-card__time');
        const gradeSelect = gradingOverlay.locator('.northline-mobile-grade-card .northline-field-label:first-child select');
        const noteField = gradingOverlay.locator('.northline-mobile-grade-card textarea');

        await expect(gradingOverlay.locator('#northline-grading-title-mobile')).toBeVisible();
        await expect(submissionTime).toHaveText(/^\d+m ago$/);
        await expect(submissionTime).toHaveCSS('justify-self', 'end');
        await expect(submissionFile).toHaveCSS('overflow-x', 'hidden');
        await expect.poll(async () => submissionFile.evaluate((element) => element.clientWidth)).toBeLessThan(
            await submissionFile.evaluate((element) => element.scrollWidth),
        );

        const [gradeBox, noteBox] = await Promise.all([
            gradeSelect.boundingBox(),
            noteField.boundingBox(),
        ]);

        expect(gradeBox).not.toBeNull();
        expect(noteBox).not.toBeNull();

        const gradeCenter = gradeBox!.y + (gradeBox!.height / 2);
        const noteCenter = noteBox!.y + (noteBox!.height / 2);

        expect(Math.abs(gradeCenter - noteCenter)).toBeLessThanOrEqual(2);
    });

    test('Northline only enables popup-ready actions', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium');

        const northline = await openNorthlineSurface(page);
        const triggerClick = async (selector: string) => {
            await northline.locator(selector).first().evaluate((element) => {
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            });
        };
        const expectDashboardOnly = async () => {
            await expect(northline.locator('[data-northline-view-panel="dashboard"]')).toBeVisible();
            await expect(northline.locator('[data-northline-view-panel="documents"]')).toBeHidden();
            await expect(northline.locator('[data-northline-view-panel="exams"]')).toBeHidden();
            await expect(northline.locator('[data-northline-view-panel="students"]')).toBeHidden();
        };

        await triggerClick('[data-northline-nav="documents"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-nav="exams"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-nav="students"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-trigger-alerts]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-workflow-action="post-materials"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-workflow-action="create-exam"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-metric="late-submits"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-metric="deadlines"]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-open-event]');
        await expectDashboardOnly();

        await triggerClick('[data-northline-workflow-action="bulk-grading"]');
        await expect(northline.locator('[data-northline-overlay="grading"]').filter({ visible: true })).toBeVisible();
        await northline.getByRole('button', { name: 'Close grading workbench' }).click();

        await triggerClick('[data-northline-workflow-action="class-message"]');
        await expect(northline.locator('[data-northline-overlay="message"]').filter({ visible: true })).toBeVisible();
    });

    test('Studio Current inner viewport scrolls independently', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const viewport = page.locator('[data-studio-current-viewport]');
        await viewport.scrollIntoViewIfNeeded();

        await viewport.evaluate((element) => {
            element.scrollTop = 9999;
        });

        await expect.poll(async () => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    });

    test('Djinn supports typed audio replies, volume, and microphone switching', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium');

        await page.addInitScript(() => {
            const originalFetch = window.fetch.bind(window);
            window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
                if (String(input).includes('127.0.0.1:8080/browser/session')) {
                    return Promise.resolve(new Response(JSON.stringify({ ticket: 'test-ticket' }), { status: 200 }));
                }
                if (String(input).includes('127.0.0.1:8080/health')) {
                    return Promise.resolve(new Response(JSON.stringify({ status: 'ok', demo: true }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }));
                }
                return originalFetch(input, init);
            }) as typeof window.fetch;

            class FakeAudioContext {
                state = 'running';
                currentTime = 0;
                destination = {};
                gains: Array<{ connect(): void; gain: { value: number; setTargetAtTime(value: number): void } }> = [];
                constructor() {
                    (window as Window & { __djinnAudioContext?: FakeAudioContext }).__djinnAudioContext = this;
                }
                resume = async () => {};
                sampleRate = 48000;
                createMediaStreamSource = () => ({ connect() {}, disconnect() {} });
                createScriptProcessor = () => ({ connect() {}, disconnect() {}, onaudioprocess: null });
                createGain = () => {
                    const gain = {
                        value: 1,
                        setTargetAtTime(value: number) { this.value = value; },
                    };
                    const node = { connect() {}, disconnect() {}, gain };
                    this.gains.push(node);
                    return node;
                };
                createBuffer = (_channels: number, length: number, rate: number) => ({
                    duration: length / rate,
                    getChannelData: () => new Float32Array(length),
                });
                createBufferSource = () => ({ connect() {}, start() {}, stop() {}, onended: null, buffer: null });
            }

            class FakeWebSocket {
                static OPEN = 1;
                static CONNECTING = 0;
                readyState = FakeWebSocket.CONNECTING;
                bufferedAmount = 0;
                turnCount = 0;
                binaryType = 'arraybuffer';
                onmessage: ((event: MessageEvent) => void) | null = null;
                onclose: (() => void) | null = null;
                onerror: (() => void) | null = null;
                sent: Array<Record<string, unknown>> = [];

                constructor() {
                    (window as Window & { __djinnSocket?: FakeWebSocket }).__djinnSocket = this;
                    queueMicrotask(() => {
                        this.readyState = FakeWebSocket.OPEN;
                        this.emit({ type: 'ready', sessionSeconds: 180 });
                    });
                }

                emit(message: Record<string, unknown>) {
                    this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(message) }));
                }

                emitAudio(durationMs: number, sampleRate = 24000) {
                    this.onmessage?.(new MessageEvent('message', {
                        data: new ArrayBuffer(Math.round(sampleRate * (durationMs / 1000)) * 2),
                    }));
                }

                send(payload: string | ArrayBuffer) {
                    if (typeof payload !== 'string') return;
                    const message = JSON.parse(payload);
                    this.sent.push(message);
                    if (message.type === 'mode') queueMicrotask(() => this.emit({ type: 'listening_ready' }));
                    if (message.type === 'text') queueMicrotask(() => this.emit({ type: 'user_turn', turnId: ++this.turnCount, mode: 'text', text: message.text }));
                }

                close() {
                    this.readyState = 3;
                    this.onclose?.();
                }
            }

            Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeAudioContext });
            Object.defineProperty(navigator, 'mediaDevices', {
                configurable: true,
                value: { getUserMedia: async () => {
                    (window as any).__microphoneCalls = ((window as any).__microphoneCalls ?? 0) + 1;
                    return { getTracks: () => [{ stop() {} }] };
                } },
            });
            Object.defineProperty(window, 'WebSocket', { configurable: true, value: FakeWebSocket });
        });
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();

        const trigger = page.locator('[data-djinn-open]');
        const answer = page.locator('[data-djinn-message="assistant"]').last();
        await page.locator('[data-djinn-keyboard]').click();
        await expect(page.locator('[data-djinn-form]')).toBeVisible();
        expect(await page.evaluate(() => (window as any).__djinnSocket)).toBeUndefined();
        const volume = page.locator('[data-djinn-volume]');
        await expect(volume).toHaveValue('100');
        await volume.evaluate((element) => {
            const input = element as HTMLInputElement;
            input.value = '35';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await expect.poll(async () => page.evaluate(() => window.localStorage.getItem('djinn:voice-volume'))).toBe('35');
        await page.locator('[data-djinn-input]').fill('Can it explain our refund policy?');
        await page.getByRole('button', { name: 'Send question', exact: true }).click();
        await expect(page.locator('[data-djinn-message="visitor"]')).toHaveText('Can it explain our refund policy?');
        expect(await page.evaluate(() => (window as any).__microphoneCalls ?? 0)).toBe(0);
        await expect.poll(async () => page.evaluate(() => {
            const context = (window as Window & {
                __djinnAudioContext?: { gains: Array<{ gain: { value: number } }> };
            }).__djinnAudioContext;
            return context?.gains[0]?.gain.value;
        })).toBe(0.35);

        await page.evaluate(() => {
            const socket = (window as Window & {
                __djinnSocket?: {
                    emit(message: Record<string, unknown>): void;
                    emitAudio(durationMs: number, sampleRate?: number): void;
                };
                __djinnAudioContext?: { currentTime: number };
            }).__djinnSocket;
            socket?.emit({ type: 'audio_start', turnId: 1, sequence: 0, text: 'This is the latest Djinn response.', sampleRate: 24000 });
            socket?.emitAudio(2000);
            const context = (window as Window & { __djinnAudioContext?: { currentTime: number } }).__djinnAudioContext;
            if (context) context.currentTime = 0.65;
        });
        await expect.poll(async () => (await answer.textContent())?.split(/\s+/).filter(Boolean).length ?? 0).toBeGreaterThan(0);
        const wordsAheadOfSpeech = (await answer.textContent())?.split(/\s+/).filter(Boolean).length ?? 0;
        expect(wordsAheadOfSpeech).toBeLessThanOrEqual(2);
        await expect(answer).not.toHaveText('This is the latest Djinn response.');

        await page.evaluate(() => {
            const browserWindow = window as Window & {
                __djinnSocket?: { emit(message: Record<string, unknown>): void };
                __djinnAudioContext?: { currentTime: number };
            };
            if (browserWindow.__djinnAudioContext) browserWindow.__djinnAudioContext.currentTime = 2.1;
            browserWindow.__djinnSocket?.emit({ type: 'audio_end', turnId: 1, sequence: 0 });
            browserWindow.__djinnSocket?.emit({ type: 'turn_complete', turnId: 1, text: 'This is the latest Djinn response.' });
        });
        await expect(answer).toHaveText('This is the latest Djinn response.');
        if (process.env.DJINN_SCREENSHOTS) {
            await page.screenshot({ path: testInfo.outputPath('djinn-chat.png') });
        }

        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-pressed', 'true');
        expect(await page.evaluate(() => (window as any).__microphoneCalls)).toBe(1);
        await trigger.click();
        await expect(trigger).toHaveAttribute('aria-pressed', 'false');
        await expect(page.locator('[data-djinn-form]')).toBeVisible();
        await expect(answer).toHaveText('This is the latest Djinn response.');

        await page.evaluate(() => {
            const socket = (window as Window & {
                __djinnSocket?: {
                    emit(message: Record<string, unknown>): void;
                    sent: Array<Record<string, unknown>>;
                };
            }).__djinnSocket;
            socket?.emit({ type: 'playback_stopped', interruptToken: 'stop-1' });
        });
        await expect.poll(async () => page.evaluate(() => {
            const socket = (window as Window & { __djinnSocket?: { sent: Array<Record<string, unknown>> } }).__djinnSocket;
            return socket?.sent.some((message) => message.type === 'playback_ack' && message.turnId === 1 && message.words === 6);
        })).toBe(true);

        await page.locator('[data-djinn-keyboard]').click();
        await page.locator('[data-djinn-input]').fill('How would that work for a museum?');
        await page.getByRole('button', { name: 'Send question', exact: true }).click();
        await expect(page.locator('[data-djinn-message="visitor"]')).toHaveCount(2);
        await expect(page.locator('[data-djinn-message="assistant"]').first()).toHaveText('This is the latest Djinn response.');
        await page.locator('[data-djinn-close]').click();
        await expect(page.locator('[data-djinn-response]')).toBeHidden();
        await expect(page.locator('[data-djinn-message]')).toHaveCount(0);
    });
});
