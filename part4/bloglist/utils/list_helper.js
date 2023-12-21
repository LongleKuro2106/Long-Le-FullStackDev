const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});
  const maxAuthor = Object.keys(blogCounts).reduce((a, b) =>
    blogCounts[a] > blogCounts[b] ? a : b
  );
  return { author: maxAuthor, blogs: blogCounts[maxAuthor] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const likeCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    return counts;
  }, {});
  const maxAuthor = Object.keys(likeCounts).reduce((a, b) =>
    likeCounts[a] > likeCounts[b] ? a : b
  );
  return { author: maxAuthor, likes: likeCounts[maxAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
