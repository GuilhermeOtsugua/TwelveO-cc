import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.use({ reducedMotion: 'reduce' });
test.beforeEach(async ({ page }) => {
    await page.route('**/__scroll-module.js', async (route) => route.fulfill({ contentType: 'text/javascript', body: await readFile('resources/js/djinn-scroll.js', 'utf8') }));
    await page.route('**/__scroll-test', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
        <style>#log{box-sizing:border-box;height:280px;width:320px;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:14px}p{margin:0;min-height:120px;flex:none}</style>
        <div id="log" tabindex="0"></div><script type="module">
        import { createChatScroller } from '/__scroll-module.js';
        const log = document.querySelector('#log');
        window.scroller = createChatScroller(log);
        window.append = () => window.scroller.update(() => {
            const row = document.createElement('p'); row.dataset.djinnMessage = 'assistant';
            row.textContent = 'A readable conversation message.'; log.append(row);
        });
        for (let i=0;i<16;i++) window.append();
        window.ready = true;
        </script>` }));
    await page.goto('/__scroll-test');
    await expect.poll(() => page.evaluate(() => (window as any).ready)).toBe(true);
});

async function boundary(page: Page, index: number, direction: 'up' | 'down') {
    return page.locator('#log').evaluate((log, { index, direction }) => {
        const row = log.children[index].getBoundingClientRect();
        const rect = log.getBoundingClientRect();
        return log.scrollTop + (direction === 'up' ? row.top - rect.top - 16 : row.bottom - rect.top - log.clientHeight + 16);
    }, { index, direction });
}
async function position(page: Page, top: number) {
    await page.locator('#log').evaluate((log, top) => { log.scrollTop = top; }, top);
    await page.evaluate(() => new Promise(requestAnimationFrame));
}
const scrollTop = (page: Page) => page.locator('#log').evaluate((log) => log.scrollTop);

for (const direction of ['up', 'down'] as const) {
    test(`wheel scrolling ${direction} settles at the corresponding message edge`, async ({ page }) => {
        const target = await boundary(page, 7, direction);
        const sign = direction === 'up' ? -1 : 1;
        await position(page, target - sign * 80);
        await page.locator('#log').hover();
        await page.mouse.wheel(0, sign * 70);
        await expect.poll(async () => Math.abs(await scrollTop(page) - target)).toBeLessThan(1.5);
    });
}

test('smooth settling completes without repeatedly snapping', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const target = await boundary(page, 7, 'up');
    await position(page, target + 80);
    await page.locator('#log').hover();
    await page.mouse.wheel(0, -70);
    await expect.poll(async () => Math.abs(await scrollTop(page) - target)).toBeLessThan(1.5);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target, 0);
});

test('selected text is not moved by message settling', async ({ page }) => {
    const target = await boundary(page, 7, 'up');
    await position(page, target + 80);
    await page.locator('#log > p').nth(7).evaluate((row) => {
        const range = document.createRange(); range.selectNodeContents(row);
        window.getSelection()!.removeAllRanges(); window.getSelection()!.addRange(range);
    });
    await page.locator('#log').hover();
    await page.mouse.wheel(0, -70);
    await expect.poll(() => scrollTop(page)).toBeCloseTo(target + 10, 0);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 10, 0);
});

test('does not jump to distant message boundaries', async ({ page }) => {
    const target = await boundary(page, 7, 'up');
    await position(page, target + 80);
    await page.locator('#log').hover();
    await page.mouse.wheel(0, -20);
    await expect.poll(() => scrollTop(page)).toBeCloseTo(target + 60, 0);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 60, 0);
});

test('programmatic scrolling is not interpreted as a gesture', async ({ page }) => {
    const target = await boundary(page, 7, 'up');
    await position(page, target + 10);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 10, 0);
});

test('growing messages and the middle of oversized messages remain freely scrollable', async ({ page }) => {
    await page.locator('#log > p').nth(7).evaluate((row) => row.classList.add('djinn-message--active'));
    const target = await boundary(page, 7, 'up');
    await position(page, target + 80);
    await page.locator('#log').hover();
    await page.mouse.wheel(0, -70);
    await expect.poll(() => scrollTop(page)).toBeCloseTo(target + 10, 0);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 10, 0);
    await page.locator('#log > p').nth(7).evaluate((row) => { row.classList.remove('djinn-message--active'); (row as HTMLElement).style.minHeight = '900px'; });
    await position(page, target + 300);
    await page.mouse.wheel(0, 30);
    await expect.poll(() => scrollTop(page)).toBeCloseTo(target + 330, 0);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 330, 0);
});

test('waits for touch release, including browser pointer cancellation during a pan', async ({ page }) => {
    const target = await boundary(page, 7, 'up');
    await position(page, target + 80);
    await page.locator('#log').dispatchEvent('touchstart', { touches: [{ identifier: 1, clientX: 50, clientY: 60 }] });
    await page.locator('#log').dispatchEvent('pointercancel', { pointerType: 'touch' });
    await position(page, target + 10);
    await page.waitForTimeout(450);
    expect(await scrollTop(page)).toBeCloseTo(target + 10, 0);
    await page.locator('#log').dispatchEvent('touchend', { touches: [] });
    await expect.poll(async () => Math.abs(await scrollTop(page) - target)).toBeLessThan(1.5);
});

test('live updates follow the bottom but do not pull a reader away from history', async ({ page }) => {
    const before = await scrollTop(page);
    await page.evaluate(() => (window as any).append());
    expect(await scrollTop(page)).toBeGreaterThan(before);
    await page.locator('#log').hover();
    await page.mouse.wheel(0, -350);
    await expect.poll(() => scrollTop(page)).toBeLessThan(before);
    await page.waitForTimeout(450);
    const reading = await scrollTop(page);
    await page.evaluate(() => (window as any).append());
    expect(await scrollTop(page)).toBeCloseTo(reading, 0);
    await page.locator('#log').focus();
    await page.keyboard.press('End');
    await expect.poll(() => page.locator('#log').evaluate((log) => log.scrollHeight - log.clientHeight - log.scrollTop)).toBeLessThan(2);
    await page.waitForTimeout(250);
    const end = await scrollTop(page);
    await page.evaluate(() => (window as any).append());
    expect(await scrollTop(page)).toBeGreaterThan(end);
});
