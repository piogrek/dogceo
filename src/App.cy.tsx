import React from 'react'
import App from './App'

describe('<App />', () => {
    it('Select a breed + errors', () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(<App/>)

        cy.get('[data-testid="breed"]').click()

        cy.get('li').contains('akita').click()
        cy.get('[role=alert]').should('have.length', 0)
        cy.get('button').contains(/view images/i).click()
        cy.get('[role=alert]').should('have.length', 1)
        cy.contains("Please enter number of images to show").should('be.visible')

    })
    it('Select sub breed and show images', () => {
        cy.mount(<App/>)

        cy.get('[data-testid="breed"]').click()
        cy.get('li').contains('akita').click()

        // sub breed should be hidden
        cy.get('[data-testid="sub-breed"]').should('have.length', 0)


        cy.get('[data-testid="breed"]').click()
        cy.get('li').contains('mastiff').click()
        // sub breed should be hidden
        cy.get('[data-testid="sub-breed"]').should('have.length', 1)

        // test error message
        cy.get('[role=alert]').should('have.length', 0)
        cy.get('button').contains(/view images/i).click()
        cy.get('[role=alert]').should('have.length', 1)
        cy.contains("Please select dog sub-breed for mastiff").should('be.visible')

        cy.get('[data-testid="sub-breed"]').click()
        cy.get('li').contains('bull mastiff').click()

        cy.get('[data-testid="no-images"]').click()
        cy.get('li').contains('1').click()
        cy.get('img').should('have.length', 0)
        cy.get('button').contains(/view images/i).click()

        cy.get('img').should('have.length', 1)


    })
})