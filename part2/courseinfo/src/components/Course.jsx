import React from 'react';

const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <strong>total of {totalExercises} exercises</strong>
    </div>
  );
};

export default Course;
