# 📘 DemoQA UI Automation with Playwright

Automated UI testing for the [DemoQA](https://demoqa.com/) website using **Playwright** and the **Page Object Model**.

## 📋 Project Description

This project includes end-to-end UI test automation for the DemoQA site, covering key interactive components. It uses:

* **Playwright** for writing and executing tests
* **Page Object Model (POM)** for separating page logic
* **Allure Report** for generating detailed test reports
* **GitHub Actions** for CI/CD
* **Cross-browser testing** (Chrome and Firefox)

## ✅ Covered Scenarios

| # | Page                        | Description                                                                                      |
| - | --------------------------- | ------------------------------------------------------------------------------------------------ |
| 1 | `/alerts`                   | Handling all types of alerts (alert box, confirm, prompt)                                        |
| 2 | `/automation-practice-form` | Filling required fields in the form and verifying the result                                     |
| 3 | `/text-box`                 | Filling text boxes with random data and verifying the output                                     |
| 4 | `/tool-tips`                | Hovering over elements and checking the display of tooltips                                      |
| 5 | `/select-menu`              | Interacting with dropdowns and multiselects (values: Group 2 Option 1, Other, Green, Black/Blue) |

---

## 🏗️ Project Structure
```
src/
  ├── page-objects/     # Page Object Model
  ├── support/          # Helpers and hooks
  └── tests/            # UI tests (.spec.ts)
```

## 🚀 Installation and Running

### 🔧 Install dependencies

```bash
npm install
npx playwright install --with-deps
```

### ▶️ Run tests

```bash
npx playwright test                     # Run all tests
npx playwright test --project=chromium  # Run in Chromium
npx playwright test --project=firefox   # Run in Firefox
npx playwright test --project=webkit    # Run in WebKit
```

## 📊 Reports

### Allure Report

```bash
npm run allure:report  # Generate and open the report
```


## 🔁 GitHub Actions (CI)

On each push to the `main` branch, the following steps are automatically executed:

* Install dependencies
* Run tests
* Generate Allure report
* Upload the report as an artifact

CI pipeline: `.github/workflows/test.yml`








# Review

* Write README.md in english language
*  package.json. Move to devDependencies:
*     "@faker-js/faker": "^8.0.2",
*     "@playwright/test": "^1.36.0",
*     "dotenv": "^16.3.1",
*     "playwright": "^1.36.0",
*     "ts-node": "^10.9.1",
*     "typescript": "^5.1.6"

done 
* Is BDD approcah implemented?
* Remove all locators to the Page Objects.
* How to launch with specific key word test in Chrome browser with resolution 1920 x 1080?
* Remove hardcoded waiters 
* Use "domcontentloaded" for pages where you need to start testing immediately after the DOM has loaded.
*  Use "load" for pages where it is important to wait for all resources to load (for example, if the test depends on images or external scripts).
*  Use "networkidle" for pages with dynamic content where you need to wait for all network requests to complete.
*    Playwright automatically waits for elements to become ready for interaction (visible, clickable, etc.) by default. This reduces the need for manual delays.
* 
* waitForSelector()
* Waits for an element to appear, disappear, or change state on the page. You can specify the state: 'visible', 'hidden', 'attached', 'detached'.
* 
* This is the best way to wait for a specific element instead of a fixed delay.
* 
* waitForFunction()
* Allows you to wait for an arbitrary condition specified as a function. Used for more complex checks when you need to wait for a specific state in the DOM or JS.
