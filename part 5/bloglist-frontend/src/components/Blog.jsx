import { useState } from "react"

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
        <span className="blogTitle">{blog.title}</span> <span className="blogAuthor">{blog.author}</span>
        <button onClick={handleToggleDetails}>{showDetails ? 'hide' : 'view'}</button>
        {showDetails && (
          <div>
            <p className="blogUrl">{blog.url}</p>
            <p className="blogLikes">likes {blog.likes} <button onClick={() => updateBlog(blog.id, {...blog, likes: blog.likes + 1})}>like</button></p>
            {user && user.username === blog.user.username && <button onClick={() => deleteBlog(blog.id)}>remove</button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog