Feature: Select Menu functionality on DemoQA

  As a user
  I want to interact with different types of select menus
  So that I can test dropdown functionality

  Background:
    Given I am on the select menu page

  Scenario: Select values from dropdowns
    When I select "Group 2, option 1" from the "Select Value" dropdown
    And I select "Other" from the "Select One" dropdown
    And I select "Green" from the "Old Style Select Menu" dropdown
    And I select "Black" and "Blue" from the "Multiselect dropdown"
    Then the "Select Value" dropdown should display "Group 2, option 1"
    And the "Select One" dropdown should display "Other"
    And the "Old Style Select Menu" dropdown should display "Green"
    And the "Multiselect dropdown" should display "Black" and "Blue"