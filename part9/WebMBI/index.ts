import express from 'express';
import { getBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get('/hello', ( _req, res) => {
    res.send('Hello Full Stack!');
});


app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;
    const result = getBmi(height as string, weight as string);
    if (result.error) {
        return res.status(400).json(result);
    }
    return res.json(result);
});

app.post('/exercises', (req, res) => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const { daily_exercises, target }: any = req.body;

    if (!daily_exercises || !target) {
        return res.status(400).json({ error: "parameters missing" });
    }

    if (!Array.isArray(daily_exercises) || typeof target !== 'number') {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = calculateExercises({ daily_exercises, target });
    return res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});