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
});
