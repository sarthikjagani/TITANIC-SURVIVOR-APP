// cypress/e2e/calculator-page.cy.js

/**
 * Cypress E2E Test for the Calculator Page.
 * This test suite verifies the functionality of the CalculatorPage component.
 */
describe('Calculator Page End-to-End Test', () => {

  // Before each test, visit the calculator page.
  // Update '/calculator' to the actual route of your calculator page.
  beforeEach(() => {
    // This assumes the calculator page is at the '/calculator' route
    cy.visit('/calculator');
  });

  it('should display all form elements correctly', () => {
    // Check for the main heading
    cy.contains('h1', 'Survival Calculator').should('be.visible');

    // Check for all input fields and labels
    cy.contains('label', 'Title:').should('be.visible');
    cy.get('#title').should('be.visible');

    cy.contains('label', 'Name:').should('be.visible');
    cy.get('#name').should('be.visible');

    cy.contains('label', 'Sex:').should('be.visible');
    cy.get('#sex').should('be.visible');

    cy.contains('label', 'PClass:').should('be.visible');
    cy.get('#pClass').should('be.visible');

    cy.contains('label', 'Age:').should('be.visible');
    cy.get('#age').should('be.visible');

    cy.contains('label', 'Fare:').should('be.visible');
    cy.get('#fare').should('be.visible');

    cy.contains('label', 'Traveled Alone:').should('be.visible');
    cy.get('#traveledAlone').should('be.visible');

    cy.contains('label', 'Embarked:').should('be.visible');
    cy.get('#embarked').should('be.visible');

    // For an anonymous user, this is a single select dropdown
    cy.contains('label', 'Choose Model:').should('be.visible');
    cy.get('#model').should('be.visible');

    // Check for buttons
    cy.contains('button', 'Submit').should('be.visible');
    cy.contains('button', 'Reset').should('be.visible');
  });

  it('should allow a user to fill out the form', () => {
    cy.get('#title').select('Mr');
    cy.get('#name').type('John Doe');
    cy.get('#sex').select('male');
    cy.get('#pClass').select('1st');
    cy.get('#age').type('30');
    cy.get('#fare').type('100');
    cy.get('#traveledAlone').select('yes');
    cy.get('#embarked').select('southampton');
    cy.get('#model').select('Random Forest');

    // Assertions to make sure the values were entered correctly
    // Note: The component converts name to lowercase, so we assert against that
    cy.get('#title').should('have.value', 'mr');
    cy.get('#name').should('have.value', 'john doe');
    cy.get('#sex').should('have.value', 'male');
    cy.get('#pClass').should('have.value', '1st');
    cy.get('#age').should('have.value', '30');
    cy.get('#fare').should('have.value', '100');
    cy.get('#traveledAlone').should('have.value', 'yes');
    cy.get('#embarked').should('have.value', 'southampton');
    cy.get('#model').should('have.value', 'Random Forest');
  });

  it('should show a validation error for invalid age', () => {
    // Fill other required fields to ensure only the field under test is invalid
    cy.get('#fare').type('50');
    
    // By invoking 'removeAttr', we bypass the browser's native validation
    // and can test our component's custom validation logic.
    cy.get('#age').invoke('removeAttr', 'min').type('-5');
    
    cy.contains('button', 'Submit').click();
    
    cy.get('.error-message-container')
      .should('be.visible')
      .and('contain', 'Age must be a valid number between 0 and 100.');
  });

  it('should show a validation error for invalid fare', () => {
    // Fill other required fields
    cy.get('#age').type('25');
    
    // Remove native browser validation to test component logic
    cy.get('#fare').invoke('removeAttr', 'min').type('-10');

    cy.contains('button', 'Submit').click();

    cy.get('.error-message-container')
      .should('be.visible')
      .and('contain', 'Fare must be a valid number between 0 and 500.');
  });


  it('should successfully submit the form and display prediction results', () => {
    // Intercept the API call and return a mock response
    cy.intercept('POST', '/api/predict', {
      statusCode: 200,
      body: [
        { model_name: 'random_forest', survival_probability: 0.8 }
      ],
    }).as('predictRequest');

    // Fill the form with valid data
    cy.get('#title').select('Mrs');
    cy.get('#name').type('Jane Doe');
    cy.get('#sex').select('female');
    cy.get('#pClass').select('1st');
    cy.get('#traveledAlone').select('no');
    cy.get('#embarked').select('cherbourg');
    cy.get('#model').select('Random Forest');

    // Remove native validation attributes just in case they interfere
    cy.get('#age').invoke('removeAttr', 'required').type('28');
    cy.get('#fare').invoke('removeAttr', 'required').type('250');
    
    // Submit the form
    cy.contains('button', 'Submit').click();

    // Wait for the API call to complete. This also serves to wait for the loading state to resolve.
    cy.wait('@predictRequest');

    // Check that the loading indicator is gone
    cy.contains('Calculating...').should('not.exist');

    // Check for the results
    cy.get('.results-section').should('be.visible');
    cy.get('.results-section').contains('h3', 'Prediction Results:').should('be.visible');
    cy.get('.results-section ul li').should('have.length', 1);
    cy.get('.results-section').contains('Random Forest:').next().should('contain', 'Survived');
  });

  it('should reset the form when reset button is clicked', () => {
      cy.get('#name').type('Test Name');
      cy.get('#age').type('45');
      cy.get('#fare').type('123');

      cy.contains('button', 'Reset').click();

      cy.get('#name').should('have.value', '');
      cy.get('#age').should('have.value', '');
      cy.get('#fare').should('have.value', '');
      cy.get('.results-section').should('not.exist');
  });
});
