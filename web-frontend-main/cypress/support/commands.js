// cypress/support/commands.js

/**
 * Custom command to log in a user.
 * This command uses cy.session() to cache the user's session,
 * which makes subsequent logins in other tests instantaneous.
 *
 * @param {string} email - The user's email to log in with.
 * @param {string} password - The user's password.
 */
Cypress.Commands.add('login', (email, password) => {
  // cy.session() will create a new session or restore a cached one.
  // The session is uniquely identified by the first argument, e.g., 'user-session'.
  cy.session([email, password], () => {
    // This setup function only runs when a session is created for the first time.
    cy.visit('/login');

    // Manually register the user in localStorage for this test session
    // This mimics the behavior of your app without needing the registration form
    const user = { email, password };
    localStorage.setItem('titanicAppUsers', JSON.stringify([user]));

    // Now, perform the login via the UI
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="submit-button"]').click();

    // Ensure the redirect to the homepage happened
    cy.url().should('include', '/Home');
  });
});