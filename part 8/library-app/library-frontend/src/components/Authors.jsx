import { useState } from "react";
import Select from 'react-select';
import { useMutation } from '@apollo/client';
import { UPDATE_AUTHOR_BORN_YEAR, ALL_AUTHORS } from '../queries';

const Authors = (props) => {
  if (!props.show) {
    return null;
  }

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [newBirthYear, setNewBirthYear] = useState('');

  const [updateAuthorBornYear] = useMutation(UPDATE_AUTHOR_BORN_YEAR, {
    onError: (error) => {
      console.error(error);
    },
    onCompleted: (data) => {
      const updatedAuthor = data.updateAuthorBornYear;
      props.authors = props.authors.map(author =>
        author.name === updatedAuthor.name ? updatedAuthor : author
      );
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedAuthor) {
      const bornYear = newBirthYear === '' ? null : Number(newBirthYear);
      await updateAuthorBornYear({ variables: { name: selectedAuthor.value, born: bornYear } });
      setNewBirthYear('');
      setSelectedAuthor(null);
    }
  };

  const authorOptions = props.authors.map(author => ({
    value: author.name,
    label: author.name
  }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born !== null ? a.born : ''}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <Select
          options={authorOptions}
          value={selectedAuthor}
          onChange={setSelectedAuthor}
          placeholder="Select an author"
        />
        <input
          type="number"
          value={newBirthYear}
          onChange={({ target }) => setNewBirthYear(target.value)}
          placeholder="Enter new birth year"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Authors;