import { useSelector } from 'react-redux'
import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Container } from 'react-bootstrap'

const BlogList = ({ blogFormRef, addBlog, handleUpdateBlog, handleRemoveBlog, user }) => {
  const blogs = useSelector(state => state.blogs)

  return (
    <Container>
          <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog key={blog.id} blog={blog} updateBlog={handleUpdateBlog} deleteBlog={handleRemoveBlog} user={user} />
        ))}
    </div>
    </Container>

  )
}

export default BlogList