import { useState } from "react"
import { Link } from 'react-router-dom'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const increaseLike = () => {
    const newBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
    }
    updateBlog(blog.id, newBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          <span className="blogTitle">{blog.title}</span> <span className="blogAuthor">{blog.author}</span>
        </Link>
      </div>
    </div>
  )
}

export default Blog