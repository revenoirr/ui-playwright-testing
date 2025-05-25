Feature: Date Picker

  Scenario: Select a specific date
    Given I am on the date picker page
    When I select the date "12/25/2025"
    Then the date field should display "12/25/2025"
