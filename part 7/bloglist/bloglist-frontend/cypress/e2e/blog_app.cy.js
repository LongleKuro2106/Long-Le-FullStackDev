describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const anotherUser = {
      name: 'John Doe',
      username: 'jdoe',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
  })

  it('Login form is shown', function() {
    cy.visit('')
    cy.contains('log in').click()
  })


  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Why Your Next Vacation Needs to Be at An All-Inclusive')
      cy.get('#author').type('Alicia Valenski')
      cy.get('#url').type('https://www.theskimm.com/shopping/all-inclusive-resorts')

      cy.get('#create-new-blog').click()
      cy.contains('Why Your Next Vacation Needs to Be at An All-Inclusive')
    })

    it('users can like a blog', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Why Your Next Vacation Needs to Be at An All-Inclusive')
      cy.get('#author').type('Alicia Valenski')
      cy.get('#url').type('https://www.theskimm.com/shopping/all-inclusive-resorts')

      cy.get('#create-new-blog').click()


      cy.contains('view').click()
      cy.get('.blogLikes').then(($likes) => {
        const initialLikes = parseInt($likes.text().match(/likes (\d+)/)[1])
        cy.get('.blogLikes button').click()
        cy.get('.blogLikes').should('contain', `likes ${initialLikes + 1}`)
      })
    })

    it('user who created a blog can delete it', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Temporary Blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('https://example.com')

      cy.get('#create-new-blog').click()
      cy.contains('Temporary Blog')

      cy.contains('view').click()
      cy.contains('remove').click()

      cy.on('window:confirm', () => true)

      cy.get('html').should('not.contain', 'Temporary Blog')
    })

    it('another user cannot see the delete button', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Temporary Blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('https://example.com')

      cy.get('#create-new-blog').click()
      cy.contains('Temporary Blog')

      cy.contains('logout').click()

      cy.contains('log in').click()
      cy.get('#username').type('jdoe')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Temporary Blog').click()
      cy.contains('view').click()
      cy.get('button').contains('remove').should('not.exist')
    })

    it('blogs are ordered by likes, with the most liked blog being first', function() {

      cy.contains('create new blog').click()
      cy.get('#title').type('First Blog')
      cy.get('#author').type('Author One')
      cy.get('#url').type('https://example.com/first')
      cy.get('#create-new-blog').click()

      cy.contains('create new blog').click()
      cy.get('#title').type('Second Blog')
      cy.get('#author').type('Author Two')
      cy.get('#url').type('https://example.com/second')
      cy.get('#create-new-blog').click()


      cy.contains('Second Blog').parent().find('button').contains('view').click()
      cy.contains('Second Blog').parent().find('button').contains('like').click()
      cy.wait(500)
      cy.contains('Second Blog').parent().find('button').contains('like').click()
      cy.wait(500)


      cy.contains('First Blog').parent().find('button').contains('view').click()
      cy.contains('First Blog').parent().find('button').contains('like').click()
      cy.wait(500)

      cy.get('.blog').eq(0).should('contain', 'Second Blog')
      cy.get('.blog').eq(1).should('contain', 'First Blog')
    })

   })
})