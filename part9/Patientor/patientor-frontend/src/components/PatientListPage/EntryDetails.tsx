import React from 'react';
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../../types";
import { Box, Typography } from "@mui/material";
import HealthCheckIcon from '@mui/icons-material/HealthAndSafety';
import HospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

interface EntryDetailsProps {
  entry: Entry;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
  const renderEntryDetails = () => {
    switch (entry.type) {
      case "HealthCheck":
        const healthCheckEntry = entry as HealthCheckEntry;
        return (
          <Box sx={{ marginBottom: '10px', border: '1px solid', borderRadius: 1, padding: 2 }}>
            <Typography variant="body1">
            <strong>{healthCheckEntry.date}</strong> <HealthCheckIcon /> <strong>Health Check</strong>
            </Typography>
            <Typography variant="body2">
              {healthCheckEntry.description}
            </Typography>
            <Typography variant="body2">
              Health Check Rating: {healthCheckEntry.healthCheckRating}
            </Typography>
            <Typography variant="body2">
              Diagnosed by: {healthCheckEntry.specialist}
            </Typography>
          </Box>
        );

      case "Hospital":
        const hospitalEntry = entry as HospitalEntry;
        return (
          <Box sx={{ marginBottom: '10px', border: '1px solid', borderRadius: 1, padding: 2 }}>
            <Typography variant="body1">
              <strong>{hospitalEntry.date}</strong> <HospitalIcon /> <strong>Hospital</strong>
            </Typography>
            <Typography variant="body2">
              {hospitalEntry.description}
            </Typography>
            <Typography variant="body2">
              Discharge Date: {hospitalEntry.discharge.date} - Criteria: {hospitalEntry.discharge.criteria}
            </Typography>
            <Typography variant="body2">
              Diagnosed by: {hospitalEntry.specialist}
            </Typography>
          </Box>
        );

      case "OccupationalHealthcare":
        const occupationalEntry = entry as OccupationalHealthcareEntry;
        return (
          <Box sx={{ marginBottom: '10px', border: '1px solid', borderRadius: 1, padding: 2 }}>
            <Typography variant="body1">
              <strong>{occupationalEntry.date}</strong> <WorkIcon /> <strong>Occupational Healthcare </strong> {occupationalEntry.employerName}
            </Typography>
            <Typography variant="body2">
              {occupationalEntry.description}
            </Typography>
            {occupationalEntry.sickLeave && (
              <Typography variant="body2">
                Sick Leave: {occupationalEntry.sickLeave.startDate} to {occupationalEntry.sickLeave.endDate}
              </Typography>
            )}
            <Typography variant="body2">
              Diagnosed by: {occupationalEntry.specialist}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderEntryDetails()}
    </div>
  );
};

export default EntryDetails;