const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let initialBooks = [
  {
    title: "Clean code",
    author: "Robert Martin",
    published: 2008
  },
  {
    title: "Agile software development",
    author: "Robert Martin",
    published: 2002
  },
  {
    title: "Refactoring, edition 2",
    author: "Martin Fowler",
    published: 2018
  },
  {
    title: "Refactoring to patterns",
    author: "Joshua Kerievsky",
    published: 2008
  },
  {
    title: "Practical Object-Oriented Design, An agile Primer Using Ruby",
    author: "Sandi Metz",
    published: 2012
  },
  {
    title: "Crime and punishment",
    author: "Fyodor Dostoevsky",
    published: 1866
  },
  {
    title: "The Demon",
    author: "Fyodor Dostoevsky",
    published: 1872
  },
];

let initialAuthors = [
  {
    name: "Robert Martin",
    born: 1952
  },
  {
    name: "Martin Fowler",
    born: 1963
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821
  },
  {
    name: "Joshua Kerievsky",
    born: null
  },
  {
    name: "Sandi Metz",
    born: null
  },
];

const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    updateAuthorBornYear(
      name: String!
      born: Int
    ): Author!
  }
`

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      const query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author ? author._id : null
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
        const book = new Book({ ...args, author: author._id });
        await book.save();
        return book.populate('author');
      } catch (error) {
        throw new GraphQLError('Error adding book: ' + error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          }
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          });
        });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, `${process.env.JWT_SECRET}`) };
    },
    updateAuthorBornYear: async (root, args) => {
      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.born },
        { new: true }
      );
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        });
      }
      return author;
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), `${process.env.TOKEN_SECRET}`)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

const seedDatabase = async () => {
  await Author.deleteMany({})
  await Book.deleteMany({})
  await User.deleteMany({})

  const authors = await Author.insertMany(initialAuthors)
  const booksWithAuthors = initialBooks.map(book => {
    const author = authors.find(a => a.name === book.author)
    return { ...book, author: author._id }
  });

  await Book.insertMany(booksWithAuthors);
}

seedDatabase().catch(error => {
  console.error('Error seeding database:', error)
})