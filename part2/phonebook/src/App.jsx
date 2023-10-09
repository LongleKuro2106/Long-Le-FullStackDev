import React, { useState, useEffect } from 'react';
import personsService from './services/persons';
import Persons from './components/Persons';
import Notification from './components/Notification';

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      Filter shown with:
      <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const confirmMessage = `Delete ${personToDelete.name}?`;

    if (window.confirm(confirmMessage)) {
      personsService.remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
      }
    }


  useEffect(() => {
    personsService.getAll()
      .then(data => setPersons(data))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
  
    if (existingPerson) {
      const confirmMessage = `${newName} is already in the phonebook. Replace the old number with the new one?`;
  
      if (window.confirm(confirmMessage)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        personsService.update(existingPerson.id, updatedPerson)
          .then((updatedData) => {
            setPersons(persons.map((person) =>
              person.id === updatedData.id ? updatedData : person
            ));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${updatedData.name}'s number`);
          })
          .catch(error => {
            console.error('Error updating person:', error);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
  
      personsService.create(personObject)
        .then(data => {
          setPersons([...persons, data]);
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${data.name}`);
        })
        .catch(error => {
          console.error('Error adding a new person:', error);
        });
    }
  };
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000); 
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter searchTerm={searchTerm} handleSearchChange={(event) => setSearchTerm(event.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(event) => setNewName(event.target.value)}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
        handleSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} searchTerm={searchTerm} handleDelete={handleDelete} />
    </div>
  );
};

export default App
