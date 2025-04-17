import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import exerciseData from "../data/exerciseData";

// Componente de tabela de exercícios
function ExerciseTable({ exercises, setExercises }) {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState("shoulders");

  // Função para lidar com a mudança de aba (grupo muscular)
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Função para abrir o diálogo para adicionar novo exercício
  const handleAddExercise = () => {
    setCurrentExercise({
      id: Date.now().toString(),
      name: "",
      sets: "",
      weight: "",
      reps: "",
      notes: "",
      muscleGroup: currentTab,
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Função para abrir o diálogo para editar exercício existente
  const handleEditExercise = (exercise) => {
    setCurrentExercise({ ...exercise });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Função para excluir um exercício
  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentExercise(null);
  };

  // Função para atualizar o exercício atual durante a edição
  const handleInputChange = (field) => (event) => {
    setCurrentExercise({
      ...currentExercise,
      [field]: event.target.value,
    });
  };

  // Função para lidar com a mudança do nome do exercício (Autocomplete)
  const handleExerciseNameChange = (event, newValue) => {
    setCurrentExercise({
      ...currentExercise,
      name: newValue,
    });
  };

  // Função para salvar exercício (adicionar novo ou atualizar existente)
  const handleSaveExercise = () => {
    if (isEditing) {
      setExercises(
        exercises.map((ex) =>
          ex.id === currentExercise.id ? currentExercise : ex
        )
      );
    } else {
      setExercises([...exercises, currentExercise]);
    }
    handleCloseDialog();
  };

  // Obter lista de exercícios para o grupo muscular atual
  const getExerciseOptions = () => {
    return exerciseData[currentTab] || [];
  };

  // Filtrar exercícios pelo grupo muscular atual
  const filteredExercises = exercises.filter(
    (ex) => ex.muscleGroup === currentTab
  );

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          {t("exercise.title")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddExercise}
        >
          {t("exercise.add")}
        </Button>
      </Box>

      {/* Abas para grupos musculares */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={t("muscleGroups.shoulders")} value="shoulders" />
        <Tab label={t("muscleGroups.chest")} value="chest" />
        <Tab label={t("muscleGroups.back")} value="back" />
        <Tab label={t("muscleGroups.biceps")} value="biceps" />
        <Tab label={t("muscleGroups.triceps")} value="triceps" />
        <Tab label={t("muscleGroups.legs")} value="legs" />
        <Tab label={t("muscleGroups.core")} value="core" />
      </Tabs>

      {/* Tabela de exercícios */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("exercise.name")}</TableCell>
              <TableCell align="center">{t("exercise.sets")}</TableCell>
              <TableCell align="center">{t("exercise.weight")}</TableCell>
              <TableCell align="center">{t("exercise.reps")}</TableCell>
              <TableCell>{t("exercise.sequence")}</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell align="center">{exercise.sets}</TableCell>
                  <TableCell align="center">{exercise.weight}</TableCell>
                  <TableCell align="center">{exercise.reps}</TableCell>
                  <TableCell>{exercise.notes}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditExercise(exercise)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum exercício para este grupo muscular.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para adicionar/editar exercício */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing ? t("exercise.edit") : t("exercise.add")}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={getExerciseOptions().map((option) =>
              t(`exercises.${option.key}`)
            )}
            value={currentExercise?.name || ""}
            onChange={handleExerciseNameChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("exercise.name")}
                margin="normal"
                variant="outlined"
                fullWidth
                required
              />
            )}
          />
          <TextField
            label={t("exercise.sets")}
            type="number"
            value={currentExercise?.sets || ""}
            onChange={handleInputChange("sets")}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <TextField
            label={t("exercise.weight")}
            value={currentExercise?.weight || ""}
            onChange={handleInputChange("weight")}
            margin="normal"
            variant="outlined"
            fullWidth
            placeholder="ex: 10 ou 4-9 ou 8 Δ3"
          />
          <TextField
            label={t("exercise.reps")}
            type="number"
            value={currentExercise?.reps || ""}
            onChange={handleInputChange("reps")}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <TextField
            label={t("exercise.sequence")}
            value={currentExercise?.notes || ""}
            onChange={handleInputChange("notes")}
            margin="normal"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handleSaveExercise}
            color="primary"
            variant="contained"
            disabled={!currentExercise?.name}
          >
            {t("buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ExerciseTable;
