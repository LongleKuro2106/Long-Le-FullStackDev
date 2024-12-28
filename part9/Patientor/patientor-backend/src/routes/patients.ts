import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { NewPatient, NonSensitivePatient } from '../types';
import { toNewPatient, NewPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  const nonSensitivePatients: NonSensitivePatient[] = patientService.getNonSensitivePatients();
  res.json(nonSensitivePatients);
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

// Middleware for validating the new patient request
const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

// Error handling middleware
const errorMiddleware = ((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
});


router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response) => {
  const addedPatient = patientService.addPatient(toNewPatient(req.body));
  res.status(201).json(addedPatient);
});


router.use(errorMiddleware);

export default router;