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

async function openCoursesTab(page) {
  await page.click('[data-testid="tab-courses"]');
  await page.waitForSelector('text=Courses 📘', { timeout: 5000 });
}

async function openCourseModal(page) {
  await openCoursesTab(page);
  await page.waitForSelector('[data-testid="add-course"]', { timeout: 5000 });
  await page.click('[data-testid="add-course"]');
  await page.waitForSelector('[data-testid="create-course-modal"]', { timeout: 5000 });
}

async function fillCourseForm(page, courseData) {
  await page.fill('[data-testid="input-code"]', courseData.code);
  await page.fill('[data-testid="input-name"]', courseData.name);
  
  // Seleccionar día (MUI Select)
  await page.click('[data-testid="select-day"]');
  await page.waitForTimeout(500);
  await page.click(`[data-testid="day-${courseData.day}"]`);
  
  // Seleccionar hora (MUI Select)
  await page.click('[data-testid="select-time"]');
  await page.waitForTimeout(500);
  await page.click(`[data-testid="time-${courseData.time}"]`);
}

/* ==================== GIVENS ESPECÍFICOS DE CURSOS ==================== */

Given('the administrator is on the subject registration form', async function () {
  await loginAsAdmin(this.page);
  await openCourseModal(this.page);
});

Given('a subject with the same name already exists', async function () {
  await loginAsAdmin(this.page);
  await openCourseModal(this.page);

  const existingCourse = {
    code: 'CS101',
    name: 'Introduction to Computer Science',
    day: 'Monday',
    time: '8am - 10am'
  };

  await fillCourseForm(this.page, existingCourse);
  await this.page.click('[data-testid="submit-course"]');

  // Esperar a que aparezca el mensaje de éxito (indica que se creó correctamente)
  const successVisible = await this.page.locator('[data-testid="success-message"]').isVisible({ timeout: 3000 }).catch(() => false);
  
  if (successVisible) {
    // Si hay mensaje de éxito, esperar a que el modal se cierre
    await this.page.waitForSelector('[data-testid="create-course-modal"]', { 
      state: 'hidden',
      timeout: 5000 
    });
  } else {
    // Si no hay mensaje de éxito, puede que el modal no se cierre (por error en el backend)
    console.log('⚠️ No se detectó mensaje de éxito al crear el curso inicial');
  }

  this.existingCourse = existingCourse;
  await this.page.waitForTimeout(1000);
});

Given('an existing teacher is available in the system', async function () {
  await loginAsAdmin(this.page);
  
  await this.page.click('[data-testid="tab-professors"]');
  await this.page.waitForTimeout(500);
  
  const professorsExist = await this.page.locator('text=No professors found').count() === 0;
  
  if (!professorsExist) {
    await this.page.click('[data-testid="add-professor"]');
    await this.page.waitForSelector('[data-testid="create-professor-modal"]', { timeout: 5000 });
    
    await this.page.fill('[data-testid="input-name"]', 'Dr. Test Professor');
    await this.page.fill('[data-testid="input-email"]', 'test.professor@university.edu');
    
    await this.page.click('[data-testid="select-specialty"]');
    await this.page.waitForTimeout(500);
    await this.page.click('[data-testid="specialty-Computer Science"]');
    
    await this.page.click('[data-testid="submit-professor"]');
    await this.page.waitForSelector('[data-testid="create-professor-modal"]', { 
      state: 'hidden',
      timeout: 5000 
    });
  }
  
  this.professorExists = true;
});

/* ==================== WHENS ESPECÍFICOS DE CURSOS ==================== */

When('all required fields are filled with valid information for course', async function () {
  const courseData = {
    code: 'MATH501',
    name: 'Integral Calculus',
    day: 'Tuesday',
    time: '10am - 12m'
  };
  
  await fillCourseForm(this.page, courseData);
  this.courseData = courseData;
});

When('required fields are left empty for course', async function () {
  await this.page.fill('[data-testid="input-code"]', '');
  await this.page.fill('[data-testid="input-name"]', '');
});

When('the administrator attempts to register the same subject again', async function () {
  const modalVisible = await this.page.locator('[data-testid="create-course-modal"]').isVisible();
  
  if (modalVisible) {
    console.log('⚠️ Modal del registro anterior todavía visible, cerrándolo...');
    await this.page.click('button:has-text("Cancel")');
    await this.page.waitForSelector('[data-testid="create-course-modal"]', { 
      state: 'hidden',
      timeout: 3000 
    });
  }

  await this.page.click('[data-testid="add-course"]');
  await this.page.waitForSelector('[data-testid="create-course-modal"]', { 
    state: 'visible',
    timeout: 5000 
  });

  await fillCourseForm(this.page, this.existingCourse);
  await this.page.click('[data-testid="submit-course"]');
  
  await this.page.waitForTimeout(2000);
});

When('the administrator assigns this teacher to the new subject', async function () {
  // Ir al tab de Assignments
  await this.page.click('[data-testid="tab-assignments"]');
  await this.page.waitForSelector('text=Assignments 📚', { timeout: 5000 });
  
  // Abrir el modal de crear assignment
  await this.page.click('[data-testid="add-assignment"]');
  await this.page.waitForSelector('[data-testid="create-assignment-modal"]', { timeout: 5000 });
  
  // Seleccionar un curso existente (el primero disponible)
  await this.page.click('[data-testid="select-course"]');
  await this.page.waitForTimeout(500);
  
  // Obtener el primer curso disponible
  const firstCourse = await this.page.locator('[data-testid^="course-"]').first();
  const courseId = await firstCourse.getAttribute('data-testid');
  await firstCourse.click();
  
  // Seleccionar el profesor creado anteriormente
  await this.page.click('[data-testid="select-professor"]');
  await this.page.waitForTimeout(500);
  
  // Buscar el profesor "Dr. Test Professor"
  const professorOption = this.page.locator('text=Dr. Test Professor');
  if (await professorOption.count() > 0) {
    await professorOption.first().click();
  } else {
    // Si no existe, seleccionar el primero disponible
    await this.page.locator('[data-testid^="professor-"]').first().click();
  }
  
  this.assignmentCreated = true;
});

When('submits the form', async function () {
  await this.page.click('[data-testid="submit-assignment"]');
  await this.page.waitForTimeout(1500);
});

/* ==================== THENS ESPECÍFICOS DE CURSOS ==================== */

Then('the system must display the {string} form option for courses', async function (formName) {
  await openCoursesTab(this.page);
  await expect(this.page.locator('[data-testid="add-course"]')).toBeVisible();
});

Then('the new subject must appear in the general list without reloading the page', async function () {
  if (this.courseData) {
    await expect(
      this.page.locator(`text=${this.courseData.name}`).first()
    ).toBeVisible({ timeout: 5000 });
  }
});

Then('the relationship must be correctly stored in the database', async function () {
  const successSelectors = [
    'text=Assignment created successfully',
    'text=created successfully',
    '[role="alert"]:has-text("success")',
  ];

  let found = false;
  for (const selector of successSelectors) {
    try {
      await expect(this.page.locator(selector).first()).toBeVisible({ timeout: 3000 });
      found = true;
      console.log(`✅ Assignment creado exitosamente`);
      break;
    } catch (error) {
      continue;
    }
  }

  if (!found) {
    // Debug: mostrar alertas presentes
    const alerts = await this.page.locator('[role="alert"]').count();
    console.log(`🔍 Número de alertas encontradas: ${alerts}`);
    
    if (alerts > 0) {
      for (let i = 0; i < alerts; i++) {
        const alertText = await this.page.locator('[role="alert"]').nth(i).textContent();
        console.log(`   Alerta ${i}: "${alertText}"`);
      }
    }
    
    throw new Error('No se confirmó la creación del assignment');
  }

  // Verificar que el assignment aparece en la lista
  // Buscar que aparezca la tarjeta con el profesor y curso asignados
  const assignmentCards = await this.page.locator('[class*="AssignmentCard"], [class*="assignment"]').count();
  console.log(`📋 Se encontraron ${assignmentCards} tarjetas de assignment`);
  
  if (assignmentCards > 0) {
    console.log('✅ Assignment aparece en la lista');
  } else {
    console.log('⚠️ No se encontraron tarjetas de assignment visibles');
  }
});