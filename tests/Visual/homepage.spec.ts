import { expect, test, type Page } from '@playwright/test';

const capabilitySelector = '[data-capability-bands]';

const bandSnapshots = [
    {
        heading: 'Harbor Ledger',
        selector: '[data-project-band-principle="TDD"] [data-project-surface]',
        desktopSnapshot: 'harbor-ledger-desktop.png',
        mobileSnapshot: 'harbor-ledger-mobile.png',
    },
    {
        heading: 'Northline Learning Ops',
        selector: '[data-project-band-principle="DDD"] [data-project-surface]',
        desktopSnapshot: 'northline-learning-ops-desktop.png',
        mobileSnapshot: 'northline-learning-ops-mobile.png',
    },
    {
        heading: 'Studio Current',
        selector: '[data-project-band-principle="Design for impact"] [data-project-surface]',
        desktopSnapshot: 'studio-current-desktop.png',
        mobileSnapshot: 'studio-current-mobile.png',
    },
] as const;

const overflowSelectors = [
    '[data-tdd-approval-stage] p',
    '[data-tdd-evidence-packet] span',
    '[data-tdd-evidence-packet] p',
    '[data-tdd-release-check] p',
    '[data-tdd-release-check] span',
    '[data-tdd-lock-rail] span',
    '[data-ddd-shared-case] p',
    '[data-ddd-shared-thread] p',
    '[data-ddd-role-zone] p',
    '[data-impact-review-flow] p',
    '[data-impact-review-flow] span',
    '[data-impact-approval] p',
    '[data-impact-approval] span',
    '[data-impact-delivery] p',
    '[data-impact-delivery] span',
] as const;

function screenshotOptions() {
    return {
        animations: 'disabled' as const,
        caret: 'hide' as const,
        scale: 'css' as const,
        maxDiffPixelRatio: 0.02,
    };
}

async function openHomepage(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Harbor Ledger' })).toBeVisible();
}

test.describe('Homepage visuals', () => {
    test.beforeEach(async ({ page }) => {
        await openHomepage(page);
    });

    test('Capability bands desktop section stays visually stable', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

        const section = page.locator(capabilitySelector);
        await section.scrollIntoViewIfNeeded();

        await expect(section).toHaveScreenshot('capability-bands-desktop.png', screenshotOptions());
    });

    test('Capability bands mobile section stays visually stable', async ({ page, browserName }, testInfo) => {
        test.skip(browserName !== 'chromium' || testInfo.project.name !== 'mobile-chromium');

        const section = page.locator(capabilitySelector);
        await section.scrollIntoViewIfNeeded();

        await expect(section).toHaveScreenshot('capability-bands-mobile.png', screenshotOptions());
    });

    for (const band of bandSnapshots) {
        test(`${band.heading} desktop surface stays visually stable`, async ({ page, browserName }, testInfo) => {
            test.skip(browserName !== 'chromium' || testInfo.project.name !== 'desktop-chromium');

            const surface = page.locator(band.selector);
            await surface.scrollIntoViewIfNeeded();

            await expect(surface).toHaveScreenshot(band.desktopSnapshot, screenshotOptions());
        });

        test(`${band.heading} mobile surface stays visually stable`, async ({ page, browserName }, testInfo) => {
            test.skip(browserName !== 'chromium' || testInfo.project.name !== 'mobile-chromium');

            const surface = page.locator(band.selector);
            await surface.scrollIntoViewIfNeeded();

            await expect(surface).toHaveScreenshot(band.mobileSnapshot, screenshotOptions());
        });
    }

    test('Project notes toggle visible explanation panels', async ({ page }) => {
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

    test('Critical band text containers do not overflow horizontally', async ({ page }) => {
        const failures = await page.evaluate((selectors) => {
            const issues: Array<{ selector: string; text: string; overflowX: number }> = [];

            for (const selector of selectors) {
                const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

                for (const element of elements) {
                    const rect = element.getBoundingClientRect();
                    const text = element.textContent?.replace(/\s+/g, ' ').trim() ?? '';

                    if (!text || rect.width === 0 || rect.height === 0) {
                        continue;
                    }

                    const overflowX = element.scrollWidth - element.clientWidth;

                    if (overflowX > 2) {
                        issues.push({
                            selector,
                            text: text.slice(0, 120),
                            overflowX: Math.round(overflowX),
                        });
                    }
                }
            }

            return issues;
        }, [...overflowSelectors]);

        expect(failures).toEqual([]);
    });
});
