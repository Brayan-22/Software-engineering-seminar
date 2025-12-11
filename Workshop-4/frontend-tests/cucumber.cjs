module.exports = {
  // Default runner: all features together
  default: {
    require: [
      "support/world.js",
      "support/hooks.js",
      "steps/*.steps.js"
    ],
    format: [
      "progress",
      "json:reports/all/cucumber-report.json",
      "html:reports/all/cucumber-report.html"
    ],
    publishQuiet: true,
    paths: ["features/*.feature"]
  },

  // --- COURSES ---
  courses: {
    paths: ["features/courses.feature"],
    require: [
      "support/world.js",
      "support/hooks.js",
      "steps/common.steps.js",
      "steps/courses.steps.js"
    ],
    format: [
      "progress",
      "json:reports/courses/courses-report.json",
      "html:reports/courses/courses-report.html"
    ],
    publishQuiet: true
  },

  // --- PROFESSORS ---
  professors: {
    paths: ["features/professors.feature"],
    require: [
      "support/world.js",
      "support/hooks.js",
      "steps/common.steps.js",
      "steps/professors.steps.js"
    ],
    format: [
      "progress",
      "json:reports/professors/professors-report.json",
      "html:reports/professors/professors-report.html"
    ],
    publishQuiet: true
  },

  // --- ASSIGNMENTS ---
  assignments: {
    paths: ["features/assignments.feature"],
    require: [
      "support/world.js",
      "support/hooks.js",
      "steps/common.steps.js",
      "steps/assignments.steps.js"
    ],
    format: [
      "progress",
      "json:reports/assignments/assignments-report.json",
      "html:reports/assignments/assignments-report.html"
    ],
    publishQuiet: true
  },

  // --- SEARCH ---
  search: {
    paths: ["features/search.feature"],
    require: [
      "support/world.js",
      "support/hooks.js",
      "steps/search.steps.js"
    ],
    format: [
      "progress",
      "json:reports/search/search-report.json",
      "html:reports/search/search-report.html"
    ],
    publishQuiet: true
  }
};
