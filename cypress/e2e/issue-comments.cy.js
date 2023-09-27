import { faker } from '@faker-js/faker'

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const commentDeleteModalConfirm = () => cy.get('[data-testid="modal:confirm"]')

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        commentDeleteModalConfirm().within(() => {
            cy.contains('button', 'Delete comment')
                .click()
                .should('not.exist');
        })

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });

    it('Should create, update and delete a comment', () => {

        const randomComment = faker.lorem.sentence({ min: 5, max: 10 })
        const randomEditedComment = faker.lorem.sentence({ min: 1, max: 4 })

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .trigger('click')

            cy.get('[placeholder="Add a comment..."]')
                .should('be.visible')
                .and('exist')
                .type(randomComment)

            cy.contains('button', 'Save')
                .should('be.enabled')
                .click()
                .should('not.exist')

            cy.get('[data-testid="issue-comment"]')
                .should('have.length', 2)
                .and('contain', randomComment)

            cy.get('[data-testid="issue-comment"]')
                .first()
                .should('exist')
                .and('be.visible')
                .within(() => {
                    cy.contains('Edit')
                        .should('be.visible')
                        .and('exist')
                        .trigger('click')

                    cy.get('[placeholder="Add a comment..."]')
                        .clear()
                        .type(randomEditedComment)

                    cy.contains('Save')
                        .should('be.enabled')
                        .click()
                        .should('not.exist')
                })

            cy.get('[data-testid="issue-comment"]')
                .should('have.length', 2)
                .and('contain', randomEditedComment)

            cy.get('[data-testid="issue-comment"]')
                .first()
                .within(() => {
                    cy.contains('Delete')
                        .should('exist')
                        .click()
                })
        })

        commentDeleteModalConfirm().within(() => {
            cy.contains('Are you sure you want to delete this comment?').should('be.visible')
            cy.get('p').should('have.text', "Once you delete, it's gone for good.")

            cy.get('button')
                .eq(1)
                .should('have.text', 'Cancel')
                .and('be.enabled')

            cy.get('button')
                .eq(0)
                .should('have.text', 'Delete comment')
                .and('be.enabled')
                .click()
        })

        commentDeleteModalConfirm().should('not.exist')

        cy.get('[data-testid="issue-comment"]')
            .should('have.length', 1)
            .and('not.contain', randomEditedComment)
    });
});
