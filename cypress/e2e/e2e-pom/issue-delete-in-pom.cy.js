import IssueModal from "../../pages/IssueModal";

describe('Issue deletion using POM', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.contains(issueTitle).click();
    });
  });

  const issueTitle = 'This is an issue of type: Task.';

  it('Verify that the first task can be deleted', () => {
    const numOfIssuesAfterDeletion = 3;

    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateAmountOfIssuesInBacklog(numOfIssuesAfterDeletion)
  });

  it('Verify that it is possible to cancel the deletion of a task', () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});