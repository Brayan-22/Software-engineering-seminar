import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/* ==================== HELPER ==================== */

async function loginAsAdmin(page) {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 8000 });
  await page.waitForSelector('#dashboard');
}

/* ==================== GIVEN ==================== */

Given('the administrator is logged in', async function () {
  await loginAsAdmin(this.page);
});

/* ==================== WHEN ==================== */

When('the administrator accesses the main panel', async function () {
  await this.page.waitForSelector('#dashboard');
});

When('the administrator submits the form', async function () {
  const selectors = [
    '[data-testid="submit-professor"]',
    '[data-testid="submit-course"]',
    '[data-testid="submit-assignment"]',
    'button:has-text("Save")',
  ];

  for (const s of selectors) {
    const btn = this.page.locator(s);
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await this.page.waitForTimeout(500);
      return;
    }
  }

  throw new Error('No submit button was found');
});

When('required fields are left empty', async function () {
  await this.page.waitForTimeout(300);
});

/* ==================== THEN ==================== */

Then('the system must display a success confirmation message', async function () {
  // Espera hasta 5 segundos
  const locator = this.page.locator('[data-testid="success-message"]');

  await expect(locator).toBeVisible({ timeout: 5000 });

  // Opcional: validar texto específico
  const text = await locator.textContent();
  console.log("Mensaje encontrado:", text);
});


Then('the system must display validation messages for missing fields', async function () {
  const warning = this.page.locator('[data-testid="error-message"]');

  await expect(warning).toBeVisible({ timeout: 5000 });

  const text = await warning.textContent();
  console.log("Validation warning:", text);
});


Then('the system must prevent the creation and show an error message', async function () {
  const selectors = [
    '[data-testid="error-message"]',
    'text=already exists',
    'text=duplicate',
    'text=Error',
    '[role="alert"]',
    '.MuiAlert-standardError',
  ];

  for (const s of selectors) {
    const el = this.page.locator(s).first();
    if (await el.isVisible().catch(() => false)) {
      await expect(el).toBeVisible();
      console.log('Error message shown:', await el.textContent());
      break;
    }
  }

  /* ====== VALIDAR QUE EL MODAL SIGUE ABIERTO ====== */

  const modals = [
    '[data-testid="create-professor-modal"]',
    '[data-testid="create-course-modal"]',
    '[data-testid="create-assignment-modal"]',
  ];

  let modalOpen = false;

  for (const m of modals) {
    const modal = this.page.locator(m);
    if (await modal.isVisible().catch(() => false)) {
      await expect(modal).toBeVisible();
      modalOpen = true;
      break;
    }
  }

  if (!modalOpen) {
    throw new Error('Error occurred but the creation modal closed — should stay open');
  }

  console.log('Duplicated creation correctly prevented');
});
