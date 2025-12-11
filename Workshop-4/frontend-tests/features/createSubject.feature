Feature: Registration of new subjects
  As a system administrator
  I want to add new subjects including name, description, and relevant details
  So that the academic offerings remain updated for all users

  Scenario: Access the subject registration form
    Given the administrator is logged in
    When the administrator accesses the main panel
    Then the system must display the "Register Subject" form option for courses

  Scenario: Register a subject with valid data
    Given the administrator is on the subject registration form
    When all required fields are filled with valid information for course
    And the administrator submits the form
    Then the system must display a success confirmation message
    And the new subject must appear in the general list without reloading the page

  Scenario: Validate required fields
    Given the administrator is on the subject registration form
    When required fields are left empty for course
    And the administrator submits the form
    Then the system must display validation messages for missing fields

  Scenario: Prevent duplicate subjects
    Given a subject with the same name already exists
    When the administrator attempts to register the same subject again
    Then the system must prevent the registration and show an error message

  Scenario: Register subject with an assigned teacher
    Given an existing teacher is available in the system
    When the administrator assigns this teacher to the new subject
    And submits the form
    Then the relationship must be correctly stored in the database
