import { useState } from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const totalGrade = good + neutral - bad;
  const totalVote = good + neutral + bad;

  if (totalVote === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="Total" value={totalVote} />
          <StatisticLine text="Average" value={(totalGrade / totalVote).toFixed(2)} />
          <StatisticLine text="Positive" value={`${((good / totalVote) * 100).toFixed(2)}%`} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast is to go well.'
  ];

  const initialVotes = new Array(anecdotes.length).fill(0);
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(initialVotes);
  const [mostVotedIndex, setMostVotedIndex] = useState(0);

  const getRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    const votesCopy = [...votes];
    votesCopy[selected] += 1;
    setVotes(votesCopy);
    if (mostVotedIndex === null || votesCopy[selected] > votesCopy[mostVotedIndex]) {
      setMostVotedIndex(selected);
    }
  };


  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="Good" onClick={() => setGood(good + 1)} />
      <Button text="Neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="Bad" onClick={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />


      <h1>Software Engineering Anecdotes</h1>
      <p>{anecdotes[selected]}</p>
      <p>Votes: {votes[selected]}</p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={getRandomAnecdote}>Next Anecdote</button>

      {mostVotedIndex !== null ? (
        <>
          <h1>Anecdote with the Most Votes</h1>
          <p>{anecdotes[mostVotedIndex]}</p>
          <p>Votes: {votes[mostVotedIndex]}</p>
        </>
      ) : (
        <p>No vote has been given</p>
      )}
      
    </div>
  );
};

export default App;
