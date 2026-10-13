import { expect, test } from '@playwright/test';

for (const elapsed of [1000, 4100]) {
    test(`manual speed at ${elapsed}ms survives exit, re-entry and motion changes`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
        await page.goto('/');
        await page.locator('[data-life-enter]').click();
        await page.clock.runFor(elapsed);
        const slider = page.locator('[data-life-speed]');
        await slider.fill('1.7');
        await page.clock.runFor(4100);
        await expect(slider).toHaveValue('1.7');
        await page.keyboard.press('Escape');
        await page.clock.runFor(4100);
        await expect(slider).toHaveValue('1.7');
        await page.locator('[data-life-enter]').click();
        await page.clock.runFor(1000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.clock.runFor(100);
        await expect(slider).toHaveValue('1.7');
        await page.keyboard.press('Escape');
        await page.locator('[data-life-enter]').click();
        await expect(slider).toHaveValue('1.7');
        await page.locator('[data-life-speed-reset]').click();
        await expect(slider).toHaveValue('1');
        await page.keyboard.press('Escape');
        await page.locator('[data-life-enter]').click();
        await expect(slider).toHaveValue('1');
    });
}

for (const control of ['[data-life-speed]', '[data-life-speed-reset]']) {
    test(`focusing ${control} claims speed before any value change`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
        await page.goto('/');
        await page.locator('[data-life-enter]').click();
        await page.clock.runFor(1000);
        const slider = page.locator('[data-life-speed]');
        await page.locator(control).focus();
        const chosen = await slider.inputValue();
        await page.clock.runFor(4100);
        await expect(slider).toHaveValue(chosen);
        await page.keyboard.press('Escape');
        await page.clock.runFor(4100);
        await page.locator('[data-life-enter]').click();
        await page.clock.runFor(4100);
        await expect(slider).toHaveValue(chosen);
    });
}
