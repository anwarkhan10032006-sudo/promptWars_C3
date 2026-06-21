import { test, expect, Page } from '@playwright/test';

test.describe('VERDANCE Dashboard E2E Workflow', () => {
  test('should successfully load the landing page and allow demo user login', async ({ page }: { page: Page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Sustainability Copilot');

    // 2. Click demo access
    const loginLink = page.locator('a[href="/demo"]');
    await expect(loginLink).toBeVisible();
    await loginLink.click();

    // 3. Select a demo persona and load dashboard
    await expect(page).toHaveURL(/.*demo/);
    const studentPersonaCard = page.locator('text=College Student');
    await expect(studentPersonaCard).toBeVisible();
    await page.click('text=Select Student Profile');

    // 4. Verify dashboard is loaded successfully with details
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Community Challenges');
  });
});
