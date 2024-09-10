import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('');

  const { loading: loadingAllBooks, error: errorAllBooks, data: dataAllBooks } = useQuery(ALL_BOOKS);
  const { loading: loadingBooksByGenre, error: errorBooksByGenre, data: dataBooksByGenre } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: selectedGenre === '',
  });

  const genres = [...new Set(dataAllBooks ? dataAllBooks.allBooks.map(b => b.genres).flat() : [])];

  let filteredBooks = [];
  if (loadingAllBooks) {
    filteredBooks = [];
  } else if (errorAllBooks) {
    return <div>Error: {errorAllBooks.message}</div>;
  } else if (selectedGenre === '') {
    filteredBooks = dataAllBooks ? dataAllBooks.allBooks : [];
  } else if (loadingBooksByGenre) {
    filteredBooks = [];
  } else if (errorBooksByGenre) {
    return <div>Error: {errorBooksByGenre.message}</div>;
  } else {
    filteredBooks = dataBooksByGenre ? dataBooksByGenre.allBooks : [];
  }

  useEffect(() => {
    if (props.favoriteGenre) {
      setSelectedGenre(props.favoriteGenre);
    }
  }, [props.favoriteGenre]);

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>
      <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
        <option value="">All genres</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;