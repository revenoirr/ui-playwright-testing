Feature: Automation Practice Form functionality on DemoQA

  As a user
  I want to fill out and submit the practice form
  So that I can test form functionality

  Background:
    Given I am on the practice form page

  Scenario: Fill mandatory fields and submit form
    When I enter "John" as first name
    And I enter "Doe" as last name
    And I enter "john.doe@example.com" as email
    And I select "Male" as gender
    And I enter "1234567890" as mobile number
    And I select "10 May 2000" as date of birth
    And I select "Computer Science" as subject
    And I select "Sports" as hobby
    And I upload a sample picture
    And I enter "123 Test Street, Test City" as current address
    And I select "NCR" as state
    And I select "Delhi" as city
    And I submit the form
    Then I should see the form submission confirmation
    And the submitted data should match my inputs