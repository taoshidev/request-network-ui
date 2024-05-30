describe('User Login From Home', () => {
  it('should open github login', () => {
    cy.visit('/');
    cy.get('[data-cy="btn-dashboard"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('*[class^="supabase-auth-ui_ui-button"]').contains('Sign in with Github').should('be.visible').click();
  });
});