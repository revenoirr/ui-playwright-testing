Feature: Checkbox Interaction
  As a user
  I want to interact with checkboxes
  So I can verify the checkbox functionality

  Scenario: Select Notes checkbox
    Given I am on the checkbox page
    When I expand all checkbox sections
    And I select the "Notes" checkbox
    Then the "Notes" checkbox should be selected

  Scenario: Select React checkbox
    Given I am on the checkbox page
    When I expand all checkbox sections
    And I select the "React" checkbox
    Then the "React" checkbox should be selected