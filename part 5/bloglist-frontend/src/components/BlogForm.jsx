import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = ({
      title: title,
      author: author,
      url: url,
    })
  
    createBlog(blogObject)
  }
  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title
        <input
          type="text"
          name="title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Enter title"  // Added for testing
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
          value={author}
          onChange={event => setAuthor(event.target.value)}
          placeholder="Enter author"  // Added for testing
        />
      </div>
      <div>
        url
        <input
          type="text"
          name="url"
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder="Enter URL"  // Added for testing
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm