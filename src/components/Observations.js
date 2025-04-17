import React from "react";
import { Paper, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Observations({ observations, setObservations }) {
  const { t } = useTranslation();

  const handleChange = (event) => {
    setObservations(event.target.value);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t("observations.title")}
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder={t("observations.placeholder")}
        value={observations || ""}
        onChange={handleChange}
        variant="outlined"
        margin="normal"
      />
    </Paper>
  );
}

export default Observations;
