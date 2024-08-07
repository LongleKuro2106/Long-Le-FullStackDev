import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    },
    removeBlogFromState(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlogFromState } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch, getState) => {
    const user = getState().user
    if (user && user.token) {
      blogService.setToken(user.token)
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
    } else {
      console.error('User is not logged in or token is missing')
    }
  }
}

export const likeBlog = (id, blogObject) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(id, blogObject)
    dispatch(updateBlog(updatedBlog))
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlogFromState(id))
  }
}

export default blogSlice.reducer