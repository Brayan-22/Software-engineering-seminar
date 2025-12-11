Feature: Assignment of professors to courses
  As a system administrator
  I want to create assignments linking professors with courses
  So that the system accurately reflects which professors teach which courses

  Background:
    Given the administrator is logged in

  Scenario: Access the assignments management interface
    When the administrator opens the assignments tab
    Then the system must display a list of existing assignments
    And the system must display an "Add Assignment" button

  Scenario: Create a new assignment with valid data
    Given the administrator is on the assignments tab
    When the administrator clicks on "Add Assignment"
    And selects a professor from the list
    And selects a course from the list
    And confirms the assignment creation
    Then the system must display a success confirmation message
    And the new assignment must appear in the assignments list

  Scenario: Validate required fields when creating an assignment
    Given the administrator is on the assignment creation form
    When the administrator attempts to create an assignment without selecting a professor
    Then the system must display validation messages for missing fields
    And the assignment must not be created

  Scenario: Allow a professor to be assigned to multiple courses
    Given a professor already has one course assignment
    When the administrator creates a new assignment for the same professor
    Then the system must allow the creation
    And both assignments must appear in the list

  Scenario: Allow a course to have multiple professors assigned
    Given a course already has one professor assigned
    When the administrator creates a new assignment for the same course
    Then the system must allow the creation
    And both assignments must appear in the list

  Scenario: Prevent duplicate assignments
    Given an assignment already exists for a specific professor and course
    When the administrator attempts to create the same assignment again
    Then the system must prevent the creation and show an error message

  Scenario: Delete an existing assignment
    Given an assignment exists in the system
    When the administrator clicks on delete for that assignment
    And confirms the deletion
    Then the system must remove the assignment
    And the assignment must no longer appear in the list