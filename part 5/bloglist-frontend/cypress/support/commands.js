Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
      cy.visit('')
    })
  })
  Cypress.Commands.add('createBlog', ({ title, author, url }) => {
    cy.request({
      url: `${Cypress.env('BACKEND')}/blogs`,
      method: 'POST',
      body: { title, author, url },
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
      }
    })

    cy.visit('')
  })