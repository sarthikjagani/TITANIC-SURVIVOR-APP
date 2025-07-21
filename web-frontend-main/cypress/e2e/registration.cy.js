// cypress/e2e/registration.cy.js

/**
 * Cypress E2E Test for the Registration Page.
 * This test suite verifies the functionality of the RegisterForm component.
 */
describe('Registration Page End-to-End Test', () => {

  // Before each test, visit the registration page and clear localStorage
  // to ensure tests are isolated and independent.
  beforeEach(() => {
    cy.visit('/register');
    cy.clearLocalStorage();
  });

  it('should display all registration form elements correctly', () => {
    cy.get('[data-cy="register-heading"]').should('be.visible').and('contain', 'Register Account');
    cy.get('[data-cy="email-input"]').should('be.visible');
    cy.get('[data-cy="password-input"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.visible').and('contain', 'Register');
  });

  it('should show validation errors for empty fields on submit', () => {
    // Click the submit button without filling out any fields
    cy.get('[data-cy="submit-button"]').click();

    // Check that both validation error messages are displayed
    cy.get('[data-cy="email-error"]').should('be.visible').and('contain', 'Email is required');
    cy.get('[data-cy="password-error"]').should('be.visible').and('contain', 'Password is required');
  });

  it('should show a validation error for an invalid email format', () => {
    // Type an invalid email format
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="email-error"]').should('be.visible').and('contain', 'Email address is invalid');
  });

  it('should show a validation error for a short password', () => {
    // Type a password that is too short
    cy.get('[data-cy="email-input"]').type('valid@email.com');
    cy.get('[data-cy="password-input"]').type('123');
    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="password-error"]').should('be.visible').and('contain', 'Password must be at least 6 characters long');
  });

  it('should show an error if the email is already registered', () => {
    // First, manually add an existing user to localStorage to simulate a registered user
    const existingUser = { email: 'test@example.com', password: 'password123' };
    localStorage.setItem('titanicAppUsers', JSON.stringify([existingUser]));

    // Now, try to register with the same email
    cy.get('[data-cy="email-input"]').type(existingUser.email);
    cy.get('[data-cy="password-input"]').type('anotherPassword');
    cy.get('[data-cy="submit-button"]').click();

    // Check for the API error message
    cy.get('[data-cy="api-error"]').should('be.visible').and('contain', 'Email already registered. Please login.');
  });

  it('should successfully register a new user and redirect to /Home', () => {
    const newUserEmail = 'newuser@example.com';
    const newUserPassword = 'a-secure-password';

    // Fill out the form with valid new user credentials
    cy.get('[data-cy="email-input"]').type(newUserEmail);
    cy.get('[data-cy="password-input"]').type(newUserPassword);

    // Click the register button
    cy.get('[data-cy="submit-button"]').click();

    // After successful registration, the user should be redirected to the /Home page
    cy.url().should('include', '/Home');

    // Bonus: Verify that the user was actually added to localStorage
    cy.window().its('localStorage').invoke('getItem', 'titanicAppUsers').then((usersJson) => {
      const users = JSON.parse(usersJson);
      const newUser = users.find(user => user.email === newUserEmail);
      expect(newUser).to.not.be.undefined;
      expect(newUser.password).to.eq(newUserPassword);
    });
  });

});