import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer'
import { Nav } from 'react-bootstrap'
import Container from 'react-bootstrap/Container';

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(showNotification('logged out successfully', 'success'))
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(showNotification('a new blog added', 'success'))
  }

  const handleUpdateBlog = (id, blogObject) => {
    dispatch(likeBlog(id, blogObject))
  }

  const handleRemoveBlog = (id) => {
    if (window.confirm('Do you really want to remove this blog?')) {
      dispatch(removeBlog(id))
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </div>
    )
  }

  return (
    <Router>

      <div>
        <h2>Blogs</h2>
        <Notification />
        <Nav>
              <Nav.Item>
                <Nav.Link eventkey="1" as={Link} to="/">Blogs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventkey="2" as={Link} to="/users">Users</Nav.Link>
              </Nav.Item>
              <Nav.Item eventkey="3">
              <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
              </Nav.Item>
        </Nav>
        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/" element={
            <BlogList
              blogFormRef={blogFormRef}
              addBlog={addBlog}
              handleUpdateBlog={handleUpdateBlog}
              handleRemoveBlog={handleRemoveBlog}
              user={user}
            />
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App