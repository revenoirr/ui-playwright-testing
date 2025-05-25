
# DemoQA UI Automation Project

This project contains UI automation tests for [DemoQA](https://demoqa.com/) using **Playwright**.

## ✅ Features Covered

1. **Alerts**
   - Covered all buttons and verified alert text.
   - URL: https://demoqa.com/alerts

2. **Practice Form**
   - Filled out required fields and submitted the form.
   - URL: https://demoqa.com/automation-practice-form

3. **Text Box**
   - Filled text boxes with random data and verified the result.
   - URL: https://demoqa.com/text-box

4. **Tool Tips**
   - Hovered on all tooltip elements and verified tooltip text.
   - URL: https://demoqa.com/tool-tips

5. **Select Menu**
   - Covered dropdowns:
     - `Select Value`: Group 2, Option 1
     - `Select One`: Other
     - `Old Style Select Menu`: Green
     - `Multiselect`: Black, Blue
   - URL: https://demoqa.com/select-menu

## 🧱 Tech Stack

- [Playwright](https://playwright.dev/)
- TypeScript
- Jest (optional)
- Faker.js (for random data generation)
- Allure (optional, for reporting)

## 🧪 How to Run Tests

```bash
npm install
npx playwright install
npm run test
````

## 🧾 View Test Report

```bash
npm run report
```

## 🛠 Project Structure

```
src/
├── features/               # Feature-wise grouping (alerts, form, etc.)
├── page-objects/           # Page Object Model files
├── tests/                  # Actual Playwright test files
├── support/                # Utility files (if any)
```

## 🚀 CI/CD

GitHub Actions workflow configured to:

* Install dependencies
* Install Playwright browsers
* Run tests
* Upload Playwright HTML report as artifact

See `.github/workflows/test.yml` for details.

## 🧩 Milestones

### Milestone 1

* Project initialized
* POM structure created
* Tests for Alerts and Practice Form
* Run in Chrome

### Milestone 2

* All 5 scenarios implemented
* Tested in Chrome & Firefox
* Screenshots on failure
* Tested on 2 screen resolutions

### Milestone 3

* HTML reporting set up
* CI pipeline with GitHub Actions
* Full documentation

---

## 📂 Report Location

Reports are saved in:

* `playwright-report/` (HTML report)
* `test-results/` (screenshots/videos if enabled)

---


