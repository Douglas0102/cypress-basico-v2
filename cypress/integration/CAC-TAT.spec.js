/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    beforeEach(function () {
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
        // Aqui estou fazendo apenas uma verificação do texto do site
    })

    it('preenche os campos obrigatórios e envia o formulário,', function () {
        const longText = 'Teste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, testeTeste, teste, teste, teste'
        cy.get('#firstName').type('Douglas')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('douglas.alves.andradee@gmail.com')
        cy.get('#phone').type('11992061750')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        //Quando usamos um texto longo eu posso utilizar o {delay:0}
        cy.contains('button', 'Enviar').click()
        //Nesse eu coloco button e depois o type do button

        cy.get('.success').should('be.visible')
        // .success é o nome da classe da caixa que é exibida quando aparece a mensagem que foi enviado com sucesso o formulário
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#firstName').type('Douglas')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('douglas.alves.andradee@gmail,com') //coloquei uma virgula
        cy.get('#phone').type('11992061750')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-número', function () {
        cy.get('#phone')
            .type('sdweferfe')
            .should('be.value', '')

        // tento colocar um texto em um campo que é apenas numérico e depois verifico
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Douglas')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('douglas.alves.andradee@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Douglas')
            .should('have.value', 'Douglas')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Santos')
            .should('have.value', 'Santos')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('douglas.alves.andradee@gmail.com')
            .should('have.value', 'douglas.alves.andradee@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#open-text-area')
            .type('teste')
            .should('have.value', 'teste')
            .clear()
            .should('have.value', '')

        //após digitar o texto, podemos verificar e após isso limpar com o clear
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()
        //Aqui eu fiz um comando por fora e chamei apenas com o nome que criei

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
        // Quando temos campo de seleção com multiplas escolhas podemos utilizar o select, nesse exemplo foi selecionando pelo texto
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
        // aqui eu uso o número 1 pra pegar a primeira opção do select
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3) //quando eu pego um elemento que tem mais de 1 item, posso verificar a quantidade se está correto
            .each(function ($radio) { //each passa por cada elemento
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
                //Aqui seleciono as 3 opções e check que deu certo selecionar cada um
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check() // Peguei o seletor com dois check boxes, usando o check vai selecionar os dois juntos
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')//verifico se está desabilidado o check ou não
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]#file-upload')//posso misturar o tipo do locator 
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json') //inserindo arquivo em local de anexo
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json') //verifico se foi anexo o arquivo com nome "example.json"
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]#file-upload')//posso misturar o tipo do locator 
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' }) //Aqui simulo quando o usuario arasta um arquivo para anexar
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json') //verifico se foi anexo o arquivo com nome "example.json"
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
            .selectFile('@sampleFile') //Usa @ pra dizer que é um Alias
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank') //Quando temos um elemento que abre uma tela nova, ela possui um atributo target=_blank
    })      //então aqui estou fazendo uma verificação, "attr" = atributo 

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //Aqui estou removendo o atributo target que faz com que quando eu clico abre uma nova janela...
            .click() // Nesse caso eu clico e a nova tela aparece na mesma tela do Cypress
    
        cy.contains('Talking About Testing').should('be.visible') //verificando se existe esse texto na nova página
        })

   it('')
})
