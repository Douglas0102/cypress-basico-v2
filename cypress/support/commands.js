Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Douglas')
    cy.get('#lastName').type('Santos')
    cy.get('#email').type('douglas.alves.andradee@gmail.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})