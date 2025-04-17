import React from "react";
import {
  Box,
  TextField,
  Grid,
  Paper,
  Typography,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";

const frequencyOptions = [
  "1x/semana",
  "2x/semana",
  "3x/semana",
  "4x/semana",
  "5x/semana",
  "6x/semana",
  "Todos os dias",
];

function StudentForm({ studentData, setStudentData }) {
  const { t } = useTranslation();

  const handleChange = (field) => (event) => {
    setStudentData({
      ...studentData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setStudentData({
      ...studentData,
      date: newDate,
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t("student.title")}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("student.name")}
            value={studentData.name || ""}
            onChange={handleChange("name")}
            margin="normal"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("student.age")}
            type="number"
            value={studentData.age || ""}
            onChange={handleChange("age")}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputProps: { min: 0, max: 120 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("student.goals")}
            value={studentData.goals || ""}
            onChange={handleChange("goals")}
            margin="normal"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label={t("student.frequency")}
            value={studentData.frequency || ""}
            onChange={handleChange("frequency")}
            margin="normal"
            variant="outlined"
          >
            {frequencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("student.sessions")}
            type="number"
            value={studentData.sessions || ""}
            onChange={handleChange("sessions")}
            margin="normal"
            variant="outlined"
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t("student.date")}
              value={studentData.date || null}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StudentForm;
