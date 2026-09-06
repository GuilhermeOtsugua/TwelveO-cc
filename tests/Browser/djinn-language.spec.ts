import { expect, test } from '@playwright/test';

test('Portuguese UI seeds a session and preserves original response language across locale changes', async ({ page }) => {
    const received: Array<Record<string, unknown>> = [];
    let connections = 0;
    const answer = 'Posso explicar o trabalho do Gui.';
    await page.addInitScript(() => localStorage.setItem('otsugua.locale.preference', 'pt-BR'));
    await page.route(/^(?:https:\/\/djinn-voice\.test|http:\/\/127\.0\.0\.1:8080)\//, (route) => route.fulfill({
        json: route.request().url().endsWith('/health') ? { demo: true, challengeRequired: false } : { ticket: 'language-test' },
    }));
    await page.routeWebSocket(/\/browser\/voice\?ticket=/, (ws) => {
        connections++;
        ws.send(JSON.stringify({ type: 'ready', protocol: 2 }));
        ws.onMessage((data) => {
            if (typeof data !== 'string') return;
            const message = JSON.parse(data);
            received.push(message);
            if (message.type === 'text') {
                ws.send(JSON.stringify({ type: 'user_turn', turnId: 1, text: message.text, mode: 'text' }));
                ws.send(JSON.stringify({ type: 'audio_start', turnId: 1, sequence: 0, text: answer, language: 'pt-BR', sampleRate: 24000 }));
                ws.send(Buffer.alloc(24000));
                ws.send(JSON.stringify({ type: 'audio_end', turnId: 1, sequence: 0 }));
                ws.send(JSON.stringify({ type: 'turn_complete', turnId: 1, text: answer }));
            }
        });
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await page.locator('[data-djinn-keyboard]').click();
    await expect(page.locator('[data-djinn-input]')).toHaveAttribute('placeholder', 'Pergunte ao Djinn…');
    await expect(page.locator('[data-djinn-disclosure]')).toBeVisible();
    await expect(page.locator('[data-djinn-disclosure]')).toContainText('Provedores de IA');
    await page.locator('[data-djinn-input]').fill('O que o Gui desenvolve?');
    await page.locator('[data-djinn-input]').press('Enter');
    await expect(page.locator('[data-djinn-message="assistant"]')).toHaveText(answer);
    await expect(page.locator('[data-djinn-message="assistant"]')).toHaveAttribute('lang', 'pt-BR');
    expect(received.findIndex((m) => m.type === 'locale' && m.language === 'pt-BR')).toBeLessThan(received.findIndex((m) => m.type === 'text'));
    expect(received.some((m) => m.type === 'locale' && m.language === 'pt-BR')).toBe(true);
    await page.locator('[data-locale-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('[data-djinn-keyboard]').click();
    await expect(page.locator('[data-djinn-message="assistant"]')).toHaveText(answer);
    await expect(page.locator('[data-djinn-message="assistant"]')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('[data-djinn-message="visitor"]')).toHaveText('O que o Gui desenvolve?');
    expect(connections).toBe(1);
    await expect(page.locator('[data-djinn-disclosure]')).toBeHidden();
});
