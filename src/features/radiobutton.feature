Feature: Radio Button Selection

  Scenario Outline: Select a radio button and verify result
    Given I am on the radio button page
    When I select the <button> radio button
    Then I should see the result message "<message>"

    Examples:
      | button  | message         |
      | Yes     | You have selected Yes |
      | Impressive | You have selected Impressive |
