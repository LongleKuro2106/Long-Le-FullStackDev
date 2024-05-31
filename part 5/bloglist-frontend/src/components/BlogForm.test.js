import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Enter title')
  const authorInput = screen.getByPlaceholderText('Enter author')
  const urlInput = screen.getByPlaceholderText('Enter URL')
  const sendButton = screen.getByRole('button', { name: 'create' })

  await user.type(titleInput, 'New Blog Title')
  await user.type(authorInput, 'New Author')
  await user.type(urlInput, 'http://newblog.com')
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Author',
    url: 'http://newblog.com'
  })
})