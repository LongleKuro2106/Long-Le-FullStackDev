import { useQuery, useApolloClient } from '@apollo/client';
import { useState } from 'react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Notify from './components/Notify';

import { ALL_BOOKS, ALL_AUTHORS } from './queries';

const App = () => {
  const client = useApolloClient();
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const { loading, data } = useQuery(ALL_BOOKS);
  const { data: authorsData } = useQuery(ALL_AUTHORS);

  if (loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const handleLogin = (token, genre) => {
    setToken(token);
    setFavoriteGenre(genre);
    localStorage.setItem('library-user-token', token);
  };

  const handleBookAdded = () => {
    setPage('books');
  };

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={handleLogin} setError={notify} />
      </>
    );
  }
  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      <button onClick={() => setPage('add')}>add book</button>
      <button onClick={logout}>logout</button>
      <Authors show={page === 'authors'} authors={authorsData.allAuthors} />
      <Books show={page === 'books'} books={data.allBooks} favoriteGenre={favoriteGenre} />
      <NewBook show={page === 'add'} setError={notify} onBookAdded={handleBookAdded} />
    </div>
  );
};

export default App;