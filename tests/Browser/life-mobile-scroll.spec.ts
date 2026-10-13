import { expect, test } from '@playwright/test';

// Both projects exercise the narrow layout: desktop mouse/1x and mobile/touch/3x.
test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:10Z'));
    await page.addInitScript(() => {
        (window as any).lifeMobileWork = { generations: 0, uploads: 0, rasterScroll: 0, headerReads: 0 };
        const set = Uint8Array.prototype.set;
        Uint8Array.prototype.set = function (source, offset) {
            if (source instanceof Uint8Array && source.length > 1000) (window as any).lifeMobileWork.generations++;
            return set.call(this, source, offset);
        };
        const put = CanvasRenderingContext2D.prototype.putImageData;
        CanvasRenderingContext2D.prototype.putImageData = function (...args) {
            if (this.canvas.classList.contains('life-background')) {
                (window as any).lifeMobileWork.uploads++;
                (window as any).lifeMobileWork.rasterScroll = Math.max(0, window.scrollY);
            }
            return put.apply(this, args);
        };
        const rect = Element.prototype.getBoundingClientRect;
        Element.prototype.getBoundingClientRect = function () {
            if (this.hasAttribute('data-home-header')) (window as any).lifeMobileWork.headerReads++;
            return rect.call(this);
        };
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
});

test('fast mobile scrolling keeps the visible field aligned on every frame', async ({ page }) => {
    test.setTimeout(60_000);
    await page.locator('[data-life-enter]').click();
    await page.clock.runFor(4100);
    await page.evaluate(() => {
        window.scrollTo({ top: 450, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(100);
    await page.evaluate(() => {
        (window as any).lifeMobileWork.generations = 0;
        (window as any).lifeMobileWork.uploads = 0;
        (window as any).lifeMobileMotion = { frames: 0, moves: 0, lags: [] };
        (window as any).lifeMobileScrolling = true;
        const canvas = document.querySelector('.life-background') as HTMLCanvasElement;
        let previousCamera: number | null = null;
        let frame = 0;
        const scroll = () => {
            if (!(window as any).lifeMobileScrolling) return;
            // Observe the frame already produced, then move 80px for the next
            // frame. A high RAF rate alone cannot detect a stale canvas camera.
            const shift = Number.parseFloat(canvas.style.transform.split(',')[1] || '0');
            const camera = (window as any).lifeMobileWork.rasterScroll - shift;
            const motion = (window as any).lifeMobileMotion;
            motion.frames++;
            if (Math.abs(camera - window.scrollY) > 0.5) motion.lags.push(Math.abs(camera - window.scrollY));
            if (previousCamera !== null && camera !== previousCamera) motion.moves++;
            previousCamera = camera;
            const travel = (frame++ * 80) % 3200;
            window.scrollTo({ top: 450 + (travel <= 1600 ? travel : 3200 - travel), behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
            (window as any).lifeMobileFrame = requestAnimationFrame(scroll);
        };
        (window as any).lifeMobileFrame = requestAnimationFrame(scroll);
    });
    await page.clock.runFor(1000);
    const result = await page.evaluate(() => {
        (window as any).lifeMobileScrolling = false;
        cancelAnimationFrame((window as any).lifeMobileFrame);
        return { ...(window as any).lifeMobileMotion, ...(window as any).lifeMobileWork };
    });
    expect(result.frames).toBeGreaterThanOrEqual(59);
    expect(result.moves).toBeGreaterThanOrEqual(57);
    expect(result.lags).toEqual([]);
    expect(Math.abs(result.generations - 24)).toBeLessThanOrEqual(1);
    expect(Math.abs(result.uploads - 24)).toBeLessThanOrEqual(1);
});

test('hidden mobile header does no scroll work and resumes normal navigation after exit', async ({ page }) => {
    test.setTimeout(60_000);
    const header = page.locator('[data-home-header]');
    await page.evaluate(() => {
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
        window.scrollTo({ top: 600, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(400);
    await expect(header).toHaveClass(/is-mobile-nav-hidden/);
    await page.locator('[data-life-enter]').dispatchEvent('click');
    await page.clock.runFor(4100);
    await page.evaluate(() => {
        (window as any).lifeMobileWork.headerReads = 0;
        (window as any).lifeHeaderMutations = 0;
        const observer = new MutationObserver(records => (window as any).lifeHeaderMutations += records.length);
        observer.observe(document.querySelector('[data-home-header]')!, { attributes: true, attributeFilter: ['class'] });
        (window as any).lifeHeaderObserver = observer;
        (window as any).lifeHeaderScrolling = true;
        let frame = 0;
        const scroll = () => {
            if (!(window as any).lifeHeaderScrolling) return;
            window.dispatchEvent(new WheelEvent('wheel', { deltaY: frame % 20 < 10 ? 80 : -80 }));
            window.scrollTo({ top: 600 + (frame++ % 20) * 80, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
            (window as any).lifeHeaderFrame = requestAnimationFrame(scroll);
        };
        (window as any).lifeHeaderFrame = requestAnimationFrame(scroll);
    });
    await page.clock.runFor(1000);
    const hiddenWork = await page.evaluate(() => {
        (window as any).lifeHeaderScrolling = false;
        cancelAnimationFrame((window as any).lifeHeaderFrame);
        (window as any).lifeHeaderObserver.disconnect();
        return { reads: (window as any).lifeMobileWork.headerReads, mutations: (window as any).lifeHeaderMutations };
    });
    expect(hiddenWork).toEqual({ reads: 0, mutations: 0 });
    await page.keyboard.press('Escape');
    await page.clock.runFor(4100);
    expect(await page.evaluate(() => window.scrollY)).toBe(600);
    await expect(header).toHaveClass(/is-mobile-nav-hidden/);
    await page.evaluate(() => {
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: -200 }));
        window.scrollTo({ top: 400, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(400);
    await expect(header).not.toHaveClass(/is-mobile-nav-hidden/);
    await page.evaluate(() => {
        window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
        window.scrollTo({ top: 700, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
    });
    await page.clock.runFor(400);
    await expect(header).toHaveClass(/is-mobile-nav-hidden/);
});
