import patients from '../../data/patients';
import { NonSensitivePatient, Patient, NewPatient, Entry, EntryWithoutId } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patients.map(({ ssn, ...rest }) => rest);
};


const findById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    ssn: patient.ssn ?? '',
    gender: patient.gender,
    occupation: patient.occupation,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = findById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Generate a new ID for the entry
  const newEntry: Entry = {
    id: uuid(),
    ...entry, // Ensure the new entry has an ID
    diagnosisCodes: entry.diagnosisCodes || [], // Ensure diagnosisCodes is an array
  };

  patient.entries.push(newEntry); // Add the new entry to the patient's entries
  return newEntry; // Return the added entry
};

export default {
  getPatients,
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry
};