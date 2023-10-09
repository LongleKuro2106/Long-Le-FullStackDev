import React from 'react';

const Persons = ({ persons, searchTerm, handleDelete }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {person.name}  {person.number}
          <button onClick={() => handleDelete(person.id)}> Delete </button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;