import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/* ==================== HELPERS ==================== */

async function loginAsAdmin(page) {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForSelector('#dashboard', { timeout: 10000 });
}

async function openProfessorModal(page) {
  await page.click('[data-testid="tab-professors"]');
  await page.waitForSelector('[data-testid="add-professor"]', { timeout: 10000 });
  await page.click('[data-testid="add-professor"]');
  await page.waitForSelector('[data-testid="create-professor-modal"]', { timeout: 10000 });
}

/* ==================== GIVENS ESPECÍFICOS DE PROFESORES ==================== */

Given('the administrator is on the professor registration form', async function () {
  await loginAsAdmin(this.page);
  await openProfessorModal(this.page);
});

Given('a teacher with the same email or ID already exists', async function () {
  await loginAsAdmin(this.page);
  await openProfessorModal(this.page);

  // Crear profesor "existente"
  await this.page.fill('[data-testid="input-name"]', 'Dr. John Smith');
  await this.page.fill('[data-testid="input-email"]', 'john.smith@university.edu');

  const specialtySelector = '[data-testid="select-specialty"]';
  await this.page.click(specialtySelector);
  await this.page.waitForTimeout(500);
  await this.page.click('[data-testid="specialty-Computer Science"]');

  await this.page.click('[data-testid="submit-professor"]');

  // CRÍTICO: Esperar a que el modal se cierre completamente
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
    state: 'visible',
    timeout: 5000 
  });

  await this.page.waitForTimeout(1000);
});

/* ==================== WHENS ESPECÍFICOS DE PROFESORES ==================== */

When('all required fields are filled with valid information for professor', async function () {
  await this.page.fill('[data-testid="input-name"]', 'John Doe');
  await this.page.fill('[data-testid="input-email"]', 'john.doe@example.com');

  const specialtySelector = '[data-testid="select-specialty"]';
  await this.page.click(specialtySelector);
  await this.page.waitForTimeout(500);
  await this.page.click('[data-testid="specialty-Computer Science"]');
});

When('required fields are left empty for professor', async function () {
  await this.page.fill('[data-testid="input-name"]', '');
  await this.page.fill('[data-testid="input-email"]', '');
});

When('the administrator attempts to register the same teacher again', async function () {
  const modalVisible = await this.page.locator('[data-testid="create-professor-modal"]').isVisible();
  
  if (modalVisible) {
    console.log('⚠️ Modal del registro anterior todavía visible, cerrándolo...');
    await this.page.click('button:has-text("Cancel")');
    await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
      state: 'hidden',
      timeout: 3000 
    });
  }

  await this.page.click('[data-testid="add-professor"]');
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
    state: 'visible',
    timeout: 10000 
  });

  await this.page.fill('[data-testid="input-name"]', 'Dr. John Smith');
  await this.page.fill('[data-testid="input-email"]', 'john.smith@university.edu');

  const specialtySelector = '[data-testid="select-specialty"]';
  await this.page.click(specialtySelector);
  await this.page.waitForTimeout(500);
  await this.page.click('[data-testid="specialty-Computer Science"]');

  await this.page.click('[data-testid="submit-professor"]');
  await this.page.waitForTimeout(2000);
});

/* ==================== THENS ESPECÍFICOS DE PROFESORES ==================== */

Then('the system must display the {string} form option for professors', async function (formName) {
  await this.page.click('[data-testid="tab-professors"]');
  await expect(this.page.locator('[data-testid="add-professor"]')).toBeVisible();
});

Then('the new teacher must appear in the general list without reloading the page', async function () {
  await expect(
    this.page.locator('text=John Doe').first()
  ).toBeVisible({ timeout: 5000 });
});