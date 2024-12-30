import React from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EntryWithoutId } from '../../types';
import { SelectChangeEvent } from '@mui/material';

interface EntryFormProps {
  entryType: EntryWithoutId['type'];
  handleChange: (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTypeChange: (event: SelectChangeEvent<EntryWithoutId['type']>) => void;
  handleAddEntry: () => void;
  setShowForm: (show: boolean) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({
  entryType,
  handleChange,
  handleTypeChange,
  handleAddEntry,
  setShowForm,
}) => {
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
            />
            <TextField
              label="Discharge Criteria"
              name="dischargeCriteria"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Specialist"
              name="specialist"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
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
            />
            <TextField
              label="Specialist"
              name="specialist"
              onChange={handleChange}
              fullWidth
              style={{ marginTop: "10px" }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <FormControl fullWidth>
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={entryType}
          onChange={handleTypeChange}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Description"
        name="description"
        onChange={handleChange}
        fullWidth
        style={{ marginTop: "10px" }}
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
      />

      {renderEntryFields()}

      <TextField
        label="Diagnosis Codes"
        name="diagnosisCodes"
        onChange={handleChange}
        fullWidth
        style={{ marginTop: "10px" }}
        placeholder="Enter codes separated by commas"
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleAddEntry}
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
  );
};

export default EntryForm;
