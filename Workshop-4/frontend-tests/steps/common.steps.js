import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/* ==================== HELPER COMPARTIDO ==================== */

async function loginAsAdmin(page) {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForSelector('#dashboard', { timeout: 10000 });
}

/* ==================== STEPS COMPARTIDOS ==================== */

// GIVENS compartidos
Given('the administrator is logged in', async function () {
  await loginAsAdmin(this.page);
});

// WHENS compartidos
When('the administrator accesses the main panel', async function () {
  await this.page.waitForSelector('#dashboard', { timeout: 5000 });
});

When('the administrator submits the form', async function () {
  // Intentar encontrar el botón de submit en diferentes contextos
  const submitButtons = [
    '[data-testid="submit-professor"]',
    '[data-testid="submit-course"]',
    'button:has-text("Save")'
  ];

  for (const selector of submitButtons) {
    try {
      const button = this.page.locator(selector);
      if (await button.isVisible({ timeout: 1000 })) {
        await button.click();
        await this.page.waitForTimeout(1500);
        return;
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error('No se encontró ningún botón de submit');
});

When('required fields are left empty', async function () {
  // Este step es genérico - simplemente asegura que los campos estén vacíos
  // La validación específica se hará en los THEN steps
  await this.page.waitForTimeout(300);
});

// THENS compartidos
Then('the system must display a success confirmation message', async function () {
  const successSelectors = [
    'text=created successfully',
    'text=updated successfully',
    'text=Success',
    '[role="alert"]:has-text("success")',
    '.MuiAlert-standardSuccess',
    '[data-testid="success-message"]'
  ];

  let found = false;
  for (const selector of successSelectors) {
    try {
      await expect(this.page.locator(selector).first()).toBeVisible({ timeout: 3000 });
      found = true;
      console.log(`✅ Mensaje de éxito encontrado con selector: ${selector}`);
      break;
    } catch (error) {
      continue;
    }
  }

  if (!found) {
    const bodyHTML = await this.page.locator('body').innerHTML();
    console.log('🔍 HTML actual de la página:', bodyHTML.substring(0, 500));
    throw new Error('No se encontró ningún mensaje de éxito en la página');
  }
});

Then('the system must display validation messages for missing fields', async function () {
  await this.page.waitForTimeout(500);

  // Buscar mensajes de error de validación genéricos
  const errorSelectors = [
    'text=required',
    'text=Required',
    'text=Please select',
    '.Mui-error',
    '[class*="error"]',
    '.MuiFormHelperText-root.Mui-error'
  ];

  let errorCount = 0;
  for (const selector of errorSelectors) {
    const count = await this.page.locator(selector).count();
    errorCount += count;
  }

  if (errorCount === 0) {
    const formHTML = await this.page.locator('body').innerHTML();
    console.log('🔍 HTML del formulario:', formHTML.substring(0, 500));
    throw new Error('No se encontraron mensajes de validación en el formulario');
  }

  console.log(`✅ Se encontraron ${errorCount} mensajes de error`);
});

Then('the system must prevent the registration and show an error message', async function () {
  const errorSelectors = [
    'text=Error creating',
    'text=already exists',
    'text=duplicate',
    'text=error',
    '[role="alert"]',
    '.MuiAlert-standardError',
    '[data-testid="error-message"]',
    '.MuiAlert-message'
  ];

  let found = false;
  for (const selector of errorSelectors) {
    try {
      const locator = this.page.locator(selector).first();
      await expect(locator).toBeVisible({ timeout: 3000 });
      const text = await locator.textContent();
      console.log(`✅ Mensaje de error encontrado con selector: ${selector}`);
      console.log(`   Contenido: "${text}"`);
      found = true;
      break;
    } catch (error) {
      continue;
    }
  }

  if (!found) {
    const alerts = await this.page.locator('[role="alert"]').count();
    console.log(`🔍 Número de alertas encontradas: ${alerts}`);
    
    if (alerts > 0) {
      for (let i = 0; i < alerts; i++) {
        const alertText = await this.page.locator('[role="alert"]').nth(i).textContent();
        console.log(`   Alerta ${i}: "${alertText}"`);
      }
    }
    
    throw new Error('No se encontró mensaje de error para duplicado');
  }

  // Verificar que el modal sigue abierto (comportamiento correcto cuando hay error)
  const modalSelectors = [
    '[data-testid="create-professor-modal"]',
    '[data-testid="create-course-modal"]'
  ];

  let modalFound = false;
  for (const selector of modalSelectors) {
    try {
      const modalStillOpen = await this.page.locator(selector).isVisible();
      if (modalStillOpen) {
        console.log(`📋 Modal ${selector} aún abierto después del error: true`);
        await expect(this.page.locator(selector)).toBeVisible();
        modalFound = true;
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (modalFound) {
    console.log('✅ Test de duplicado completado correctamente');
  }
});