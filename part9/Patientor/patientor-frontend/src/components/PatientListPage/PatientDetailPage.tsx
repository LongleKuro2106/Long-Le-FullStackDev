import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Diagnosis, EntryWithoutId, Entry, HealthCheckEntryWithoutId, HospitalEntryWithoutId, OccupationalHealthcareEntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import { Typography, Paper, CircularProgress, List, ListItem, Button, SelectChangeEvent } from "@mui/material"; // Import SelectChangeEvent
import EntryDetails from './EntryDetails';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryForm from './EntryForm';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState<EntryWithoutId | null>(null);
  const [entryType, setEntryType] = useState<EntryWithoutId['type']>('HealthCheck');
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetchedPatient = await patientService.getById(id!);
        setPatient(fetchedPatient);
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const fetchedDiagnoses = await diagnosisService.getAll();
        setDiagnoses(fetchedDiagnoses);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };

    fetchPatient();
    fetchDiagnoses();
  }, [id]);

  const handleAddEntry = async () => {
    if (newEntry && patient) {
      try {
        let entryToSend: HealthCheckEntryWithoutId | HospitalEntryWithoutId | OccupationalHealthcareEntryWithoutId;

        // Construct entry based on entry type
        if (entryType === "HealthCheck") {
          entryToSend = {
            date: newEntry.date,
            type: entryType,
            specialist: newEntry.specialist,
            description: newEntry.description,
            healthCheckRating: newEntry.healthCheckRating ? Number(newEntry.healthCheckRating) : undefined,
            diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes.split(',').map(code => code.trim()) : [],
          } as HealthCheckEntryWithoutId;
        } else if (entryType === "Hospital") {
          entryToSend = {
            date: newEntry.date,
            type: entryType,
            specialist: newEntry.specialist,
            description: newEntry.description,
            discharge: {
              date: newEntry.dischargeDate,
              criteria: newEntry.dischargeCriteria,
            },
            diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes.split(',').map(code => code.trim()) : [],
          } as HospitalEntryWithoutId;
        } else if (entryType === "OccupationalHealthcare") {
          entryToSend = {
            date: newEntry.date,
            type: entryType,
            specialist: newEntry.specialist,
            description: newEntry.description,
            employerName: newEntry.employerName,
            sickLeave: {
              startDate: newEntry.sickLeaveStartDate,
              endDate: newEntry.sickLeaveEndDate,
            },
            diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes.split(',').map(code => code.trim()) : [],
          } as OccupationalHealthcareEntryWithoutId;
        }

        // Log the entry data format to the console
        console.log("Entry to send:", entryToSend);

        const addedEntry = await patientService.addEntry(patient.id, entryToSend);
        setPatient({ ...patient, entries: patient.entries.concat(addedEntry) });
        setNewEntry(null);
        setShowForm(false);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error adding entry:", error);
        setErrorMessage("Failed to add entry. Please check your input.");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    } as EntryWithoutId); // Cast to EntryWithoutId
  };

  const handleTypeChange = (event: SelectChangeEvent<EntryWithoutId['type']>) => {
    setEntryType(event.target.value as EntryWithoutId['type']);
    setNewEntry(null); // Reset new entry when type changes
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!patient) {
    return <Typography variant="h6">Patient not found</Typography>;
  }

  // Determine the gender icon to display
  const renderGenderIcon = () => {
    switch (patient.gender) {
      case 'male':
        return <MaleIcon style={{ verticalAlign: 'middle', marginLeft: '5px' }} />;
      case 'female':
        return <FemaleIcon style={{ verticalAlign: 'middle', marginLeft: '5px' }} />;
      case 'other':
        return <TransgenderIcon style={{ verticalAlign: 'middle', marginLeft: '5px' }} />;
      default:
        return null;
    }
  };

  return (
    <Paper style={{ padding: "20px" }}>
      <Typography variant="h4">
        <strong>{patient.name} {renderGenderIcon()}</strong>
      </Typography>
      <Typography variant="h6">Occupation: {patient.occupation}</Typography>
      <Typography variant="h6">Date of Birth: {patient.dateOfBirth}</Typography>
      <Typography variant="h6">SSN: {patient.ssn}</Typography>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        <strong>
          Entries:
        </strong>
      </Typography>
      <List>
        {patient.entries.length > 0 ? (
          patient.entries.map((entry) => (
            <ListItem key={entry.id} style={{ color: 'black' }}>
              <EntryDetails entry={entry} />
            </ListItem>
          ))
        ) : (
          <Typography>No entries found for this patient.</Typography>
        )}
      </List>

      {/* Button to toggle the entry form */}
      <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Entry"}
      </Button>

      {errorMessage && (
        <Typography color="error">{errorMessage}</Typography> // Display error message
      )}

      {showForm && (
        <EntryForm
          entryType={entryType}
          handleChange={handleChange}
          handleTypeChange={handleTypeChange}
          handleAddEntry={handleAddEntry}
          setShowForm={setShowForm}
        />
      )}
    </Paper>
  );
};

export default PatientDetailPage;