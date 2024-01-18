const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  videoCompression: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000/",
    env: {
    } ,
    specPattern: "cypress/tests/**/*.spec.{js,jsx}",
    supportFolder:"cypress/support",
    supportFile:"cypress/support/index.js",
  },
});
