import { expect, test } from '@playwright/test';

const harborSurfaceSelector = '[data-project-band-principle="TDD"] [data-project-surface]';

test.describe('Homepage visuals', () => {
    test.beforeEach(async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
    });

    test('Harbor Ledger desktop surface stays visually stable', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const surface = page.locator(harborSurfaceSelector);
        await surface.scrollIntoViewIfNeeded();

        await expect(surface).toHaveScreenshot('harbor-ledger-desktop.png', {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
            maxDiffPixelRatio: 0.02,
        });
    });

    test('Harbor Ledger mobile surface stays visually stable', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'mobile-chromium');

        const surface = page.locator(harborSurfaceSelector);
        await surface.scrollIntoViewIfNeeded();

        await expect(surface).toHaveScreenshot('harbor-ledger-mobile.png', {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
            maxDiffPixelRatio: 0.02,
        });
    });
});
