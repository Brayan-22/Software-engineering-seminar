import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/* ==================== HELPERS ==================== */

// Logs in as admin and waits until the dashboard is fully loaded
async function loginAsAdmin(page) {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForSelector('#dashboard', { timeout: 10000 });
}

// Opens the professor creation modal from the dashboard
async function openProfessorModal(page) {
  await page.click('[data-testid="tab-professors"]');
  await page.waitForSelector('[data-testid="add-professor"]', { timeout: 10000 });
  await page.click('[data-testid="add-professor"]');
  await page.waitForSelector('[data-testid="create-professor-modal"]', { timeout: 10000 });
}

/* ==================== PROFESSOR-SPECIFIC GIVENS ==================== */

Given('the administrator is on the professor registration form', async function () {
  await loginAsAdmin(this.page);
  await openProfessorModal(this.page);
});

Given('a teacher with the same email or ID already exists', async function () {
  await loginAsAdmin(this.page);
  await openProfessorModal(this.page);

  // Create an existing professor to later trigger validation
  await this.page.fill('[data-testid="input-name"]', 'Dr. John Smith');
  await this.page.fill('[data-testid="input-email"]', 'john.smith@university.edu');

  // Selects a specialty — required for submission
  const specialtySelector = '[data-testid="select-specialty"]';
  await this.page.click(specialtySelector);
  await this.page.waitForTimeout(500);
  await this.page.click('[data-testid="specialty-Computer Science"]');

  await this.page.click('[data-testid="submit-professor"]');

  // Critical: Ensures the modal remains visible while waiting for validation UI to update
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
    state: 'visible',
    timeout: 5000 
  });

  // Soft wait to allow backend response and DOM stabilization
  await this.page.waitForTimeout(1000);
});

/* ==================== PROFESSOR-SPECIFIC WHENS ==================== */

When('all required fields are filled with valid information for professor', async function () {
  await this.page.fill('[data-testid="input-name"]', 'John Doe');
  await this.page.fill('[data-testid="input-email"]', 'john.doe@example.com');

  // Selects a specialty before submitting
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
  
  // Ensures previous modal is not blocking the flow
  if (modalVisible) {
    console.log('⚠️ Previous registration modal still visible, closing it...');
    await this.page.click('button:has-text("Cancel")');
    await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
      state: 'hidden',
      timeout: 3000 
    });
  }

  // Opens a new registration modal
  await this.page.click('[data-testid="add-professor"]');
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
    state: 'visible',
    timeout: 10000 
  });

  // Attempts to register the same teacher again
  await this.page.fill('[data-testid="input-name"]', 'Dr. John Smith');
  await this.page.fill('[data-testid="input-email"]', 'john.smith@university.edu');

  const specialtySelector = '[data-testid="select-specialty"]';
  await this.page.click(specialtySelector);
  await this.page.waitForTimeout(500);
  await this.page.click('[data-testid="specialty-Computer Science"]');

  await this.page.click('[data-testid="submit-professor"]');
  await this.page.waitForTimeout(2000); // Gives time for validation message to show
});

/* ==================== PROFESSOR-SPECIFIC THENS ==================== */

Then('the system must display the {string} form option for professors', async function (formName) {
  // Ensures the tab is active and the button appears
  await this.page.click('[data-testid="tab-professors"]');
  await expect(this.page.locator('[data-testid="add-professor"]')).toBeVisible();
});

Then('the new teacher must appear in the general list without reloading the page', async function () {
  // Confirms immediate UI update after successful creation
  await expect(
    this.page.locator('text=John Doe').first()
  ).toBeVisible({ timeout: 5000 });
});
