import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { Diagnosis, Entry, EntryWithoutId, NewPatient, NonSensitivePatient } from '../types';
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

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

router.post('/:id/entries', (req: Request<{ id: string }, unknown, Entry>, res: Response) => {
  const patientId = req.params.id;
  const entry = req.body;

  // Extract diagnosis codes using the parser
  const diagnosisCodes = parseDiagnosisCodes(entry);

  // Validate entry type and required fields
  switch (entry.type) {
    case "HealthCheck": {
      const healthCheckEntry: EntryWithoutId = {
        ...entry,
        diagnosisCodes,
      };
      patientService.addEntry(patientId, healthCheckEntry);
      return res.status(201).json(healthCheckEntry);
    }

    case "Hospital": {
      const hospitalEntry: EntryWithoutId = {
        ...entry,
        diagnosisCodes,
      };
      patientService.addEntry(patientId, hospitalEntry);
      return res.status(201).json(hospitalEntry);
    }

    case "OccupationalHealthcare": {
      const occupationalEntry: EntryWithoutId = {
        ...entry,
        diagnosisCodes,
      };
      patientService.addEntry(patientId, occupationalEntry);
      return res.status(201).json(occupationalEntry);
    }

    default:
      return res.status(400).send({ error: 'Invalid entry type' });
  }
});


export default router;