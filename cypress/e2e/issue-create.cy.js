import { faker } from '@faker-js/faker'

const justBug = 'Bug'
const randomTitle = faker.lorem.words(4)
const randomDesc = faker.lorem.words(12)

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board?modal-issue-create=true')
    })
  })

  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type(randomDesc)
      cy.get('input[name="title"]').type(randomTitle)
      issueIsStory()
      cy.get('[data-testid="select:userIds"]').click()
      cy.get('[data-testid="select-option:Lord Gaben"]').click()
      cy.get('button[type="submit"]').click()
    })

    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')
    cy.reload()
    cy.contains('Issue has been successfully created.').should('not.exist')

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(randomTitle)
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible')
      cy.get('[data-testid="icon:story"]').should('be.visible')
    })
  })

  it('Should validate title is required field if missing', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required')
    })
  })

  it('Check if the issue is created and validated with all of the fields filled', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('My bug description')
      cy.get('[data-testid="form-field:title"]').find('[name="title"]').type(justBug)
      issueIsBug()
      cy.get('[data-testid="form-field:reporterId"]').trigger('click')
      cy.get('[data-testid="select-option:Pickle Rick"]').trigger('click')
      cy.get('[data-testid="select:userIds"]').trigger('click')
      cy.get('[data-testid="select-option:Pickle Rick"]').trigger('click')
      cy.get('[data-testid="select:priority"]').trigger('click')
      cy.get('[data-testid="select-option:Highest"]').trigger('click')
      cy.get('button[type="submit"]').should('be.enabled').click()
    })

    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')
    cy.reload()
    cy.contains('Issue has been successfully created.').should('not.exist')

    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', 1).within(() => {
      cy.get('[data-testid="list-issue"]').should('have.length', '5')
        .first().find('p').contains(justBug)
      cy.get('[data-testid="icon:bug"]').should('be.visible')
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible')
    })
  })

  it('Create and validate issue with random data in title and description', () => {
    cy.get('[data-testid="modal:issue-create"]').click().within(() => {
      cy.get('.ql-editor').type(randomDesc)
      cy.get('[data-testid="form-field:title"]').find('[name="title"]').click().type(randomTitle)
      issueIsTask()
      cy.get('[data-testid="select:reporterId"]').trigger('click')
      cy.get('[data-testid="avatar:Baby Yoda"]').trigger('click')
      cy.get('[data-testid="select:userIds"]').trigger('click')
      cy.get('[data-testid="select-option:Baby Yoda"]').trigger('click')
      cy.get('[data-testid="select:priority"]').trigger('click')
      cy.get('[data-testid="select-option:Low"]').trigger('click')
      cy.get('button[type="submit"]').should('be.visible').and('be.enabled').click()
    })

    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')
    cy.reload()
    cy.contains('Issue has been successfully created.').should('not.exist')

    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', 1).within(() => {
      cy.get('[data-testid="list-issue"]').should('have.length', 5)
        .first().find('p').contains(randomTitle)
      cy.get('[data-testid="icon:task"]').should('be.visible')
      cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible')
    })
  })
})

function issueIsStory() {
  cy.get('[data-testid="select:type"]').then(($story) => {
    if ($story.text().includes('Story')) {
      cy.log('Issue type is Story')
    } else {
      cy.log('Issue is not Story - swapping')
      cy.wrap($story).trigger('click')
      cy.get('[data-testid="icon:story"]').trigger('click')
    }
  })
}

function issueIsBug() {
  cy.get('[data-testid="select:type"]').then(($bug) => {
    if ($bug.text().includes('Bug')) {
      cy.log('Issue type is Bug')
    } else {
      cy.log('Issue is not Bug - swapping')
      cy.wrap($bug).trigger('click')
      cy.get('[data-testid="icon:bug"]').trigger('click')
    }
  })
}

function issueIsTask() {
  cy.get('[data-testid="select:type"]').then(($task) => {
    if ($task.text().includes('Task')) {
      cy.log('Issue type is Task')
    } else {
      cy.log('Issue type is not Task - swapping')
      cy.wrap($task).trigger('click')
      cy.get('[data-testid="icon:task"]').trigger('click')
    }
  })
}