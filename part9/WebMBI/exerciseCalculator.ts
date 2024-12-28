interface ExerciseInput {
  daily_exercises: number[];
  target: number;
}

interface ExerciseOutput {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises({ daily_exercises, target }: ExerciseInput): ExerciseOutput {
  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.filter(exercise => exercise > 0).length;
  const average = daily_exercises.reduce((sum, exercise) => sum + exercise, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
      rating = 3;
      ratingDescription = "good";
  } else if (average >= target * 0.75) {
      rating = 2;
      ratingDescription = "not too bad but could be better";
  } else {
      rating = 1;
      ratingDescription = "bad";
  }

  return {
      periodLength,
      trainingDays,
      success,
      rating,
      ratingDescription,
      target,
      average,
  };
}

export { calculateExercises };