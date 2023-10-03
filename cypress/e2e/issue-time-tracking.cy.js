import { faker } from '@faker-js/faker'

describe('Time Estimation & Logging Functionalities', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true')
        })
        issueCreate()
    })

    it('Add, Update, Remove Estimaiton Time', () => {

        const tenHours = 10
        const twentyHours = 20

        cy.get('[data-testid="modal:issue-details"]').should('exist')
            .within(() => {
                cy.get('div').contains('No time logged')
                    .should('be.visible')
            })

        // Add Estimation Time
        timeEstimate(tenHours)
        cy.wait(1000)
        issueCloseOnX()
        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('div').contains(`${tenHours}h estimated`)
                .should('exist')
                .and('be.visible')

            //Update Estimation Time

            cy.get('[placeholder="Number"]').should('have.value', tenHours)
                .and('be.visible')
                .click()
                .clear()
                .type(twentyHours)
                .wait(1000)

            issueCloseOnX()
        })

        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('div').contains(`${twentyHours}h estimated`)
                .should('exist')
                .and('be.visible')

            //Remove Estimation Time

            cy.get('[placeholder="Number"]').should('have.value', twentyHours)
                .and('be.visible')
                .click()
                .clear()
                .wait(1000)

            issueCloseOnX()
        })

        issueFirstOpen()

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('[placeholder="Number"]').should('be.empty')

            cy.get('div').contains(`${twentyHours}h estimated`)
                .should('not.exist')
        })
    })

    it('Add & Remove Time Logging', () => {

        const twoHours = 2
        const fiveHours = 5

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
                    .type(twoHours)

                cy.get('[placeholder="Number"]').eq(1)
                    .should('have.attr', 'placeholder', 'Number')
                    .click()
                    .should('be.empty')
                    .type(fiveHours)
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

                clickButtonDone()
            })

        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('div').contains('No time logged')
                .should('be.visible')
                .and('exist')

            cy.get('div').contains(`${fiveHours}h remaining`)
                .should('not.exist')
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
        cy.wait(8000)
    })

    cy.get('[type="success"]').should('be.visible')
        .and('exist')
        .and('have.text', 'Issue has been successfully created.')

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

function timeEstimate(timeEst) {
    cy.get('[placeholder="Number"]')
        .type(timeEst)
}

function clickButtonDone(params) {
    cy.get('button').contains('Done')
        .should('exist')
        .and('be.visible')
        .click()
}