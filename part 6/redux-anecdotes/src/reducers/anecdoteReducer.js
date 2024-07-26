import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import anecdoteService from '../service/anecdotes';

const initialState = [];

export const initializeAnecdotes = createAsyncThunk(
  'anecdotes/fetchAll',
  async () => {
    const anecdotes = await anecdoteService.getAll();
    return anecdotes;
  }
);

export const createAnecdote = createAsyncThunk(
  'anecdotes/createNew',
  async (content) => {
    const newAnecdote = await anecdoteService.createNew(content);
    return newAnecdote;
  }
);

export const voteAnecdote = createAsyncThunk(
  'anecdotes/vote',
  async (id, { getState }) => {
    const anecdote = getState().anecdotes.find(a => a.id === id);
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    await anecdoteService.update(id, updatedAnecdote);
    return updatedAnecdote;
  }
);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAnecdotes.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(voteAnecdote.fulfilled, (state, action) => {
        const index = state.findIndex(anecdote => anecdote.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  }
});

export default anecdoteSlice.reducer;