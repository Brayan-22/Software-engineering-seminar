import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
//setDefaultTimeout(30 * 1000); // 30 segundos
/* -------------------- GIVENS -------------------- */

Given('the administrator is logged in', async function () {
  await this.page.goto('http://localhost:5173/login');

  await this.page.fill('input[name="username"]', 'admin');
  await this.page.fill('input[name="password"]', 'admin123');

  await this.page.click('button[type="submit"]');

  // Espera a que cargue el dashboard y exista el contenedor principal
  await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  await this.page.waitForSelector('#dashboard', { timeout: 10000 });
});

Given('the administrator is on the professor registration form', async function () {
  //await this.page.goto('http://localhost:5173/dashboard');

  await this.page.goto('http://localhost:5173/login');

  await this.page.fill('input[name="username"]', 'admin');
  await this.page.fill('input[name="password"]', 'admin123');

  await this.page.click('button[type="submit"]');

  // Espera a que cargue el dashboard y exista el contenedor principal
  await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  await this.page.waitForSelector('#dashboard', { timeout: 10000 });

  // Selecciona el tab de profesores y espera a que aparezca el botón Add
  await this.page.click('[data-testid="tab-professors"]');
  await this.page.waitForSelector('[data-testid="add-professor"]', { timeout: 10000 });

  // Abre el modal de creación y espera a que sea visible
  await this.page.click('[data-testid="add-professor"]');
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { timeout: 10000 });
});

Given('a teacher with the same email or ID already exists', async function () {
  //await this.page.goto('http://localhost:5173/dashboard');

  await this.page.goto('http://localhost:5173/login');

  await this.page.fill('input[name="username"]', 'admin');
  await this.page.fill('input[name="password"]', 'admin123');

  await this.page.click('button[type="submit"]');
  //_-------------
  await this.page.click('[data-testid="tab-professors"]');
  await this.page.waitForSelector('[data-testid="add-professor"]', { timeout: 10000 });

  await this.page.click('[data-testid="add-professor"]');
  await this.page.waitForSelector('[data-testid="create-professor-modal"]', { timeout: 10000 });

  // Crear profesor "existente"
  await this.page.fill('[data-testid="input-name"]', 'Existing Teacher');
  await this.page.fill('[data-testid="input-email"]', 'existing@test.com');
  await this.page.selectOption('[data-testid="select-specialty"]', 'Mathematics');

  await this.page.click('[data-testid="submit-professor"]');

  // Confirmar que aparece en la lista
  await this.page.waitForSelector('text=Existing Teacher', { timeout: 10000 });
});


/* -------------------- WHENS -------------------- */

When('the administrator accesses the main panel', async function () {
  await this.page.goto('http://localhost:5173/dashboard');
});

When('all required fields are filled with valid information', async function () {
  await this.page.fill('[data-testid="input-name"]', 'John Doe');
  await this.page.fill('[data-testid="input-email"]', 'john@example.com');

  // Selección de specialty en MUI
  await this.page.click('[data-testid="select-specialty"]');
  await this.page.click('[data-testid="specialty-Computer Science"]');

  await this.page.click('[data-testid="submit-professor"]');
});


When('the administrator submits the form', async function () {
  await this.page.click('[data-testid="submit-professor"]');
});

When('required fields are left empty', async function () {
  // Dejamos todo vacío a propósito.
  await this.page.fill('[data-testid="input-name"]', '');
  await this.page.fill('[data-testid="input-email"]', '');
  // specialty queda vacío por defecto
});

When('the administrator attempts to register the same teacher again', async function () {
  // Abrimos modal de nuevo
  await this.page.click('[data-testid="add-professor"]');

  // Apunta al input real dentro del TextField
  await this.page.fill('[data-testid="input-name"]', 'Dr. John Smith');
  await this.page.fill('[data-testid="input-email"]', 'john.smith@university.edu');
  await this.page.selectOption('[data-testid="select-specialty"]', 'Computer Science');

  await this.page.click('[data-testid="submit-professor"]');
});


/* -------------------- THENS -------------------- */

Then('the system must display the {string} form option', async function (formName) {
  await this.page.click('[data-testid="tab-professors"]');
  await expect(this.page.locator('[data-testid="add-professor"]')).toBeVisible();
});


Then('the system must display a success confirmation message', async function () {
  // Si tu toast tiene data-testid te lo ajusto.
  // Por ahora este test detecta la aparición del nuevo profesor.
  await expect(this.page.locator('text=Professor created successfully')).toBeVisible();
});

Then('the new teacher must appear in the general list without reloading the page', async function () {
  await expect(this.page.locator('text=John Doe')).toBeVisible();
});

Then('the system must display validation messages for missing fields', async function () {
  await expect(this.page.locator('[data-testid="error-name"]')).toContainText('required');
  await expect(this.page.locator('[data-testid="error-email"]')).toContainText('required');
  await expect(this.page.locator('[data-testid="error-specialty"]')).toContainText('select');
});

Then('the system must prevent the registration and show an error message', async function () {
  // Si tu backend manda un error visible por AlertContext,
  // ajústame el testid y lo cambio.
  await expect(this.page.locator('text=Error creating professor')).toBeVisible();
});
