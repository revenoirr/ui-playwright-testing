const common = {
  paths: ['src/features/**/*.feature'],
  require: [
    'src/support/world.ts',
    'src/support/hooks.ts',
    'src/step-definitions/**/*.ts'
  ],
  requireModule: ['ts-node/register'],
  format: [
    'pretty',
    'summary',
    'html:cucumber-reports/report.html',
    'json:cucumber-reports/report.json',
    'allure-cucumberjs'
  ],

  formatOptions: { 
    snippetInterface: 'async-await',
    colorsEnabled: true
  },
  timeout: 60000, // 60 seconds for steps
  parallel: 1,
  retry: 0
};

module.exports = {
  default: {
    ...common,
    worldParameters: {
      browser: 'chrome'
    }
  },
  chrome: {
    ...common,
    worldParameters: {
      browser: 'chrome'
    }
  },
  firefox: {
    ...common,
    worldParameters: {
      browser: 'firefox'
    }
  }
};