import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  FitnessCenter as FitnessCenterIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ExerciseTable from "./ExerciseTable";
import WorkoutTemplates from "./WorkoutTemplates";
import dayjs from "dayjs";

// Dados fictícios de alunos com treinos
const initialStudentWorkouts = [
  {
    id: 1,
    studentId: 1,
    studentName: "João Silva",
    workoutName: "Treino Inicial - Adaptação",
    exercises: [
      {
        id: "sw1e1",
        name: "Supino Reto",
        sets: "3",
        weight: "15",
        reps: "12",
        notes: "Movimento controlado",
        muscleGroup: "chest",
      },
      {
        id: "sw1e2",
        name: "Leg Press",
        sets: "3",
        weight: "60",
        reps: "15",
        notes: "Posição neutra",
        muscleGroup: "legs",
      },
    ],
    history: [
      {
        date: "2023-05-10",
        action: "created",
        description: "Treino inicial criado",
      },
      {
        date: "2023-06-05",
        action: "updated",
        description: "Aumentado peso no Leg Press de 50 para 60kg",
      },
    ],
    lastUpdated: "2023-06-05",
    observations: "Aluno iniciante com bom progresso",
    active: true,
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Maria Oliveira",
    workoutName: "Hipertrofia - Intermediário",
    exercises: [
      {
        id: "sw2e1",
        name: "Agachamento",
        sets: "4",
        weight: "65",
        reps: "10",
        notes: "Profundidade completa",
        muscleGroup: "legs",
      },
      {
        id: "sw2e2",
        name: "Supino Inclinado",
        sets: "4",
        weight: "45",
        reps: "8",
        notes: "Foco na contração",
        muscleGroup: "chest",
      },
    ],
    history: [
      {
        date: "2023-04-15",
        action: "created",
        description: "Treino customizado criado",
      },
      {
        date: "2023-05-20",
        action: "updated",
        description: "Ajustada série no Supino Inclinado",
      },
    ],
    lastUpdated: "2023-05-20",
    observations:
      "Aluna com foco em hipertrofia, boa evolução nos últimos meses",
    active: true,
  },
];

// Lista fictícia de todos os alunos
const allStudents = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Oliveira" },
  { id: 3, name: "Carlos Santos" },
  { id: 4, name: "Ana Paula Souza" },
  { id: 5, name: "Roberto Mendes" },
];

function StudentWorkoutList() {
  const { t } = useTranslation();
  const [studentWorkouts, setStudentWorkouts] = useState(
    initialStudentWorkouts
  );
  const [filteredWorkouts, setFilteredWorkouts] = useState(
    initialStudentWorkouts
  );
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudentWorkout, setCurrentStudentWorkout] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [observations, setObservations] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newHistoryEntry, setNewHistoryEntry] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Aplicar filtros quando mudar texto de pesquisa
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, activeFilter]);

  // Abrir snackbar
  const handleSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Aplicar filtros
  const applyFilters = () => {
    let result = [...studentWorkouts];

    // Filtrar por texto
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (workout) =>
          workout.studentName.toLowerCase().includes(searchLower) ||
          workout.workoutName.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por status
    if (activeFilter !== "all") {
      const isActive = activeFilter === "active";
      result = result.filter((workout) => workout.active === isActive);
    }

    setFilteredWorkouts(result);
  };

  // Abrir diálogo para adicionar novo treino de aluno
  const handleAddStudentWorkout = () => {
    setCurrentStudentWorkout(null);
    setSelectedStudentId("");
    setObservations("");
    setExercises([]);
    setNewHistoryEntry("");
    setSelectedTabIndex(0);
    setShowHistory(false);
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar treino de aluno
  const handleEditStudentWorkout = (workout) => {
    setCurrentStudentWorkout(workout);
    setSelectedStudentId(workout.studentId.toString());
    setObservations(workout.observations || "");
    setExercises([...workout.exercises]);
    setNewHistoryEntry("");
    setSelectedTabIndex(0);
    setShowHistory(false);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Alternar visualização do histórico
  const toggleHistory = (workout) => {
    setCurrentStudentWorkout(workout);
    setShowHistory(true);
    setOpenDialog(true);
  };

  // Mudar aba no diálogo
  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  // Adicionar entrada ao histórico
  const handleAddHistoryEntry = () => {
    if (!newHistoryEntry.trim()) return;

    const updatedHistory = [
      ...(currentStudentWorkout?.history || []),
      {
        date: dayjs().format("YYYY-MM-DD"),
        action: "updated",
        description: newHistoryEntry,
      },
    ];

    setCurrentStudentWorkout({
      ...currentStudentWorkout,
      history: updatedHistory,
    });

    setNewHistoryEntry("");
  };

  // Salvar treino de aluno
  const handleSaveStudentWorkout = () => {
    // Validação
    if (!selectedStudentId || exercises.length === 0) {
      handleSnackbar(t("workouts.invalidWorkout"), "error");
      return;
    }

    const student = allStudents.find(
      (s) => s.id.toString() === selectedStudentId
    );

    if (!student) {
      handleSnackbar(t("workouts.studentNotFound"), "error");
      return;
    }

    const today = dayjs().format("YYYY-MM-DD");

    if (isEditing) {
      // Atualizar treino existente
      const updatedWorkouts = studentWorkouts.map((workout) => {
        if (workout.id === currentStudentWorkout.id) {
          // Adicionar entrada de histórico apenas se houver alterações
          let updatedHistory = [...workout.history];

          // Verificar se houve alterações no treino
          if (
            JSON.stringify(workout.exercises) !== JSON.stringify(exercises) ||
            workout.observations !== observations
          ) {
            updatedHistory = [
              ...updatedHistory,
              {
                date: today,
                action: "updated",
                description: t("workouts.workoutUpdated"),
              },
            ];
          }

          return {
            ...workout,
            studentId: parseInt(selectedStudentId),
            studentName: student.name,
            exercises: exercises,
            observations: observations,
            history: updatedHistory,
            lastUpdated: today,
          };
        }
        return workout;
      });

      setStudentWorkouts(updatedWorkouts);
      setFilteredWorkouts(updatedWorkouts);
      handleSnackbar(t("workouts.workoutUpdated"));
    } else {
      // Novo treino de aluno
      const newWorkout = {
        id: Date.now(),
        studentId: parseInt(selectedStudentId),
        studentName: student.name,
        workoutName: t("workouts.customWorkout"),
        exercises: exercises,
        observations: observations,
        history: [
          {
            date: today,
            action: "created",
            description: t("workouts.workoutCreated"),
          },
        ],
        lastUpdated: today,
        active: true,
      };

      const updatedWorkouts = [...studentWorkouts, newWorkout];
      setStudentWorkouts(updatedWorkouts);
      setFilteredWorkouts(updatedWorkouts);
      handleSnackbar(t("workouts.workoutAdded"));
    }

    setOpenDialog(false);
  };

  // Aplicar template a um aluno
  const handleApplyTemplate = (template) => {
    if (!selectedStudentId) {
      handleSnackbar(t("workouts.selectStudent"), "warning");
      return;
    }

    setExercises([...template.exercises]);
    handleSnackbar(t("workouts.templateApplied"));
  };

  // Alternar status do treino (ativo/inativo)
  const toggleWorkoutStatus = (workoutId) => {
    const updatedWorkouts = studentWorkouts.map((workout) => {
      if (workout.id === workoutId) {
        const newStatus = !workout.active;

        // Adicionar entrada no histórico sobre a mudança de status
        const updatedHistory = [
          ...workout.history,
          {
            date: dayjs().format("YYYY-MM-DD"),
            action: newStatus ? "activated" : "deactivated",
            description: newStatus
              ? t("workouts.workoutActivated")
              : t("workouts.workoutDeactivated"),
          },
        ];

        return {
          ...workout,
          active: newStatus,
          history: updatedHistory,
          lastUpdated: dayjs().format("YYYY-MM-DD"),
        };
      }
      return workout;
    });

    setStudentWorkouts(updatedWorkouts);
    setFilteredWorkouts(updatedWorkouts);
    handleSnackbar(t("workouts.statusUpdated"));
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowHistory(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("workouts.title")}
      </Typography>

      {/* Filtros de pesquisa */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label={t("workouts.search")}
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">
                {t("workouts.filterStatus")}
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={activeFilter}
                label={t("workouts.filterStatus")}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <MenuItem value="all">{t("workouts.allStatuses")}</MenuItem>
                <MenuItem value="active">{t("workouts.statusActive")}</MenuItem>
                <MenuItem value="inactive">
                  {t("workouts.statusInactive")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Botões para adicionar treino e gerenciar modelos */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<LibraryBooksIcon />}
          onClick={() => setShowTemplates(true)}
        >
          {t("workouts.manageTemplates")}
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<FitnessCenterIcon />}
          onClick={handleAddStudentWorkout}
        >
          {t("workouts.addWorkout")}
        </Button>
      </Box>

      {/* Lista de treinos dos alunos */}
      <Grid container spacing={3}>
        {filteredWorkouts.map((workout) => (
          <Grid item xs={12} md={6} key={workout.id}>
            <Card
              elevation={3}
              sx={{
                borderLeft: 6,
                borderColor: workout.active ? "success.main" : "error.main",
                mb: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{workout.studentName}</Typography>
                  </Box>
                  <Chip
                    label={
                      workout.active
                        ? t("workouts.statusActive")
                        : t("workouts.statusInactive")
                    }
                    color={workout.active ? "success" : "error"}
                    onClick={() => toggleWorkoutStatus(workout.id)}
                  />
                </Box>

                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {workout.workoutName}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("workouts.lastUpdated")}:{" "}
                  {dayjs(workout.lastUpdated).format("DD/MM/YYYY")}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {workout.observations || t("workouts.noObservations")}
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {t("workouts.exercises")} ({workout.exercises.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {workout.exercises.map((exercise) => (
                        <ListItem key={exercise.id}>
                          <ListItemText
                            primary={exercise.name}
                            secondary={`${exercise.sets}x${exercise.reps} - ${exercise.weight}kg`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    onClick={() => toggleHistory(workout)}
                    sx={{ mr: 1 }}
                  >
                    {t("workouts.history")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditStudentWorkout(workout)}
                  >
                    {t("workouts.edit")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de gerenciamento de modelos de treino */}
      <Dialog
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>{t("workouts.templates")}</DialogTitle>
        <DialogContent dividers>
          <WorkoutTemplates
            onSelectTemplate={(template) => {
              setShowTemplates(false);
              handleAddStudentWorkout();
              setExercises([...template.exercises]);
              setSelectedTabIndex(1);
              handleSnackbar(t("workouts.templateApplied"));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplates(false)}>
            {t("buttons.close")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para adicionar/editar treino */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          {showHistory
            ? `${t("workouts.historyFor")} ${
                currentStudentWorkout?.studentName
              }`
            : isEditing
            ? t("workouts.editWorkout")
            : t("workouts.addWorkout")}
        </DialogTitle>
        <DialogContent dividers>
          {showHistory ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {t("workouts.workoutHistory")}
              </Typography>
              <List>
                {currentStudentWorkout?.history
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <HistoryIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${dayjs(entry.date).format(
                            "DD/MM/YYYY"
                          )} - ${t(
                            `workouts.action${
                              entry.action.charAt(0).toUpperCase() +
                              entry.action.slice(1)
                            }`
                          )}`}
                          secondary={entry.description}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
              </List>
            </Box>
          ) : (
            <Box>
              <Tabs value={selectedTabIndex} onChange={handleTabChange}>
                <Tab label={t("workouts.details")} />
                <Tab label={t("workouts.exercises")} />
                <Tab label={t("workouts.templates")} />
              </Tabs>

              <Box sx={{ mt: 2, mb: 2 }}>
                {selectedTabIndex === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="student-select-label">
                          {t("workouts.selectStudent")}
                        </InputLabel>
                        <Select
                          labelId="student-select-label"
                          value={selectedStudentId}
                          label={t("workouts.selectStudent")}
                          onChange={(e) => setSelectedStudentId(e.target.value)}
                          disabled={isEditing}
                        >
                          <MenuItem value="">
                            {t("workouts.selectStudentPlaceholder")}
                          </MenuItem>
                          {allStudents.map((student) => (
                            <MenuItem
                              key={student.id}
                              value={student.id.toString()}
                            >
                              {student.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t("workouts.observations")}
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        multiline
                        rows={3}
                      />
                    </Grid>

                    {isEditing && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          {t("workouts.addHistoryEntry")}
                        </Typography>
                        <Box sx={{ display: "flex" }}>
                          <TextField
                            fullWidth
                            label={t("workouts.historyDescription")}
                            value={newHistoryEntry}
                            onChange={(e) => setNewHistoryEntry(e.target.value)}
                          />
                          <Button
                            variant="contained"
                            onClick={handleAddHistoryEntry}
                            disabled={!newHistoryEntry.trim()}
                            sx={{ ml: 1 }}
                          >
                            {t("buttons.add")}
                          </Button>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<LibraryBooksIcon />}
                        onClick={() => {
                          setOpenDialog(false);
                          setShowTemplates(true);
                        }}
                      >
                        {t("workouts.useTemplate")}
                      </Button>
                    </Grid>
                  </Grid>
                )}

                {selectedTabIndex === 1 && (
                  <ExerciseTable
                    exercises={exercises}
                    setExercises={setExercises}
                  />
                )}

                {selectedTabIndex === 2 && (
                  <WorkoutTemplates onSelectTemplate={handleApplyTemplate} />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("buttons.close")}</Button>
          {!showHistory && (
            <Button
              onClick={handleSaveStudentWorkout}
              color="primary"
              variant="contained"
              disabled={!selectedStudentId || exercises.length === 0}
            >
              {t("buttons.save")}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StudentWorkoutList;
