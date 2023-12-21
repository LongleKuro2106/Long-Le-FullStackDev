const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

    if (deletedBlog) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const blogId = request.params.id;
  const { title, author, url, likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, author, url, likes },
      { new: true } // returns the updated blog
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error(error);
    response.status(400).json({ error: 'Invalid data format' });
  }
});


module.exports = blogsRouter;
