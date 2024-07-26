import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import anecdoteService from '../service/anecdotes';
import { useNotification } from '../context/NotificationContext';

const AnecdoteList = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1
  });

  const voteMutation = useMutation({
    mutationFn: (id) => {
      const anecdote = anecdotes.find(a => a.id === id);
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
      return anecdoteService.update(id, updatedAnecdote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes']);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Anecdote service not available due to problems in server</div>;
  }

  const handleVote = (id) => {
    voteMutation.mutate(id);
    const anecdote = anecdotes.find(a => a.id === id);
    dispatch({ type: 'SET_NOTIFICATION', payload: `You voted '${anecdote.content}'` });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;