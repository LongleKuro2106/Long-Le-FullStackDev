import { useMutation, useQueryClient } from '@tanstack/react-query';
import anecdoteService from '../service/anecdotes';
import { useNotification } from '../context/NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries(['anecdotes']);
      dispatch({ type: 'SET_NOTIFICATION', payload: `You added '${newAnecdote.content}'` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: `Error: ${error.response.data.error}` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    if (content.length >= 5) {
      newAnecdoteMutation.mutate(content);
    } else {
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Anecdote content must be at least 5 characters long' });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;