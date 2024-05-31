const dummy = (blogs) => {
    return 1;
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0];
  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  }
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };
}

const mostBlogs = (blogs) => {
  const authorFrequency = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  let mostBlogsAuthor = Object.keys(authorFrequency)[0];
  for (let author in authorFrequency) {
    if (authorFrequency[author] > authorFrequency[mostBlogsAuthor]) {
      mostBlogsAuthor = author;
    }
  }

  return {
    author: mostBlogsAuthor,
    blogs: authorFrequency[mostBlogsAuthor]
  };
}

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  let mostLikesAuthor = Object.keys(authorLikes)[0];
  for (let author in authorLikes) {
    if (authorLikes[author] > authorLikes[mostLikesAuthor]) {
      mostLikesAuthor = author;
    }
  }

  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  };
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}