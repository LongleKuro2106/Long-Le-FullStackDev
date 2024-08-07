const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Busy not Hurried',
    author: 'NewBreak',
    url: 'https://newbreak.church/busy-not-hurried/',
    likes: 3,
  }
]

const initialUsers = [
  {
      username: 'Long',
      name: 'Long Le',
      password: 'tamk1234'
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, blogsInDB, usersInDB
}