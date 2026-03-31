import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://twelveo-cc.test';

export default defineConfig({
    testDir: './tests/Visual',
    fullyParallel: true,
    reporter: 'list',
    snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
    use: {
        baseURL,
        colorScheme: 'light',
        locale: 'en-US',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'desktop-chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 2200 },
            },
        },
        {
            name: 'mobile-chromium',
            use: {
                ...devices['iPhone 13'],
                browserName: 'chromium',
            },
        },
    ],
});
