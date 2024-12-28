function calculateBmi(height: number, weight: number): string {
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal range";
  if (bmi < 29.9) return "Overweight";
  return "Obesity";
}

export function getBmi(height: string, weight: string) {
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);

  if (isNaN(heightNum) || isNaN(weightNum) || heightNum <= 0 || weightNum <= 0) {
      return { error: "malformatted parameters" };
  }

  const bmiCategory = calculateBmi(heightNum, weightNum);
  return { weight: weightNum, height: heightNum, bmi: bmiCategory };
}

console.log(calculateBmi(180, 74));