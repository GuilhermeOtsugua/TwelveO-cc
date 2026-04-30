import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://twelveo-cc.test';
const isWindows = process.platform === 'win32';

export default defineConfig({
    testDir: './tests',
    fullyParallel: ! isWindows,
    workers: isWindows ? 1 : undefined,
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
