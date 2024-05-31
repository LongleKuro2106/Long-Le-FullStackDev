const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('favorite blog', () => {
  const blogWithMostLike = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]
  test('finds blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogWithMostLike)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})

describe('most blogs', () => {
  const mostBlogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: 'Busy not Hurried',
      author: 'NewBreak',
      url: 'https://newbreak.church/busy-not-hurried/',
      likes: 3,
    }
  ]

  test('finds author with most blogs', () => {
    const result = listHelper.mostBlogs(mostBlogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 2
    })
  })
})

describe('most likes', () => {
  const mostLikes = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }
  ]
  test('finds author with most likes', () => {
    const result = listHelper.mostLikes(mostLikes)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})