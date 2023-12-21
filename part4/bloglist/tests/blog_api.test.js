const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('Blog API', () => {
  let userId;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    };

    const userResponse = await api.post('/api/users').send(newUser);
    userId = userResponse.body.id;
  });

  test('blogs have property id instead of _id', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      userId,
    };
  
    const response = await api.post('/api/blogs').send(newBlog);
    const savedBlog = response.body;
  
    expect(savedBlog.id).toBeDefined();
    expect(savedBlog._id).toBeUndefined();
  });

  test('a new blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    userId,
  };

  await api.post('/api/blogs').send(newBlog);

  const response = await api.get('/api/blogs');
  const blogs = response.body;

  expect(blogs).toHaveLength(1);
  expect(blogs[0].title).toBe('Test Blog');
});

  test('a new blog without title responds with 400 Bad Request', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
  };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('a new blog without url responds with 400 Bad Request', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 5,
  };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  test('a blog can be deleted', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      userId,
    };

    const response = await api.post('/api/blogs').send(newBlog);
    
    if (response.body.error) {
      throw new Error(`Blog creation failed: ${response.body.error}`);
    }

    const blogId = response.body.id;

    await api.delete(`/api/blogs/${blogId}`).expect(204);

    const blogsAtEnd = await api.get('/api/blogs');
    const titles = blogsAtEnd.body.map(r => r.title);

    expect(titles).not.toContain(newBlog.title);
  });

  test('a blog can be updated', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      userId,
    };

    const response = await api.post('/api/blogs').send(newBlog);
    
    if (response.body.error) {
      throw new Error(`Blog creation failed: ${response.body.error}`);
    }

    const blogId = response.body.id;

    const updatedBlog = {
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://updatedblog.com',
      likes: 10,
    };

    await api.put(`/api/blogs/${blogId}`).send(updatedBlog).expect(200);

    const blogs = await api.get('/api/blogs');
    const updatedBlogInDB = blogs.body.find((blog) => blog.id === blogId);

    expect(updatedBlogInDB).toEqual(expect.objectContaining(updatedBlog));
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  
  
      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword',
      };
  
      const userResponse = await api.post('/api/users').send(newUser);
      userId = userResponse.body.id;
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(async () => {
await mongoose.connection.close()
})