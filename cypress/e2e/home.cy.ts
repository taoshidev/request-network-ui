describe('Home Page', () => {
  it('should open github login from header', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-header-dashboard"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('*[class^="supabase-auth-ui_ui-button"]').contains('Sign in with Github').should('be.visible').click();
  });

  it('navigates to documentation from header', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-header-documentation"]').should('be.visible').should('contain.text', 'Validator Docs')
      .click();
    cy.url().should('include', '/documentation');
  });

  it('navigates to contribute from header', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-header-contribute"]').should('be.visible').should('contain.text', 'Contribute')
      .click();
    cy.url().should('include', '/contributing');
  });

  it('should open github login', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-dashboard"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('*[class^="supabase-auth-ui_ui-button"]').contains('Sign in with Github').should('be.visible').click();
  });

  it('should open github login 2', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-dashboard"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('*[class^="supabase-auth-ui_ui-button"]').contains('Sign in with Github').should('be.visible').click();
  });
});