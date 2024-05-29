Cypress.Commands.add('assertCheckpointOrder' as any, (checkpointOrder) => {
  return cy
    .get('[data-cy="checkpoint-order"]')
    .contains(checkpointOrder as any);
});
Cypress.Commands.add('assertCompletionMessage' as any, (completionOrder) => {
  return cy.contains(`${completionOrder}/4 checkpoints completed`);
});
export const interceptMystery = (alias) => {
  cy.intercept('POST', '**/graphql').as(alias);
};
export const waitForMystery = (alias) => {
  cy.wait(`@${alias}`);
};
export const sendData = ({ type, dataCy, nextCheckpointPath }) => {
  interceptMystery(`postCheckpoint${type}`);
  if (dataCy) {
    cy.get(dataCy.includes('.') ? dataCy : `[data-cy="${dataCy}"]`)
      .should('be.visible')
      .click();
  }
  waitForMystery(`postCheckpoint${type}`);
  cy.get('[data-cy="thankyou-continue"]').should('be.visible').click();
  cy.url().should('include', nextCheckpointPath);
};