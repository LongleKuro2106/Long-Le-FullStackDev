import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'


const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    const usersWithBlogs = await Promise.all(users.map(async user => {
      const blogs = await userService.getByUser(user.id)
      return { ...user, blogs }
    }))
    dispatch(setUsers(usersWithBlogs))
  }
}

export default usersSlice.reducer