import { Gender, NewPatient } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().refine(date => Boolean(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  ssn: z.string().optional(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other], {
    message: 'Gender must be male, female, or other',
  }),
  occupation: z.string().min(1, 'Occupation is required'),
  entries: z.array(z.object({})).optional(),
});

export const toNewPatient = (object: unknown): NewPatient => {
  const newPatient = NewPatientSchema.parse(object);
  newPatient.entries = newPatient.entries || [];
  return newPatient;
};