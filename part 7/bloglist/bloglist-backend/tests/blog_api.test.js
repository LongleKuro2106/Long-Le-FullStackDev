const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some notes saved', () => {
  test('blogs are returned as json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    expect(title).toContain(
      'Go To Statement Considered Harmful'
    )
  })

  //need to find a way to authorize in the test to add
  // test('adding a new blog', async () => {
  //   const newBlog = {
  //     title: 'Whos hustling Why What else is there',
  //     author: 'doc Martha',
  //     url: 'https://www.docmartha.org/blog-posts/whos-hustling',
  //     likes: 6,
  //   }

  //   await api 
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)

  //     const blogsAtEnd = await helper.blogsInDB()
  //     expect(blogsAtEnd.includes(newBlog))
  //     expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  // })


  test('update a blog', async() => {
    const existingBlogs = await helper.blogsInDB()
    const blogToBeUpdated = existingBlogs[1]
    console.log(blogToBeUpdated.id)
    const updatedData = {
        likes: 278
    }

    const response = await api
        .put(`/api/blogs/${blogToBeUpdated.id}`)
        .send(updatedData)
        .expect(200)
    
    expect(response.body.likes).toBe(updatedData.likes)
  })

  test('identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const keys = response.body.map((blog) => {
        return 'id' in blog
    })
    expect(keys.includes(false)).toBe(false)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(404)
  })

  // test('blog without like will default to the value 0', async () => {
  //   const newBlog = {
  //       title: 'What Booksellers Can Teach Us About Reading, Writing and Publishing',
  //       author: 'Will Mountain Cox',
  //       url: 'https://lithub.com/what-booksellers-can-teach-us-about-reading-writing-and-publishing/',
  //   }

  //   const response = await api
  //       .post('/api/blogs',)
  //       .send(newBlog)
  //       .expect(201)

  //   expect(response.body.likes).toBe(0)
  // })

  // test('blog without title or url properties', async () => {
  //   const newBlog1 = {
  //       author: 'Will Mountain Cox',
  //       url: 'https://lithub.com/what-booksellers-can-teach-us-about-reading-writing-and-publishing/'
  //   }

  //   const newBlog2 = {
  //       title: 'What Booksellers Can Teach Us About Reading, Writing and Publishing',
  //       author: 'Will Mountain Cox'
  //   }

  //   await api
  //       .post('/api/blogs',)
  //       .send(newBlog1)
  //       .expect(400)

  //   await api
  //       .post('/api/blogs',)
  //       .send(newBlog2)
  //       .expect(400)
  //   },10000) 
})

describe('deletion of a blog', () => {
  test('deleting blog', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDB()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})