const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v1: uuid } = require('uuid');

let books = [
  {
    title: "Little Women",
    author: "Louisa May Alcott",
    published: "1868",
    genres: "Coming of age",
    id: uuid()
  },
  {
    title: "Break the Cycle: A Guide to Healing Intergenerational Trauma",
    author: "Mariel Buque",
    published: "2024",
    genres: "Self help",
    id: uuid()
  },
  {
    title: "Death on the nile",
    author: "Agatha Christie",
    published: "1937",
    genres: "Crime novel",
    id: uuid()
  },
  {
    title: "Clean Code",
    author: "Robert Martin",
    published: "2008",
    genres: "refactoring",
    id: uuid()
  },
  {
    title: "Refactoring, edition 2",
    author: "Martin Fowler",
    published: "2018",
    genres: "refactoring",
    id: uuid()
  },
  {
    title: "Refactoring to patterns",
    author: "Joshua Kerievsky",
    published: "2004",
    genres: "refactoring",
    id: uuid()
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    author: "Sandi Metz",
    published: "2013",
    genres: "refactoring",
    id: uuid()
  },
];

let authors = [...new Set(books.map(book => book.author))].map(author => ({
  name: author,
  born: null,
  bookCount: books.filter(book => book.author === author).length
}));

const typeDefs = `
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (parent, args) => {
      let filteredBooks = books;
      if (args.author) {
        filteredBooks = filteredBooks.filter(book => book.author === args.author);
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter(book => book.genres.includes(args.genre));
      }
      return filteredBooks;
    },
    allAuthors: () => authors,
  },
  Mutation: {
    addBook: (parent, args) => {
      const newBook = {
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres,
        id: uuid()
      };
      books.push(newBook);

      const authorExists = authors.find(author => author.name === args.author);
      if (!authorExists) {
        authors.push({
          name: args.author,
          born: null,
          bookCount: 1
        });
      } else {
        authorExists.bookCount += 1;
      }

      return newBook;
    },
    editAuthor: (parent, args) => {
      const author = authors.find(author => author.name === args.name);
      if (author) {
        author.born = args.setBornTo;
        return author;
      }
      return null;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});