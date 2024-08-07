import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'

const BlogView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const user = useSelector(state => state.user)
  const [comments, setComments] = useState('')
  const [blogComments, setBlogComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await blogService.getComments(id)
      setBlogComments(comments)
    }
    fetchComments()
  }, [id])

  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeBlog(blog.id, { ...blog, likes: blog.likes + 1 }))
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
    }
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    const newComment = { content: comments }
    await blogService.addComment(blog.id, newComment)
    setBlogComments(blogComments.concat(newComment))
    setComments('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>{blog.likes} likes <button onClick={handleLike}>like</button></div>
      <div>added by {blog.user.name}</div>
      {user && user.username === blog.user.username && (
        <button onClick={handleRemove}>remove</button>
      )}
      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comments}
          onChange={({ target }) => setComments(target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {blogComments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView