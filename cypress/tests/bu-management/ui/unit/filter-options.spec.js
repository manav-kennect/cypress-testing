const { inRange } = require("cypress/types/lodash")

describe('unit-test-filters-btn',()=>{
    beforeEach(()=>{
        cy.visit('/bu-management')
        cy.get("[data-cy=bu-filter-btn]").should('be.enabled')
    })

    it('no-of-filters',()=>{
        cy.get("[data-cy=bu-filter-btn]").click()
        cy.get("[data-cy=bu-filter-options-list] > .v-list-item").should('have.length', 4)
    })
    
    it('validating-all-filters',()=>{
        cy.get("[data-cy=bu-filter-btn]").click()
        cy.get("[data-cy=bu-filter-options-list]").children().should(($el)=>{
            const filters = $el.map((i, el) => {
                return Cypress.$(el).text()
              })
              expect(filters.get()).to.deep.equal( ['DisplayName','buID','state','No of Managers'])
              
        })
    })

    

})