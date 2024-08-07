import { useState } from "react"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        author
        <input
          id="author"
          type="text"
          name="author"
          value={author}
          onChange={event => setAuthor(event.target.value)}
          placeholder="Enter author"
        />
      </div>
      <div>
        url
        <input
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder="Enter URL"
        />
      </div>
      <button id='create-new-blog' type="submit">create</button>
    </form>
  )
}

export default BlogForm