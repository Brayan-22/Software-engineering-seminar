Feature: Creation of new teachers
  As a system administrator
  I want to create new teachers by entering their personal and academic details
  So that the platform maintains an updated and accurate teacher database

  Scenario: Access the professor registration form
    Given the administrator is logged in
    When the administrator accesses the main panel
    Then the system must display the "Register Professor" form option

  Scenario: Register a teacher with valid data
    Given the administrator is on the professor registration form
    When all required fields are filled with valid information
    And the administrator submits the form
    Then the system must display a success confirmation message
    And the new teacher must appear in the general list without reloading the page

  Scenario: Validate required fields
    Given the administrator is on the professor registration form
    When required fields are left empty
    And the administrator submits the form
    Then the system must display validation messages for missing fields

  Scenario: Prevent duplicate teacher registration
    Given a teacher with the same email or ID already exists
    When the administrator attempts to register the same teacher again
    Then the system must prevent the registration and show an error message
