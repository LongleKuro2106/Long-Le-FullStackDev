const listHelper = require('../utils/list_helper');

describe('total likes', () => {
  test('of empty list is 0', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that blog', () => {
    const blogs = [
      {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 10,
      },
    ];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(10);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        title: 'Blog 1',
        author: 'Author A',
        likes: 5,
      },
      {
        title: 'Blog 2',
        author: 'Author B',
        likes: 10,
      },
      {
        title: 'Blog 3',
        author: 'Author A',
        likes: 3,
      },
    ];
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(18);
  });
});

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });

  test('when list has only one blog, equals that blog', () => {
    const blogs = [
      {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 10,
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: 'Test Blog',
      author: 'Test Author',
      likes: 10,
    });
  });

  test('of a bigger list is the one with the most likes', () => {
    const blogs = [
      {
        title: 'Blog 1',
        author: 'Author A',
        likes: 5,
      },
      {
        title: 'Blog 2',
        author: 'Author B',
        likes: 10,
      },
      {
        title: 'Blog 3',
        author: 'Author A',
        likes: 15,
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: 'Blog 3',
      author: 'Author A',
      likes: 15,
    });
  });
});
describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  });

  test('when list has only one blog, equals the author of that blog', () => {
    const blogs = [
      {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 10,
      },
    ];
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: 'Test Author', blogs: 1 });
  });

  test('of a bigger list is the author with the most blogs', () => {
    const blogs = [
      {
        title: 'Blog 1',
        author: 'Author A',
        likes: 5,
      },
      {
        title: 'Blog 2',
        author: 'Author B',
        likes: 10,
      },
      {
        title: 'Blog 3',
        author: 'Author A',
        likes: 15,
      },
    ];
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: 'Author A', blogs: 2 });
  });
});

describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(null);
  });

  test('when list has only one blog, equals the author of that blog', () => {
    const blogs = [
      {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 10,
      },
    ];
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: 'Test Author', likes: 10 });
  });

  test('of a bigger list is the author with the most likes', () => {
    const blogs = [
      {
        title: 'Blog 1',
        author: 'Author A',
        likes: 5,
      },
      {
        title: 'Blog 2',
        author: 'Author B',
        likes: 10,
      },
      {
        title: 'Blog 3',
        author: 'Author A',
        likes: 15,
      },
    ];
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: 'Author A', likes: 20 });
  });
});



