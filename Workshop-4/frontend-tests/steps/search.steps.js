import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

/* ==================== HELPERS ==================== */

// Navigates to the home/search page
async function goToHome(page) {
    await page.goto("http://localhost:5173/");
    await page.waitForSelector('[data-testid="search-input"]');
}

// Performs a search by filling the input and clicking the button
async function search(page, text) {
    await page.fill('[data-testid="search-input"]', text);
    await page.click('[data-testid="search-button"]');
    await page.waitForTimeout(500); // Small delay to allow UI update
}

/* ==================== SCENARIOS ==================== */

Given("the user is on the search page", async function () {
    await goToHome(this.page);
});

When("the user enters a professor's name", async function () {
    const professorName = "Dr. John Smith";
    this.searchQuery = professorName;
    await search(this.page, professorName);
});

Then("the system must display all courses taught by that professor", async function () {
    const pageText = await this.page.innerText("body");

    // The professor name must appear at least twice:
    // 1) Inside the search input
    // 2) Inside at least one result card
    const occurrences = pageText.split(this.searchQuery).length - 1;

    expect(occurrences).toBeGreaterThanOrEqual(2);
});


When("the user enters one course name", async function () {
    const courseName = "Introduction to Programming";
    this.searchQuery = courseName;
    await search(this.page, courseName);
});

Then("the system must display all professors assigned to those courses", async function () {
    const cards = this.page.locator('[data-testid^="assignment-card-"]');
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);

    // Every visible card should match the searched course name
    for (let i = 0; i < count; i++) {
        const text = await cards.nth(i).innerText();
        expect(text).toContain(this.searchQuery);
    }
});


Given("the user types an incomplete or lowercase search term", async function () {
    await goToHome(this.page);

    this.partialQuery = "smith"; // lowercase partial example
    await search(this.page, this.partialQuery);
});

When("the system processes the query", async function () {
    // Search already executed above
});

Then("the results must still match relevant professors or courses", async function () {
    //if assignment cards exist, at least one must contain the substring
    const results = this.page.locator('[data-testid^="assignment-card-"]');
    const resCount = await results.count();

    if (resCount > 0) {
        let found = false;
        for (let i = 0; i < resCount; i++) {
            const text = await results.nth(i).innerText();
            if (text.toLowerCase().includes(this.partialQuery.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    }
});


Given("the user enters a search term with no matches", async function () {
    await goToHome(this.page);

    this.query = "thisshouldhavenomatches123!!";
    await search(this.page, this.query);
});

When("the search is submitted", async function () {
    // Already handled in the Given step
});

Then('the system must display a friendly “No results found” message', async function () {
    await expect(this.page.locator('[data-testid="no-results"]')).toBeVisible();
});
