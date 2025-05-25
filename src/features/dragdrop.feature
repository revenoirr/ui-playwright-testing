Feature: Drag and Drop

  Scenario: Drag an element and drop it
    Given I am on the drag and drop page
    When I drag the draggable element to the drop target
    Then the drop target should display "Dropped!"
