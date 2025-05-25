Feature: Slider Movement

  Scenario: Set the slider to a specific value
    Given I am on the slider page
    When I move the slider to 75
    Then the slider value should be 75
