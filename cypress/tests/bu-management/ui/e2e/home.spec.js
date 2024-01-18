
import testData from '../../../../fixtures/bu-management/home.json'

describe("home-page-test-suite", () => {
  beforeEach(function () {
    cy.visit("/bu-management");
  });

  it("page-layout", function() {
    //checks for the page title
    cy.get(".pagetitle").should("have.text", "Business Unit Management");
    // checks for the home page btn
    cy.get(".account_btn").should("be.enabled");
  });

  it("search-input-text", function() {
    cy.get("[cy-data=bu-search]")
      .click()
      .type("Search Text")
      .should("contain.value", "Search Text");
  });

    it("single-searched-item-check", function () {
        cy.wrap(testData['search-input-data']['singleItemCheck']).should('be.an','array')
        Cypress.$.each(testData['search-input-data']['singleItemCheck'],(index,value) =>{
            cy.get("[cy-data=bu-search]").click()
            .type(value)
            cy.get("[data-cy=bu-list-container] [data-cy=0]").as('searchCard')
            cy.get('@searchCard').should('exist').and('have.length', 1)
            cy.get('@searchCard').find('.v-card-text').contains("Paracetamol")
            cy.get("[cy-data=bu-search]").click().clear()
        })
    });

    it("multiple-searched-item-check", function () {
        cy.wrap(testData['search-input-data']['multipleItemsCheck']).should('be.an','array')
        Cypress.$.each(testData['search-input-data']['multipleItemsCheck'],(index,value) =>{
            cy.get("[cy-data=bu-search]").click()
            .type(value)
            cy.get("[data-cy=bu-list-container]").as('searchCard')
            cy.get('@searchCard').children().should('exist').and('have.length.greaterThan', 1)
            cy.get('@searchCard').first().find('.v-card-text').contains("BU CARD 2")
            cy.get("[cy-data=bu-search]").click().clear()
        })
    });

    it("null-searched-item-check", function () {
        cy.wrap(testData['search-input-data']['zeroItemCheck']).should('be.an','array')
        Cypress.$.each(testData['search-input-data']['zeroItemCheck'],(index,value) =>{
            cy.get("[cy-data=bu-search]").click()
            .type(value)
            cy.get("[data-cy=bu-list-container]").as('searchCard')
            cy.get('@searchCard').contains('No Results Found!')
            cy.get("[cy-data=bu-search]").click().clear()
        })
    });

    it("create-bu-test",function() {
        cy.intercept('GET', 'http://localhost:8000/newBu',testData['create-bu-data'] ).as('getData');
        cy.get('[data-cy=create-bu-btn]').as('createBUBtn')
        cy.get("@createBUBtn").should('exist')
        cy.get("@createBUBtn").click()
        cy.get('[data-cy=create-bu-dialog]').should('exist').first().contains('Create New Business Unit')
        cy.get('[data-cy=create-newbu-btn').should('exist')
        //
        cy.wrap(testData['create-bu-data']).should('exist')
        cy.get('[cy-data=bu-display-name').click()
            .type(testData['create-bu-data']["displayName"])
        cy.get('[cy-data=bu-unit-id').click()
            .type(testData['create-bu-data']["buID"])
        cy.get('[cy-data=bu-description').click()
            .type(testData['create-bu-data']["description"])
        //
        cy.get('[data-cy=create-newbu-btn').should('exist').click()
        //intersepting http response
        cy.wait('@getData').then(interception=>{
            console.log(interception.response.body)
        })
        //
        cy.get('[data-cy=create-bu-dialog]').should('not.exist')
        // check for the new created bu
        cy.get("[cy-data=bu-search]").click()
            .type(testData['create-bu-data']["buID"])
        cy.get("[data-cy=bu-list-container]").as('searchCard')
        cy.get('@searchCard').should('exist')
            .and('have.length', 1)
            .and('contain',testData['create-bu-data']["buID"]) 
        cy.get("[cy-data=bu-search]").click().clear()
    })

    it("visit-bu-check-params",()=>{
        cy.get("[data-cy=bu-list-container]").as('searchCard')
        cy.get('@searchCard').children().should('exist').and('have.length.greaterThan', 1)
        cy.wait(1000)

        cy.get('@searchCard').children().first().click()
        // cy.get('@buCard').click()
    })

    it.only("remove-managers-test",()=>{
        cy.get("[data-cy=bu-list-container]").as('searchCard')
        cy.get('@searchCard').children().should('exist').and('have.length.greaterThan', 1)
        cy.wait(1000)

        cy.get('@searchCard').children().first().click()
        cy.get("[data-cy=manager-selection-filter]").click()
        cy.get("[data-cy=manager-selection-filter-list]").children().should(($el)=>{
         let filters = $el.map((i, el) => {
                return Cypress.$(el).text()
              })
              console.log(filters,typeof(filters))
              expect(filters.get()).to.deep.equal( ['All Managers','Employee Managers','Adhoc Managers'])
        })
        cy.get("[data-cy=manager-selection-filter-list]").children().first().next().click()
        cy.get("[data-cy=list-of-managers]").its('length').then(count=>{
            Cypress._.times(count, (i) => {
                cy.get(`[data-cy=select-manager-${0}]`).click().then(() => {
                    cy.get("[data-cy=remove-managers]").click();
                  })
                  .then(() => {
                    cy.get("[data-cy=remove-managers-btn]").should('exist');
                  })
                  .then(() => {
                    cy.get("[data-cy=remove-managers-btn]").click();
                  });
              })
        })
        

          
          
    })

});
