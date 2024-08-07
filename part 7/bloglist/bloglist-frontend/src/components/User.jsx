import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'

const User = () => {
  const { id } = useParams()
  const user = useSelector(state => state.users.find(u => u.id === id))

  if (!user) {
    return null
  }

  return (
    <Container>
          <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
    </Container>

  )
}

export default User