import { expect, test } from '@playwright/test';

test('Northline translates default drafts but preserves user edits across locale changes', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('[data-northline-workflow-action="class-message"]:visible').first().click();

    const subject = page.locator('[data-northline-message-subject]');
    const body = page.locator('[data-northline-message-body]');
    const language = page.locator('[data-locale-toggle]');
    await expect(subject).toHaveValue('Update for Class A • World History Seminar');

    await language.click();
    await expect(subject).toHaveValue('Atualização para Turma A • Seminário de História Mundial');
    await expect(body).toHaveValue(/Olá, turma,[\s\S]*Seminário de História Mundial/);

    await subject.fill('My own subject');
    await body.fill('Keep my classroom message exactly as written.');
    await language.click();
    await expect(subject).toHaveValue('My own subject');
    await expect(body).toHaveValue('Keep my classroom message exactly as written.');
});
