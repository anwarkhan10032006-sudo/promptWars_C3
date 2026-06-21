import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('VERDANCE Accessibility (WCAG 2.2 AA) Scans', () => {
  test('landing page should have no automatically detectable accessibility issues', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Wait for critical content to load
    await page.waitForSelector('main');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard client should have proper semantic tags and landmarks', async ({ page }: { page: Page }) => {
    await page.goto('/dashboard');
    
    // Check main document outline
    const mainCount = await page.locator('main').count();
    expect(mainCount).toBeLessThanOrEqual(1);

    // Validate ARIA roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.innerText();
      // Interactive element must have label or text content
      expect(ariaLabel || text).toBeTruthy();
    }
  });
});
