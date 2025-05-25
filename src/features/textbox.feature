Feature: Text Box functionality on DemoQA

  As a user
  I want to fill out the text box form
  So that I can test form functionality with random data

  Background:
    Given I am on the text box page

  Scenario: Fill text box with random data
    When I enter a random full name
    And I enter a random email
    And I enter a random current address
    And I enter a random permanent address
    And I submit the text box form
    Then I should see the submitted data displayed
    And the displayed data should match my inputs