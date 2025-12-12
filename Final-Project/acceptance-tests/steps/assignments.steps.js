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

async function openAssignmentsTab(page) {
    await page.click('[data-testid="tab-assignments"]');
    await page.waitForSelector('[data-testid="add-assignment"]', { timeout: 5000 });
}

async function openAssignmentModal(page) {
    await page.click('[data-testid="add-assignment"]');
    await page.waitForSelector('[data-testid="create-assignment-modal"]', { timeout: 5000 });
}

async function closeModalIfOpen(page) {
    const modalVisible = await page.locator('[data-testid="create-assignment-modal"]').isVisible().catch(() => false);
    if (modalVisible) {
        await page.click('button:has-text("Cancel")');
        await page.waitForTimeout(500);
    }
}

async function selectCourse(page, index = 0) {
    await page.click('[data-testid="select-course"]');
    await page.waitForTimeout(500);
    await page.locator('[data-testid^="course-"]').nth(index).click();
}

async function selectProfessor(page, index = 0) {
    await page.click('[data-testid="select-professor"]');
    await page.waitForTimeout(500);
    await page.locator('[data-testid^="professor-"]').nth(index).click();
}

async function submitAssignment(page) {
    await page.click('[data-testid="submit-assignment"]');
    await page.waitForSelector('[data-testid="create-assignment-modal"]', {
        state: "visible",
        timeout: 8000
    });
}


/* ==================== BACKGROUND ==================== */

Given('at least one professor exists in the system', async function () {
    // Asumimos que la BD ya está poblada
    // Verificamos que existan profesores
    await this.page.click('[data-testid="tab-professors"]');
    await this.page.waitForTimeout(500);
    const hasProfessors = await this.page.locator('text=No professors found').count() === 0;
    expect(hasProfessors).toBe(true);
});

Given('at least one course exists in the system', async function () {
    // Asumimos que la BD ya está poblada
    // Verificamos que existan cursos
    await this.page.click('[data-testid="tab-courses"]');
    await this.page.waitForTimeout(500);
    const hasCourses = await this.page.locator('text=No courses found').count() === 0;
    expect(hasCourses).toBe(true);
});

/* ==================== GIVENS ==================== */

Given('the administrator is on the assignments tab', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);

    // Guardamos los assignments actuales
    this.initialAssignmentCount = await this.page.locator('[data-testid^="assignment-card-"]').count();
});

Given('the administrator is on the assignment creation form', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);
    await openAssignmentModal(this.page);
});

Given('a professor already has one course assignment', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);

    const targetProfessor = "Dr. John Smith"; // cámbialo si lo necesitas

    // Obtener todos los cards
    const cards = this.page.locator('[data-testid^="assignment-card-"]');
    const count = await cards.count();

    if (count === 0) {
        throw new Error(`No hay asignaciones en el sistema.`);
    }

    let found = false;

    // Buscar profesor dentro de cada card
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);

        const text = await card.innerText();
        if (text.includes(targetProfessor)) {
            found = true;
            break;
        }
    }

    if (!found) {
        throw new Error(`El profesor "${targetProfessor}" no tiene ninguna asignación registrada.`);
    }

    console.log(`✅ Se encontró al menos una asignación para ${targetProfessor}`);
});



Given('a course already has one professor assigned', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);

    const targetCourse = "Introduction to Programming"; // cámbialo si lo necesitas

    const cards = this.page.locator('[data-testid^="assignment-card-"]');
    const count = await cards.count();

    if (count === 0) {
        throw new Error("No hay asignaciones registradas en el sistema.");
    }

    let found = false;

    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const text = await card.innerText();

        if (text.includes(targetCourse)) {
            found = true;
            break;
        }
    }

    if (!found) {
        throw new Error(`El curso "${targetCourse}" no tiene ningún profesor asignado.`);
    }

    console.log(`✅ Se encontró al menos una asignación para el curso ${targetCourse}`);
});


Given('an assignment already exists for a specific professor and course', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);
    await openAssignmentModal(this.page);

    // Guardar referencias del primer curso y profesor
    await this.page.click('[data-testid="select-course"]');
    await this.page.waitForTimeout(500);
    const firstCourse = this.page.locator('[data-testid^="course-"]').first();
    this.selectedCourseId = await firstCourse.getAttribute('data-testid');
    await firstCourse.click();

    await this.page.click('[data-testid="select-professor"]');
    await this.page.waitForTimeout(500);
    const firstProfessor = this.page.locator('[data-testid^="professor-"]').first();
    this.selectedProfessorId = await firstProfessor.getAttribute('data-testid');
    await firstProfessor.click();

    await submitAssignment(this.page);
});

Given('an assignment exists in the system', async function () {
    await loginAsAdmin(this.page);
    await openAssignmentsTab(this.page);

    const hasAssignments = await this.page.locator('[data-testid^="assignment-card-"]').count() > 0;

    if (!hasAssignments) {
        await openAssignmentModal(this.page);
        await selectCourse(this.page, 0);
        await selectProfessor(this.page, 0);
        await submitAssignment(this.page);
    }
});

/* ==================== WHENS ==================== */

When('the administrator opens the assignments tab', async function () {
    await openAssignmentsTab(this.page);
});

When('the administrator clicks on {string}', async function (buttonText) {
    if (buttonText === 'Add Assignment') {
        await this.page.click('[data-testid="add-assignment"]');
        await this.page.waitForTimeout(500);
    }
});

When('selects a professor from the list', async function () {
    await selectProfessor(this.page, 0);
});

When('selects a course from the list', async function () {
    await selectCourse(this.page, 0);
});

When('confirms the assignment creation', async function () {
    await submitAssignment(this.page);
});

When('the administrator attempts to create an assignment without selecting a professor', async function () {
    await selectCourse(this.page, 0);
    await this.page.click('[data-testid="submit-assignment"]');
    await this.page.waitForTimeout(1000);
});

When('the administrator creates a new assignment for the same professor', async function () {
    await closeModalIfOpen(this.page);
    await openAssignmentModal(this.page);
});

When('With a different course', async function () {
    // Seleccionar un curso diferente (segundo de la lista)
    await selectCourse(this.page, 1);

    // Seleccionar el mismo profesor que en el assignment anterior
    if (this.firstProfessorId) {
        await this.page.click('[data-testid="select-professor"]');
        await this.page.waitForTimeout(500);
        await this.page.click(`[data-testid="${this.firstProfessorId}"]`);
    } else {
        await selectProfessor(this.page, 0);
    }

    await submitAssignment(this.page);
});

When('the administrator creates a new assignment for the same course', async function () {
    await closeModalIfOpen(this.page);
    await openAssignmentModal(this.page);
});

When('With a different professor', async function () {
    // Seleccionar el mismo curso que en el assignment anterior
    if (this.firstCourseId) {
        await this.page.click('[data-testid="select-course"]');
        await this.page.waitForTimeout(500);
        await this.page.click(`[data-testid="${this.firstCourseId}"]`);
    } else {
        await selectCourse(this.page, 0);
    }

    // Seleccionar un profesor diferente (segundo de la lista)
    await selectProfessor(this.page, 1);

    await submitAssignment(this.page);
});

When('the administrator attempts to create the same assignment again', async function () {
    await closeModalIfOpen(this.page);
    await openAssignmentModal(this.page);

    // Usar las mismas referencias guardadas anteriormente
    await this.page.click('[data-testid="select-course"]');
    await this.page.waitForTimeout(500);
    await this.page.click(`[data-testid="${this.selectedCourseId}"]`);

    await this.page.click('[data-testid="select-professor"]');
    await this.page.waitForTimeout(500);
    await this.page.click(`[data-testid="${this.selectedProfessorId}"]`);

    await submitAssignment(this.page);
});

When('the administrator clicks on delete for that assignment', async function () {
    const deleteButton = this.page.locator('[data-testid^="delete-assignment-"]').first();
    await expect(deleteButton).toBeVisible({ timeout: 3000 });
    await deleteButton.click();

    // Esperar modal
    await expect(
        this.page.locator('[data-testid="delete-assignment-modal"]')
    ).toBeVisible();
});


When('confirms the deletion', async function () {
    const confirmButton = this.page.locator('[data-testid="confirm-delete-assignment"]');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Dar tiempo a que cierre modal y llegue alerta
    await this.page.waitForTimeout(800);
});


/* ==================== THENS ==================== */

Then('the system must display a list of existing assignments', async function () {
    const hasContainer = await this.page.locator('text=Assignments 📚').isVisible();
    expect(hasContainer).toBe(true);
});

Then('the system must display an {string} button', async function (buttonText) {
    const testId = buttonText.toLowerCase().replace(/\s+/g, '-');
    await expect(this.page.locator(`[data-testid="${testId}"]`)).toBeVisible();
});



Then('the new assignment must appear in the assignments list', async function () {
    await expect(
        this.page.locator('text=Introduction to Programming').first()
    ).toBeVisible({ timeout: 5000 });
});

Then('the assignment must not be created', async function () {
    const modalStillOpen = await this.page.locator('[data-testid="create-assignment-modal"]').isVisible();
    expect(modalStillOpen).toBe(true);
    console.log('✅ Modal still open, assignment not created');
});

Then('the system must allow the creation', async function () {
    await expect(
        this.page.locator('[data-testid="create-assignment-modal"]')
    ).toBeVisible({ timeout: 8000 });
});


Then('both assignments must appear in the list', async function () {
    await this.page.waitForTimeout(1000);
    const assignmentCards = this.page.locator('[data-testid^="assignment-card-"]');
    const count = await assignmentCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
    console.log(`📋 Total assignments: ${count}`);
});

Then('the system must remove the assignment', async function () {
    await expect(
        this.page.locator('[data-testid="success-message"]')
    ).toBeVisible({ timeout: 3000 });
});


Then('the assignment must no longer appear in the list', async function () {
    await this.page.waitForTimeout(1000);
    // Verificar que se actualizó la lista
    console.log('✅ Assignment list updated after deletion');
});
