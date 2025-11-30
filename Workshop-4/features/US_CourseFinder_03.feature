Feature: Link professor to one or multiple courses
  As a system administrator
  I want to associate an existing professor with one or more courses
  So that course–professor relationships remain accurate in the platform

  Scenario: Access the linking interface
    Given the administrator is logged in
    When the administrator opens the professor–course linking section
    Then the system must display a list of existing professors and courses

  Scenario: Link a professor to multiple courses
    Given the administrator selects an existing professor
    And the system displays courses not yet linked to that professor
    When the administrator selects one or several courses
    And confirms the linking action
    Then the system must store the relationships
    And the linked courses must appear in the professor’s profile

  Scenario: Prevent linking non-existing entities
    Given the administrator selects a professor or course that does not exist
    When attempting to confirm the linking
    Then the system must show an error message

  Scenario: Warn when a course is already linked to another professor
    Given a course is already assigned to a different professor
    When the administrator attempts to link it again
    Then the system must prevent duplication or warn the administrator

  Scenario: Modify existing course links
    Given a professor already has linked courses
    When the administrator updates or removes those links
    Then the system must save the changes and update the displayed relationships
