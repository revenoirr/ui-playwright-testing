# 📘 DemoQA UI Automation with Playwright

Автоматизация UI-тестирования сайта [DemoQA](https://demoqa.com/) с использованием **Playwright** и **Page Object Model**.

## 📋 Описание проекта

Этот проект включает написание end-to-end UI-тестов для сайта DemoQA, покрывая основные интерактивные компоненты. Используется:

* **Playwright** для написания и запуска тестов
* **Page Object Model (POM)** для разделения логики страниц
* **Allure Report** для генерации отчётов
* **GitHub Actions** для CI/CD
* **Cross-browser testing** (Chrome и Firefox)

---

## ✅ Покрытые сценарии

| № | Страница                    | Описание                                                                                      |
| - | --------------------------- | --------------------------------------------------------------------------------------------- |
| 1 | `/alerts`                   | Обработка всех типов алертов (окна, подтверждения, промпта)                                   |
| 2 | `/automation-practice-form` | Заполнение обязательных полей формы и проверка результата                                     |
| 3 | `/text-box`                 | Заполнение текстбоксов случайными данными и проверка результата                               |
| 4 | `/tool-tips`                | Наведение на элементы и проверка отображения тултипов                                         |
| 5 | `/select-menu`              | Работа с дропдаунами и мультиселектами (значения: Group 2 Option 1, Other, Green, Black/Blue) |

---

## 🏗️ Структура проекта

```
src/
  ├── page-objects/     # Page Object Model
  ├── support/          # Вспомогательные файлы, хуки
  └── tests/            # UI-тесты (.spec.ts)
```

---

## 🚀 Установка и запуск

### 🔧 Установка зависимостей

```bash
npm install
npx playwright install --with-deps
```

### ▶️ Запуск тестов

```bash
npx playwright test           # Запуск всех тестов (Playwright)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit


---

## 📊 Отчёты

### Allure Report

```bash
npm run allure:report  # Генерация и запуск отчёта
```

---

## 🔁 GitHub Actions (CI)

При пуше в `main` ветку автоматически запускаются:

* Установка зависимостей
* Запуск тестов
* Генерация Allure отчёта
* Загрузка отчёта как артефакта

Пайплайн: `.github/workflows/test.yml`



# Review

* Write README.md in english language
*  package.json. Move to devDependencies:
*     "@faker-js/faker": "^8.0.2",
*     "@playwright/test": "^1.36.0",
*     "dotenv": "^16.3.1",
*     "playwright": "^1.36.0",
*     "ts-node": "^10.9.1",
*     "typescript": "^5.1.6"
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
