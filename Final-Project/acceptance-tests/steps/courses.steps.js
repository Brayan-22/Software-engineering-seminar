import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/* ==================== HELPERS ==================== */

async function loginAsAdmin(page) {
  // Navigates to login page and logs in as administrator
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForSelector('#dashboard', { timeout: 10000 });
}

async function openCoursesTab(page) {
  // Open the Courses tab in the dashboard
  await page.click('[data-testid="tab-courses"]');
  await page.waitForSelector('text=Courses 📘', { timeout: 5000 });
}

async function openCourseModal(page) {
  // Open modal to create a new course
  await openCoursesTab(page);
  await page.waitForSelector('[data-testid="add-course"]', { timeout: 5000 });
  await page.click('[data-testid="add-course"]');
  await page.waitForSelector('[data-testid="create-course-modal"]', { timeout: 5000 });
}

async function fillCourseForm(page, courseData) {
  // Fill the course form fields
  await page.fill('[data-testid="input-code"]', courseData.code);
  await page.fill('[data-testid="input-name"]', courseData.name);
  
  // Select day from MUI Select
  await page.click('[data-testid="select-day"]');
  await page.waitForTimeout(500);
  await page.click(`[data-testid="day-${courseData.day}"]`);
  
  // Select time from MUI Select
  await page.click('[data-testid="select-time"]');
  await page.waitForTimeout(500);
  await page.click(`[data-testid="time-${courseData.time}"]`);
}

/* ==================== COURSE-SPECIFIC GIVENS ==================== */

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

  // Wait for success message, which confirms successful creation
  const successVisible = await this.page
    .locator('[data-testid="success-message"]')
    .isVisible({ timeout: 3000 })
    .catch(() => false);
  
  if (successVisible) {
    // If success message exists, wait for modal to close completely
    await this.page.waitForSelector('[data-testid="create-course-modal"]', { 
      state: 'hidden',
      timeout: 5000 
    });
  } else {
    // If no success message appears, backend may have failed
    console.log('⚠️ Success message not detected during initial course creation');
  }

  this.existingCourse = existingCourse;
  await this.page.waitForTimeout(1000); // Prevents timing issues
});

Given('an existing teacher is available in the system', async function () {
  await loginAsAdmin(this.page);
  
  await this.page.click('[data-testid="tab-professors"]');
  await this.page.waitForTimeout(500);

  // Check if there are already professors
  const professorsExist = await this.page.locator('text=No professors found').count() === 0;
  
  if (!professorsExist) {
    // Create a professor if none exists
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

/* ==================== COURSE-SPECIFIC WHENS ==================== */

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
  // Intentionally clear required fields
  await this.page.fill('[data-testid="input-code"]', '');
  await this.page.fill('[data-testid="input-name"]', '');
});

When('the administrator attempts to register the same subject again', async function () {
  const modalVisible = await this.page.locator('[data-testid="create-course-modal"]').isVisible();
  
  if (modalVisible) {
    // Close previous modal if still open
    console.log('⚠️ Previous modal still visible, closing...');
    await this.page.click('button:has-text("Cancel")');
    await this.page.waitForSelector('[data-testid="create-course-modal"]', { 
      state: 'hidden',
      timeout: 3000 
    });
  }

  // Reopen modal and try to submit duplicate course
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
  // Opens assignments tab
  await this.page.click('[data-testid="tab-assignments"]');
  await this.page.waitForSelector('text=Assignments 📚', { timeout: 5000 });
  
  // Opens assignment creation modal
  await this.page.click('[data-testid="add-assignment"]');
  await this.page.waitForSelector('[data-testid="create-assignment-modal"]', { timeout: 5000 });
  
  // Select the first available course
  await this.page.click('[data-testid="select-course"]');
  await this.page.waitForTimeout(500);

  const firstCourse = await this.page.locator('[data-testid^="course-"]').first();
  await firstCourse.click();
  
  // Select the professor (preferably our test professor)
  await this.page.click('[data-testid="select-professor"]');
  await this.page.waitForTimeout(500);
  
  const professorOption = this.page.locator('text=Dr. Test Professor');
  if (await professorOption.count() > 0) {
    await professorOption.first().click();
  } else {
    // Fallback: select the first available professor
    await this.page.locator('[data-testid^="professor-"]').first().click();
  }
  
  this.assignmentCreated = true;
});

When('submits the form', async function () {
  await this.page.click('[data-testid="submit-assignment"]');
  await this.page.waitForTimeout(1500); // Prevents premature queries
});

/* ==================== COURSE-SPECIFIC THENS ==================== */

Then('the system must display the {string} form option for courses', async function (formName) {
  await openCoursesTab(this.page);
  await expect(this.page.locator('[data-testid="add-course"]')).toBeVisible();
});

Then('the new subject must appear in the general list without reloading the page', async function () {
  if (this.courseData) {
    // Ensure the new subject appears dynamically without page reload
    await expect(
      this.page.locator(`text=${this.courseData.name}`).first()
    ).toBeVisible({ timeout: 5000 });
  }
});

Then('the relationship must be correctly stored in the database', async function () {
  // Check for any success message that indicates assignment creation
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
      console.log(`✅ Assignment created successfully`);
      break;
    } catch (error) {
      continue;
    }
  }

  if (!found) {
    // Debug: print existing alert messages
    const alerts = await this.page.locator('[role="alert"]').count();
    console.log(`🔍 Number of alerts found: ${alerts}`);
    
    if (alerts > 0) {
      for (let i = 0; i < alerts; i++) {
        const alertText = await this.page.locator('[role="alert"]').nth(i).textContent();
        console.log(`   Alert ${i}: "${alertText}"`);
      }
    }
    
    throw new Error('Assignment creation could not be confirmed');
  }

  // Verify assignment card is displayed
  const assignmentCards = await this.page.locator('[class*="AssignmentCard"], [class*="assignment"]').count();
  console.log(`📋 Found ${assignmentCards} assignment cards`);

  if (assignmentCards > 0) {
    console.log('✅ Assignment appears in the list');
  } else {
    console.log('⚠️ No assignment cards visible');
  }
});
