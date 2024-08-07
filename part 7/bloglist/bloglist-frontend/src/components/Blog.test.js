import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
  const blog = {
    title: "What Booksellers Can Teach Us About Reading, Writing and Publishing",
    author: "Will Mountain Cox",
    url: 'https://lithub.com/what-booksellers-can-teach-us-about-reading-writing-and-publishing/',
    likes: 6
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('What Booksellers Can Teach Us About Reading, Writing and Publishing')
  const author = screen.getByText('Will Mountain Cox')
  const url = screen.queryByText('https://lithub.com/what-booksellers-can-teach-us-about-reading-writing-and-publishing/')
  const likes = screen.queryByText(/likes 6/)

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('shows URL and likes when the view button is clicked', async () => {
    const blog = {
      title: "Example Title",
      author: "Example Author",
      url: 'http://example.com',
      likes: 1,
      user: { username: 'testuser' }
    }

    render(<Blog blog={blog} user={{ username: 'testuser' }} />)
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('http://example.com')
    const likes = screen.getByText(/likes 1/)

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('like button is clicked twice, event handler is called twice', async () => {
    const blog = {
      title: "Example Title",
      author: "Example Author",
      url: 'http://example.com',
      likes: 1,
      user: { username: 'testuser' },
      id: 'blog123'
    }
    const mockHandler = jest.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} user={{ username: 'testuser' }} />)
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })



