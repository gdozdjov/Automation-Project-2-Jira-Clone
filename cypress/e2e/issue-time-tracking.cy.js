import { faker } from '@faker-js/faker'

describe('Time Estimation & Logging Functionalities', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true')
        })
    })

    it.only('Add, Update, Remove Estimaiton Time', () => {

        issueCreate()

        cy.get('[data-testid="modal:issue-details"]').should('exist')
            .within(() => {
                clickOnStopwatch()
            })
        // Add Estimation Time
        cy.get('[data-testid="modal:tracking"]').should('exist')
            .within(() => {
                cy.get('[placeholder="Number"]').should('be.empty')
                    .click()
                    .type(10)
                    .wait(1000)
            })

        issueCloseOnX()


        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('div').contains('10h estimated')
                .should('exist')
                .and('be.visible')

            //Update Estimation Time

            cy.get('[placeholder="Number"]').should('have.value', 10)
                .and('be.visible')
                .click()
                .clear()
                .type(20)
                .wait(1000)

            issueCloseOnX()
        })

        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('div').contains('20h estimated')
                .should('exist')
                .and('be.visible')

            //Remove Estimation Time

            cy.get('[placeholder="Number"]').should('have.value', 20)
                .and('be.visible')
                .click()
                .clear()
                .wait(1000)

            issueCloseOnX()
        })

        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('[placeholder="Number"]').should('be.empty')

            cy.get('div').contains('20h estimated')
                .should('not.exist')
        })
    })

    it('Add & Remove Time Logging', () => {

        issueAddEstimationTime()
        issueFirstOpen()

        //Log Time
        clickOnStopwatch()

        cy.get('[data-testid="modal:tracking"]').should('exist')
            .within(() => {
                cy.get('[placeholder="Number"]').eq(0)
                    .should('have.attr', 'placeholder', 'Number')
                    .click()
                    .should('be.empty')
                    .type(2)

                cy.get('[placeholder="Number"]').eq(1)
                    .should('have.attr', 'placeholder', 'Number')
                    .click()
                    .should('be.empty')
                    .type(5)
                    .wait(1500)

                cy.get('button').contains('Done')
                    .should('exist')
                    .and('be.visible')
                    .click()
            })

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('div').contains('2h logged').should('exist')
                .and('be.visible')

            cy.get('div').contains('No time logged').should('not.exist')

            cy.get('div').contains('5h remaining').should('exist')
                .and('be.visible')
        })

        // Remove Logged Time
        clickOnStopwatch()

        cy.get('[data-testid="modal:tracking"]').should('exist')
            .within(() => {
                cy.get('[placeholder="Number"]').eq(0)
                    .clear()
                    .should('be.empty')

                cy.get('[placeholder="Number"]').eq(1)
                    .clear()
                    .should('be.empty')
                    .wait(1500)

                cy.get('button').contains('Done')
                    .should('exist')
                    .and('be.visible')
                    .click()
            })

        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('div').contains('No time logged').should('be.visible')
                .and('exist')
            cy.get('div').contains('5h remaining').should('not.exist')
        })
    })
})




function issueCreate() {

    const randomTitle = faker.lorem.words(4)
    const randomDesc = faker.lorem.words(12)

    cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('.ql-editor').type(randomDesc)
        cy.get('input[name="title"]').type(randomTitle)
        cy.get('[data-testid="select:userIds"]').click()
        cy.get('[data-testid="select-option:Lord Gaben"]').click()
        cy.get('button[type="submit"]').click()
    })

    cy.get('[data-testid="board-list:backlog').within(() => {
        cy.get('[data-testid="list-issue"]')
            .first()
            .find('p')
            .contains(randomTitle)
            .click()
    })
}

function issueFirstOpen() {
    cy.get('[data-testid="board-list:backlog')
        .find('[data-testid="list-issue"]')
        .first()
        .click()
}

function issueCloseOnX() {
    cy.get('[data-testid="icon:close"]')
        .first()
        .click()
}

function issueAddEstimationTime() {

    issueCreate()

    cy.get('[data-testid="modal:issue-details"]').should('exist')
        .within(() => {
            cy.get('div').contains('No time logged')
                .should('be.visible')

            cy.get('[placeholder="Number"]').should('be.empty')
                .click()
                .type(10)
                .wait(1000)

            issueCloseOnX()
        })
}

function clickOnStopwatch() {
    cy.get('[data-testid="icon:stopwatch"]')
        .should('be.visible')
        .click()
}