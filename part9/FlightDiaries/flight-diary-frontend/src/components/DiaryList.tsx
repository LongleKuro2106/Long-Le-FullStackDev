import React from 'react';
import { Diaries } from '../types';
interface DiaryListProps {
  diaries: Diaries[];
};

const DiaryList: React.FC<DiaryListProps> = ({ diaries }) => {
  return (
    <div>
      <h3> Diary Entries </h3>
      <ul>
      {diaries.map(diary => (
        <li key={diary.id}>
            <h4>{diary.date}</h4>
            visibility: {diary.visibility}
            <br/>
            weather: {diary.weather}
            <br/>
            {diary.comment}
        </li>
      ))}
      </ul>
    </div>

  );
};

export default DiaryList;