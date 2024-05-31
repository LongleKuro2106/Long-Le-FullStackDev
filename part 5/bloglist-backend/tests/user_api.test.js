const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('user has invalid username is not added', async() => {
    const userToAdd ={
        username: '21',
        name: 'Hoang Nguyen',
        password: 'super123'
    }

    await api
        .post('/api/users')
        .send(userToAdd)
        .expect(400)
    
    const usersAtEnd = await helper.usersInDB()
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).not.toContain(userToAdd.username)
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

test('user has invalid password is not added', async() => {
    const userToAdd ={
        username: 'noobdestroyer',
        name: 'Mr hello',
        password: '21'
    }

    await api
        .post('/api/users')
        .send(userToAdd)
        .expect(400)
    
    const usersAtEnd = await helper.usersInDB()
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).not.toContain(userToAdd.username)
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
})

})