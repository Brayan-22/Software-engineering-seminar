import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { mkdir } from 'fs/promises';
import { join } from 'path';

setDefaultTimeout(60 * 1000);

Before(async function () {
  await this.launchBrowser();
  
  // Limpieza total
  const context = this.page.context();
  await context.clearCookies();
  await this.page.goto('http://localhost:5173');
  await this.page.evaluate(() => localStorage.clear());
});
After(async function ({ pickle, result }) {
  // If scenario failed, save screenshots
  if (result?.status === 'FAILED' && this.page) {
    try {
      const screenshotDir = 'test-results/screenshots';
      await mkdir(screenshotDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = join(screenshotDir, `${scenarioName}_${timestamp}.png`);

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      console.log(`📸 Screenshot saved at: ${screenshotPath}`);

      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');

    } catch (error) {
      console.error('❌ Error taking screenshot:', error.message);
    }
  }

  // --- Clean up UI state before closing ---
  try {
    // Force-close any open modal to avoid state leaking
    const modalSelectors = [
      '[data-testid="create-professor-modal"]',
      '[data-testid="create-course-modal"]',
      '[data-testid="create-assignment-modal"]'
    ];

    for (const sel of modalSelectors) {
      const locator = this.page.locator(sel);
      if (await locator.isVisible({ timeout: 200 }).catch(() => false)) {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
      }
    }

    // Navigate to blank page before shutdown to clear client state
    await this.page.goto('about:blank', { timeout: 1000 }).catch(() => {});
  } catch (_) {}

  // Fully close browser after scenario
  await this.closeBrowser();
});
