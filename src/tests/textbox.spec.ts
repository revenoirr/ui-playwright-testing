import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../page-objects/TextBoxPage';
import { faker } from '@faker-js/faker';

test.describe('Text Box form tests', () => {
  let textBoxPage: TextBoxPage;
  let generatedData: {
    fullName: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
  };

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.navigate();

    generatedData = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      currentAddress: faker.location.streetAddress({ useFullAddress: true }),
      permanentAddress: faker.location.streetAddress({ useFullAddress: true }),
    };
  });

  test('Submit form with random generated data and verify output', async () => {
    await textBoxPage.enterFullName(generatedData.fullName);
    await textBoxPage.enterEmail(generatedData.email);
    await textBoxPage.enterCurrentAddress(generatedData.currentAddress);
    await textBoxPage.enterPermanentAddress(generatedData.permanentAddress);

    await textBoxPage.submitForm();

    const isDisplayed = await textBoxPage.isOutputDisplayed();
    expect(isDisplayed).toBe(true);

    const submittedName = await textBoxPage.getSubmittedName();
    const submittedEmail = await textBoxPage.getSubmittedEmail();
    const submittedCurrentAddress = await textBoxPage.getSubmittedCurrentAddress();
    const submittedPermanentAddress = await textBoxPage.getSubmittedPermanentAddress();

    expect(submittedName).toBe(generatedData.fullName);
    expect(submittedEmail).toBe(generatedData.email);
    expect(submittedCurrentAddress).toBe(generatedData.currentAddress);
    expect(submittedPermanentAddress).toBe(generatedData.permanentAddress);
  });

  // Дополнительные тесты для ввода конкретных значений (если нужны)
  test('Submit form with specified values', async ({ page }) => {
    const fixedData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      currentAddress: '123 Main St, City',
      permanentAddress: '456 Elm St, City',
    };

    await textBoxPage.enterFullName(fixedData.fullName);
    await textBoxPage.enterEmail(fixedData.email);
    await textBoxPage.enterCurrentAddress(fixedData.currentAddress);
    await textBoxPage.enterPermanentAddress(fixedData.permanentAddress);

    await textBoxPage.submitForm();

    expect(await textBoxPage.isOutputDisplayed()).toBe(true);
    expect(await textBoxPage.getSubmittedName()).toBe(fixedData.fullName);
    expect(await textBoxPage.getSubmittedEmail()).toBe(fixedData.email);
    expect(await textBoxPage.getSubmittedCurrentAddress()).toBe(fixedData.currentAddress);
    expect(await textBoxPage.getSubmittedPermanentAddress()).toBe(fixedData.permanentAddress);
  });
});
