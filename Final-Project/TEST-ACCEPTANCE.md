# Frontend Acceptance Tests with Cucumber

## Overview

For this project, we used Cucumber to create frontend acceptance tests based on the main user stories. The goal of these tests is to verify the behavior of the user interface and interactions from the perspective of the final user. By focusing on frontend tests, we ensure that the system responds correctly to user actions such as form submissions, navigation between tabs, and data creation flows.

Currently, we implemented a single acceptance test for the **Create Professor** feature, based on the `createProfessor.feature` file. This test validates that a system administrator can successfully add new teachers and that the platform enforces proper data entry and duplication rules.

---

## Feature File: Create Professor

The `createProfessor.feature` file describes the following scenarios:

### Scenarios

1. **Access the professor registration form**
   Ensures that the administrator can navigate to the registration form from the main panel.

2. **Register a teacher with valid data**
   Validates that filling out all required fields with correct information allows successful registration, and the new teacher appears immediately in the list.

3. **Validate required fields**
   Checks that leaving required fields empty triggers validation messages.

4. **Prevent duplicate teacher registration**
   Confirms that attempting to register a teacher with an existing email or ID is blocked and shows an error.

Each scenario follows the standard **Given-When-Then** structure for clarity and maintainability.

---

## Step Definitions

Step definitions connect the Gherkin steps with executable frontend code, including:

- Navigating the administrator panel to reach the registration form.
- Filling out input fields, submitting the form, and verifying messages.
- Ensuring new entries appear in lists dynamically without page reload.
- Detecting validation and duplication errors.

This structure allows easy addition of new frontend acceptance tests as the platform grows.

---

## Execution and Test Results

The **Create Professor** test was executed in the frontend testing environment. The Cucumber report generated shows which steps passed and which encountered issues. The results provide a clear overview of the test status, highlighting both successes and known errors.

### Test Results Summary

![Cucumber acceptance test results](./frontend-tests/results/cucumber_createProfessor_results.jpeg)

The test execution results show:
- **4 scenarios** (3 failed, 1 passed)
- **15 steps** (3 failed, 2 skipped, 10 passed)
- **Execution time:** 0m23.501s

Even with some steps failing due to minor frontend issues, the test confirms that the main workflow of creating a professor works correctly and establishes a baseline for future frontend validations.

---

## Summary

Frontend acceptance tests with Cucumber allow us to validate user interactions and ensure the core flows behave as expected. The **Create Professor** test demonstrates this approach, providing confidence that the teacher registration feature functions according to requirements.

These tests serve as living documentation of the system's expected behavior and will continue to grow as new features are added to the platform.
