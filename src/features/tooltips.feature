Feature: Tool Tips functionality on DemoQA

  As a user
  I want to interact with tooltips
  So that I can verify the tooltip text

  Background:
    Given I am on the tooltips page

  Scenario: Check tooltip on hover button
    When I hover over the "Hover me to see" button
    Then I should see a tooltip with text "You hovered over the Button"

  Scenario: Check tooltip on hover text field
    When I hover over the input field
    Then I should see a tooltip with text "You hovered over the text field"

  Scenario: Check tooltip on contrary text
    When I hover over the "Contrary" text
    Then I should see a tooltip with text "You hovered over the Contrary"
    
  Scenario: Check tooltip on section text
    When I hover over the "1.10.32" text
    Then I should see a tooltip with text "You hovered over the 1.10.32"