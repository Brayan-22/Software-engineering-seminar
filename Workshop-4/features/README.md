# CourseFinder – Acceptance Test Features (BDD)

This folder contains the **Gherkin feature files** used to define the acceptance
criteria for the CourseFinder platform.  
These files represent the system behavior from the user’s perspective and are
shared across the **Frontend**, **Java Backend**, and **Python Backend** test suites.

The goal is to maintain a single source of truth for business rules and expected
system outcomes.

---

## 📁 Included Feature Files

| File | Description |
|------|-------------|
| `US_CourseFinder_01.feature` | Register new teachers |
| `US_CourseFinder_02.feature` | Register new subjects |
| `US_CourseFinder_03.feature` | Link a professor to one or multiple courses |
| `US_CourseFinder_04.feature` | Search courses by professor and professors by course |

These files were written based on the user stories and acceptance criteria from **Workshop 4**.

---

## 📌 How These Features Are Used

All modules (frontend and both backends) read the **same feature files**, but each
implements its own **step definitions** depending on the technology.

### ✔️ Frontend (JavaScript – CucumberJS + Playwright)
- Steps interact with the UI (DOM, navigation, forms).
- Typical actions: filling fields, clicking buttons, checking rendered results.

### ✔️ Backend Java (Cucumber-JVM + REST Assured)
- Steps interact with the REST API.
- Used for creating entities, verifying validation rules, checking responses.

### ✔️ Backend Python (Behave + Requests/FastAPI TestClient)
- Same feature file; step definitions written in Python.
- Useful for API validation and integration behavior.

---


