import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ExerciseTable from "./ExerciseTable";

// Dados fictícios para templates de treinos
const initialTemplates = [
  {
    id: 1,
    name: "Treino Inicial - Adaptação",
    description: "Treino para adaptação de iniciantes",
    type: "beginner",
    exercises: [
      {
        id: "t1e1",
        name: "Supino Reto",
        sets: "3",
        weight: "10-15",
        reps: "12",
        notes: "Movimento controlado",
        muscleGroup: "chest",
      },
      {
        id: "t1e2",
        name: "Leg Press",
        sets: "3",
        weight: "50",
        reps: "15",
        notes: "Posição neutra",
        muscleGroup: "legs",
      },
      {
        id: "t1e3",
        name: "Puxada Frontal",
        sets: "3",
        weight: "30",
        reps: "12",
        notes: "Pegada aberta",
        muscleGroup: "back",
      },
    ],
  },
  {
    id: 2,
    name: "Hipertrofia - Intermediário",
    description: "Treino focado em hipertrofia para nível intermediário",
    type: "intermediate",
    exercises: [
      {
        id: "t2e1",
        name: "Agachamento",
        sets: "4",
        weight: "60-80",
        reps: "10",
        notes: "Profundidade completa",
        muscleGroup: "legs",
      },
      {
        id: "t2e2",
        name: "Supino Inclinado",
        sets: "4",
        weight: "40-50",
        reps: "8",
        notes: "Foco na contração",
        muscleGroup: "chest",
      },
      {
        id: "t2e3",
        name: "Remada Curvada",
        sets: "4",
        weight: "40",
        reps: "10",
        notes: "Costas retas",
        muscleGroup: "back",
      },
    ],
  },
  {
    id: 3,
    name: "Treino de Força - Avançado",
    description: "Treino de força para alunos avançados",
    type: "advanced",
    exercises: [
      {
        id: "t3e1",
        name: "Levantamento Terra",
        sets: "5",
        weight: "100-120",
        reps: "5",
        notes: "Técnica perfeita",
        muscleGroup: "back",
      },
      {
        id: "t3e2",
        name: "Desenvolvimento",
        sets: "5",
        weight: "50-60",
        reps: "6",
        notes: "Explosivo na subida",
        muscleGroup: "shoulders",
      },
      {
        id: "t3e3",
        name: "Barra Fixa",
        sets: "4",
        weight: "Peso corporal",
        reps: "8",
        notes: "Pegada aberta",
        muscleGroup: "back",
      },
      {
        id: "t3e4",
        name: "Elevação de Quadril",
        sets: "3",
        weight: "90-100",
        reps: "10",
        notes: "Contração completa",
        muscleGroup: "legs",
      },
    ],
  },
];

function WorkoutTemplates({ onSelectTemplate }) {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState(initialTemplates);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  // Adicionar novo template
  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setTemplateName("");
    setTemplateDescription("");
    setTemplateType("beginner");
    setExercises([]);
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Editar template existente
  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateType(template.type);
    setExercises(template.exercises);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Duplicar template
  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Cópia)`,
      exercises: [...template.exercises],
    };

    setTemplates([...templates, newTemplate]);
    handleSnackbar(t("workouts.templateDuplicated"));
  };

  // Excluir template
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter((template) => template.id !== id));
    handleSnackbar(t("workouts.templateDeleted"));
  };

  // Salvar template
  const handleSaveTemplate = () => {
    // Validação
    if (!templateName || exercises.length === 0) {
      handleSnackbar(t("workouts.invalidTemplate"), "error");
      return;
    }

    if (isEditing) {
      // Atualizar template existente
      const updatedTemplates = templates.map((template) =>
        template.id === currentTemplate.id
          ? {
              ...template,
              name: templateName,
              description: templateDescription,
              type: templateType,
              exercises: exercises,
            }
          : template
      );
      setTemplates(updatedTemplates);
      handleSnackbar(t("workouts.templateUpdated"));
    } else {
      // Adicionar novo template
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        description: templateDescription,
        type: templateType,
        exercises: exercises,
      };
      setTemplates([...templates, newTemplate]);
      handleSnackbar(t("workouts.templateAdded"));
    }

    setOpenDialog(false);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Selecionar template para aplicar a um aluno
  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Obter cor do chip baseado no tipo de treino
  const getTypeColor = (type) => {
    switch (type) {
      case "beginner":
        return "success";
      case "intermediate":
        return "primary";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          {t("workouts.templates")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTemplate}
        >
          {t("workouts.addTemplate")}
        </Button>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <List>
          {templates.map((template) => (
            <React.Fragment key={template.id}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => handleSelectTemplate(template)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{ fontWeight: "bold" }}
                      >
                        {template.name}
                      </Typography>
                      <Chip
                        label={t(`workouts.${template.type}`)}
                        color={getTypeColor(template.type)}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {template.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("workouts.exercisesCount", {
                          count: template.exercises.length,
                        })}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTemplate(template);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="duplicate"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateTemplate(template);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <CopyIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Diálogo para adicionar/editar template */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? t("workouts.editTemplate") : t("workouts.addTemplate")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              label={t("workouts.templateName")}
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={t("workouts.templateDescription")}
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label={t("workouts.templateType")}
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              margin="normal"
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="beginner">{t("workouts.beginner")}</option>
              <option value="intermediate">{t("workouts.intermediate")}</option>
              <option value="advanced">{t("workouts.advanced")}</option>
            </TextField>
          </Box>

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("workouts.exercisesList")}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <ExerciseTable exercises={exercises} setExercises={setExercises} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("buttons.cancel")}</Button>
          <Button
            onClick={handleSaveTemplate}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {t("buttons.save")}
          </Button>
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

export default WorkoutTemplates;
