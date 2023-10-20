const mongoose = require('mongoose');
require('dotenv').config()

const Person = require('./models/person')
const password = process.env.MONGODB_URI;

mongoose.connect(password, { useNewUrlParser: true, useUnifiedTopology: true });


if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const person = new Person({
    name: newName,
    number: newNumber,
  });

  person.save().then(() => {
    console.log(`Added ${newName} number ${newNumber} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments. Please provide password, name, and number.');
  process.exit(1);
}
