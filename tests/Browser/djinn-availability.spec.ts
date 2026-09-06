import { expect, test } from '@playwright/test';

for (const [reason, text] of [
    ['busy', 'Djinn is helping other visitors. Please try again shortly.'],
    ['closed', 'Djinn is outside its availability hours. Please try again later.'],
    ['daily_limit', 'Djinn has reached its session limit for today. Please try another day.'],
    ['rate_limit', 'Too many connection attempts. Please wait up to an hour before trying again.'],
]) {
    test(`${reason} has distinct feedback and does not start a provider session`, async ({ page }, testInfo) => {
        let admissions = 0;
        await page.addInitScript(() => localStorage.setItem('otsugua.locale.preference', 'en'));
        await page.route(/^(?:https:\/\/djinn-voice\.test|http:\/\/127\.0\.0\.1:8080)\//, (route) => {
            if (!route.request().url().endsWith('/health')) admissions++;
            return route.fulfill({ status: 503, json: { demo: false, reason } });
        });
        await page.goto('/');
        await page.locator('[data-djinn-keyboard]').click();
        await expect(page.locator('[data-djinn-disclosure]')).toBeVisible();
        await expect(page.locator('[data-djinn-disclosure]')).toContainText('AI providers process your messages and audio.');
        if (reason === 'busy') await page.locator('[data-djinn-response]').screenshot({ path: testInfo.outputPath('djinn-intro.png') });
        await page.locator('[data-djinn-input]').fill('Hello.');
        await page.locator('[data-djinn-input]').press('Enter');
        await expect(page.locator('[data-djinn-status]')).toHaveText(text);
        await expect(page.locator('[data-djinn-disclosure]')).toBeVisible();
        expect(admissions).toBe(0);
    });
}
