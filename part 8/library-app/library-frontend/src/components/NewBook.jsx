import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK, ALL_BOOKS } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genres, setGenres] = useState('');

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      props.setError('Error adding book');
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook;
      const existingBooks = cache.readQuery({ query: ALL_BOOKS });
      cache.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: existingBooks.allBooks.concat(addedBook) },
      });
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const newBook = {
      title,
      author,
      published: Number(published),
      genres: genres.split(',').map(genre => genre.trim())
    };
    await createBook({ variables: newBook });
    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres('');
    props.onBookAdded(); // Call the function to switch to the books page
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          genres (comma separated)
          <input
            value={genres}
            onChange={({ target }) => setGenres(target.value)}
          />
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;