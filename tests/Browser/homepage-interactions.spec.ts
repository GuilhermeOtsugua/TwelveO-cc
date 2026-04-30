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

    test('Northline grading queue row opens the grading workbench for that assignment', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const northline = await openNorthlineSurface(page);

        await northline.getByRole('button', { name: 'Open grading item: Midterm Paper' }).click();

        const gradingOverlay = northline.locator('[data-northline-overlay="grading"]').filter({ visible: true });

        await expect(gradingOverlay.locator('#northline-grading-title')).toBeVisible();
        await expect(gradingOverlay.locator('[data-northline-grading-assignment]').first()).toHaveValue('whs-midterm-paper');
        await expect(gradingOverlay.locator('[data-northline-grading-student]').first()).toHaveValue('leo-grant');
    });

    test('Northline event row opens the exams workspace with the due soon filter active', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const northline = await openNorthlineSurface(page);

        await northline.getByRole('button', { name: 'Open event: Outline Review Conference' }).click();

        await expect(northline.locator('[data-northline-view-title]')).toHaveText('Assessment Planning');
        await expect(northline.locator('[data-northline-view-description]')).toHaveText('Upcoming due work for the current class.');
        await expect(northline.locator('[data-northline-header-filter]')).toContainText('Due soon');
        await expect(northline.locator('[data-northline-view-panel="exams"]')).toContainText('Unit Essay Checkpoint');
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
});
