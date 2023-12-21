const express = require('express');
const app = express();
const cors = require('cors');

const middleware = require('./utils/middleware');
const config = require('./utils/config');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login')
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
