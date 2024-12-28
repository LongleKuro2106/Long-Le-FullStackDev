import React, { useState } from 'react';
import { NewDiaries } from '../types';

interface DiaryFormProps {
  onAddDiary: (diary: NewDiaries) => void;
}


const weatherOptions = [
  { value: 'sunny', label: 'Sunny' },
  { value: 'rainy', label: 'Rainy' },
  { value: 'cloudy', label: 'Cloudy' },
  { value: 'stormy', label: 'Stormy' },
  { value: 'windy', label: 'Windy' },
];
const visibilityOptions = [
  { value: 'great', label: 'Great' },
  { value: 'good', label: 'Good' },
  { value: 'ok', label: 'Ok' },
  { value: 'poor', label: 'Poor' },
];

const DiaryForm: React.FC<DiaryFormProps> = ({ onAddDiary }) => {
  const [newDiary, setNewDiary] = useState<NewDiaries>({
    date: '',
    weather: '',
    visibility: '',
    comment: ''
  });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onAddDiary(newDiary);
    setNewDiary({ date: '', weather: '', visibility: '', comment: '' });
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={newDiary.date}
            onChange={(event) => setNewDiary({ ...newDiary, date: event.target.value })}
            required
          />
        </label>
        <br />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Visibility:</span>
          {visibilityOptions.map(option => (
            <label key={option.value} style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={newDiary.visibility === option.value}
                onChange={(event) => setNewDiary({ ...newDiary, visibility: event.target.value })}
                required
              />
              {option.label}
            </label>
          ))}
        </div>
        <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Weather:</span>
          {weatherOptions.map(option => (
            <label key={option.value} style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="weather"
                value={option.value}
                checked={newDiary.weather === option.value}
                onChange={(event) => setNewDiary({ ...newDiary, weather: event.target.value })}
                required
              />
              {option.label}
            </label>
          ))}
        </div>
        <br />
          <label>
          Comment:
          <input
            type="text"
            value={newDiary.comment}
            onChange={(event) => setNewDiary({ ...newDiary, comment: event.target.value })}
            placeholder="Comment"
          />
        </label>
        <br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default DiaryForm;