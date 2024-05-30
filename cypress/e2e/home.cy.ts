describe('Home Page', () => {
  it('should open github login', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-dashboard"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('*[class^="supabase-auth-ui_ui-button"]').contains('Sign in with Github').should('be.visible').click();
  });

  it('navigates to documentation', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-documentation"]').should('be.visible').should('contain.text', 'Documentation')
    .click();
    cy.url().should('include', '/documentation');
  });

  it('navigates to contribute', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-contribute"]').should('be.visible').should('contain.text', 'Contribute')
    .click();
    cy.url().should('include', '/contributing');
  });
});