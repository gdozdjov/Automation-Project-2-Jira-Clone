beforeEach(() => {
    cy.visit('/')
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board')
        cy.contains('This is an issue of type: Task.').click()
        cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    })
})

describe('Issue Deletion Validation Tests', () => {
    it('Delete first issue and validate that it has been removed from the backlog', () => {
        cy.get('[data-testid="icon:trash"]').should('exist')
            .and('be.visible')
            .trigger('click')
        cy.get('[data-testid="modal:confirm"]').should('exist')
            .and('be.visible')
            .within(() => {
                cy.get('button').contains('Delete issue')
                    .should('exist')
                    .and('be.visible')
                    .click()
            })

        cy.get('div').contains('Kanban board').click()
        cy.reload()

        cy.get('[data-testid="board-list:backlog"]').within(() => {
            cy.get('[data-testid="list-issue"]').should('have.length', 3)
        })
    })

    it('Cancel deletion of the issue and validate that it still exists in backlog', () => {
        cy.get('[data-testid="icon:trash"]').should('exist')
            .and('be.visible')
            .trigger('click')
        cy.get('[data-testid="modal:confirm"]').should('exist')
            .and('be.visible')
            .within(() => {
                cy.get('button').contains('Cancel')
                    .should('exist')
                    .and('be.visible')
                    .click()
            })

        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        cy.get('[data-testid="modal:issue-details"]').find('button').eq(4).click()
        cy.get('[data-testid="modal:issue-details"]').should('not.exist')

        cy.get('[data-testid="board-list:backlog"]').within(() => {
            cy.get('[data-testid="list-issue"]').should('have.length', 4)
            cy.get('[data-testid="list-issue"]').first()
                .contains('p')
                .should('have.text', 'This is an issue of type: Task.')
        })
    })
})
