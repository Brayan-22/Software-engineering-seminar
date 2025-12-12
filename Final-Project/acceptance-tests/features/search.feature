Feature: Search courses by professor and professors by course
  As a general system user
  I want to search for courses taught by a specific professor and vice versa
  So that I can access accurate and useful academic information

  Scenario: Search courses by professor name
    Given the user is on the search page
    When the user enters a professor's name
    Then the system must display all courses taught by that professor

  Scenario: Search professors by course name
    Given the user is on the search page
    When the user enters one course name
    Then the system must display all professors assigned to those courses

  Scenario: Partial and case-insensitive match
    Given the user types an incomplete or lowercase search term
    When the system processes the query
    Then the results must still match relevant professors or courses

  Scenario: Show message when no results are found
    Given the user enters a search term with no matches
    When the search is submitted
    Then the system must display a friendly “No results found” message
