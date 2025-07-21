// cypress/e2e/login.cy.js

/**
 * Cypress E2E Test for the Login Page.
 * This test file is specifically tailored to the provided LoginForm.jsx component.
 */
describe('Login Page End-to-End Test', () => {

  // Before each test, we visit the login page.
  beforeEach(() => {
    // Make sure your application is running and accessible at this URL.
    cy.visit('/login');
  });

  it('should display all login form elements correctly', () => {
    // Check for the heading
    cy.get('[data-cy="login-heading"]').should('be.visible').and('contain', 'Login');

    // Check for input fields and the button
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.visible').and('contain', 'Login');
  });

  it('should allow a user to type their credentials', () => {
    const email = 'test@example.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email).should('have.value', email);
    cy.get('[data-cy="password-input"]').type(password).should('have.value', password);
  });

  it('should show an error message for an unregistered email', () => {
    // Type in credentials for a user that does not exist
    cy.get('[data-cy="email-input"]').type('unregistered@example.com');
    cy.get('[data-cy="password-input"]').type('anypassword');
    cy.get('[data-cy="submit-button"]').click();

    // Check for the specific error message from your component
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Email not registered. Please register first.');
  });

  it('should show an error message for an incorrect password', () => {
    // This test requires a user to already be registered in localStorage.
    // We can create one for the test.
    const registeredUser = { email: 'user@example.com', password: 'correctpassword' };
    localStorage.setItem('titanicAppUsers', JSON.stringify([registeredUser]));

    // Now, attempt to log in with the correct email but wrong password
    cy.get('[data-cy="email-input"]').type(registeredUser.email);
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    cy.get('[data-cy="submit-button"]').click();

    // Check for the specific error message
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Incorrect password.');
  });

  it('should successfully log in with correct credentials and redirect to /Home', () => {
    // Create a user in localStorage for a successful login test
    const registeredUser = { email: 'testuser@example.com', password: 'password123' };
    localStorage.setItem('titanicAppUsers', JSON.stringify([registeredUser]));

    // Enter the correct credentials
    cy.get('[data-cy="email-input"]').type(registeredUser.email);
    cy.get('[data-cy="password-input"]').type(registeredUser.password);

    // Click the login button
    cy.get('[data-cy="submit-button"]').click();

    // Assert that the URL has changed to '/Home' after successful login
    cy.url().should('include', '/Home');
  });
});