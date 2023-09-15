import { faker } from '@faker-js/faker';

const justBug = 'Bug'
const randomSummary = faker.lorem.words(4)
const randomDesc = faker.lorem.words(12)

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');

      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  it('Check if the issue is created and validated with all of the fields filled', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('My bug description')
      cy.get('[data-testid="select:type"]').trigger('click')
      cy.get('[data-testid="icon:bug"]').trigger('click')
      cy.get('[data-testid="form-field:title"]').find('[name="title"]').type(justBug)
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

  it.only('Create and validate issue with random data in title and description', () => {
    cy.get('[data-testid="modal:issue-create"]').click().within(() => {
      cy.get('.ql-editor').type(randomDesc)
      cy.get('[data-testid="form-field:title"]').find('[name="title"]').click().type(randomSummary)
      
      issueIsTask() //Need to fix this function

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
        .first().find('p').contains(randomSummary)
        cy.get('[data-testid="icon:task"]').should('be.visible')
        cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible')    
    })
  })

})
// Need to fix this
function issueIsTask() {
  cy.get('[data-testid="select:type"]').then(($selector) => {
    if ($selector.find('[data-testid="icon:task"]')) {
      cy.log('Issue type is Task')
    } else {
      cy.wrap($selector).trigger('click')
      cy.get('[data-testid="select:type"]').trigger('click')
    }
  })
}

/*function issueIsTask() {
  cy.get('[data-testid="select:type"]').then(($selector) => {
    if ($selector.find('data-testid="icon:bug"').length == 1) {
      cy.log('Issue type is Bug')
    } else {
      cy.wrap($selector).trigger('click')
      cy.get('[data-testid="icon:bug"]').trigger('click')
    }
  })
}*/