import React, { useEffect, useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EntryWithoutId } from '../../types';
import { SelectChangeEvent } from '@mui/material';
import diagnosesService from '../../services/diagnoses';
import { Diagnosis } from '../../types';

interface EntryFormProps {
  entryType: EntryWithoutId['type'];
  handleChange: (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTypeChange: (event: SelectChangeEvent<EntryWithoutId['type']>) => void;
  handleAddEntry: () => void;
  setShowForm: (show: boolean) => void;
  setDiagnosisCodes: (codes: string[]) => void;
  newEntry: EntryWithoutId | null;
}

const EntryForm: React.FC<EntryFormProps> = ({
  entryType,
  handleChange,
  handleTypeChange,
  handleAddEntry,
  setShowForm,
  setDiagnosisCodes,
  newEntry,
}) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const data = await diagnosesService.getAll();
      setDiagnoses(data);
    };
    fetchDiagnoses();
  }, []);

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const selectedCodes = event.target.value as string[];
    setSelectedDiagnosisCodes(selectedCodes);
    setDiagnosisCodes(selectedCodes);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Common validations
    if (!selectedDiagnosisCodes.length) {
      newErrors.diagnosisCodes = "At least one diagnosis code is required.";
    }
    if (!entryType) {
      newErrors.entryType = "Entry type is required.";
    }
    if (!newEntry?.description) {
      newErrors.description = "Description is required.";
    }
    if (!newEntry?.date) {
      newErrors.date = "Date is required.";
    }

    // Entry type specific validations
    switch (entryType) {
      case "HealthCheck":
        if (!newEntry?.specialist) {
          newErrors.specialist = "Specialist is required.";
        }
        if (newEntry?.healthCheckRating === undefined) {
          newErrors.healthCheckRating = "Health Check Rating is required.";
        }
        break;
      case "Hospital":
        if (!newEntry?.dischargeDate) {
          newErrors.dischargeDate = "Discharge Date is required.";
        }
        if (!newEntry?.dischargeCriteria) {
          newErrors.dischargeCriteria = "Discharge Criteria is required.";
        }
        if (!newEntry?.specialist) {
          newErrors.specialist = "Specialist is required.";
        }
        break;
      case "OccupationalHealthcare":
        if (!newEntry?.employerName) {
          newErrors.employerName = "Employer Name is required.";
        }
        if (!newEntry?.sickLeaveStartDate) {
          newErrors.sickLeaveStartDate = "Sick Leave Start Date is required.";
        }
        if (!newEntry?.sickLeaveEndDate) {
          newErrors.sickLeaveEndDate = "Sick Leave End Date is required.";
        }
        if (!newEntry?.specialist) {
          newErrors.specialist = "Specialist is required.";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      handleAddEntry();
    }
  };

  const renderEntryFields = () => {
    switch (entryType) {
      case "HealthCheck":
        return (
          <>
            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <InputLabel id="health-check-rating-label">Health Check Rating</InputLabel>
              <Select
                labelId="health-check-rating-label"
                name="healthCheckRating"
                onChange={handleChange}
                defaultValue=""
              >
                <MenuItem value={0}>0 - Healthy</MenuItem>
                <MenuItem value={1}>1 - Low Risk</MenuItem>
                <MenuItem value={2}>2 - High Risk</MenuItem>
                <MenuItem value={3}>3 - Critical Risk</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Specialist"
              name="specialist"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              error={!!errors.specialist}
              helperText={errors.specialist}
            />
          </>
        );
      case "Hospital":
        return (
          <>
            <TextField
              label="Discharge Date"
              name="dischargeDate"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.dischargeDate}
              helperText={errors.dischargeDate}
            />
            <TextField
              label="Discharge Criteria"
              name="dischargeCriteria"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              error={!!errors.dischargeCriteria}
              helperText={errors.dischargeCriteria}
            />
            <TextField
              label="Specialist"
              name="specialist"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              error={!!errors.specialist}
              helperText={errors.specialist}
            />
          </>
        );
      case "OccupationalHealthcare":
        return (
          <>
            <TextField
              label="Employer Name"
              name="employerName"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              error={!!errors.employerName}
              helperText={errors.employerName}
            />
            <TextField
              label="Sick Leave Start Date"
              name="sickLeaveStartDate"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.sickLeaveStartDate}
              helperText={errors.sickLeaveStartDate}
            />
            <TextField
              label="Sick Leave End Date"
              name="sickLeaveEndDate"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.sickLeaveEndDate}
              helperText={errors.sickLeaveEndDate}
            />
            <TextField
              label="Specialist"
              name="specialist"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
              error={!!errors.specialist}
              helperText={errors.specialist}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginTop: "20px" }}>
        <FormControl fullWidth>
          <InputLabel id="entry-type-label">Entry Type</InputLabel>
          <Select
            labelId="entry-type-label"
            value={entryType}
            onChange={handleTypeChange}
            error={!!errors.entryType}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
          {errors.entryType && <p style={{ color: 'red' }}>{errors.entryType}</p>}
        </FormControl>

        <TextField
          label="Description"
          name="description"
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "10px" }}
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Date"
          name="date"
          onChange={handleChange}
          fullWidth
          style={{ marginTop: "10px" }}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.date}
          helperText={errors.date}
        />

        {renderEntryFields()}

        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={selectedDiagnosisCodes}
            onChange={handleDiagnosisChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.name} ({diagnosis.code})
              </MenuItem>
            ))}
          </Select>
          {errors.diagnosisCodes && <p style={{ color: 'red' }}>{errors.diagnosisCodes}</p>}
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          style={{ marginTop: "10px" }}
        >
          ADD
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowForm(false)}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
};

export default EntryForm;
