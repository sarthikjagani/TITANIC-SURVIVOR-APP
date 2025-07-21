const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'evv679',
  e2e: {
    /**
     * Set the base URL for Cypress tests.
     *
     * It intelligently uses the CYPRESS_BASE_URL environment variable if it exists
     * (which we set in docker-compose.yml for the CI environment).
     *
     * If it doesn't exist, it falls back to 'http://localhost:8080' for easy
     * local development and testing.
     */
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
