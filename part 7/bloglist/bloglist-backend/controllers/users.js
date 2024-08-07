const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
})


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    if (!username || !password) {
        return response.status(400).json({ message: 'Username or password is missing!' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ message: 'Username and password must be at least 3 characters long.' })
    }

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

})

module.exports = usersRouter