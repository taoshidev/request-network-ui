import {
  interceptMystery,
  waitForMystery,
  sendData,
} from '../support/custom-commands';

describe('Happy Path Exploration', () => {
  beforeEach(() => {
    cy.session('navigate-to-login', () => {
      cy.visit('http://localhost:3000/');
      cy.get('[data-cy="btn-dashboard"]').as('btn').should('be.visible');
      cy.get('@btn').click();
      cy.url().should('include', '/login');
    });
  });
  it('should be on login page', () => {
    cy.get('*[class^="supabase-auth-ui_ui-button"]').should('be.visible');
  });
});