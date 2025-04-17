import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid, ptBR, enUS, GridToolbar } from "@mui/x-data-grid";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

// Dados fictícios de alunos
const initialStudents = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    age: 28,
    gender: "M",
    joinDate: "2023-01-15",
    plan: "monthly",
    status: "active",
    lastPayment: "2023-06-10",
    goal: "Hipertrofia",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 91234-5678",
    age: 32,
    gender: "F",
    joinDate: "2022-11-05",
    plan: "quarterly",
    status: "active",
    lastPayment: "2023-05-05",
    goal: "Perda de peso",
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    phone: "(11) 99876-5432",
    age: 45,
    gender: "M",
    joinDate: "2023-02-20",
    plan: "semiannual",
    status: "inactive",
    lastPayment: "2023-04-20",
    goal: "Condicionamento",
  },
  {
    id: 4,
    name: "Ana Paula Souza",
    email: "ana.souza@email.com",
    phone: "(11) 95555-1234",
    age: 24,
    gender: "F",
    joinDate: "2023-03-10",
    plan: "annual",
    status: "active",
    lastPayment: "2023-06-10",
    goal: "Tonificação",
  },
  {
    id: 5,
    name: "Roberto Mendes",
    email: "roberto.mendes@email.com",
    phone: "(11) 92222-8888",
    age: 37,
    gender: "M",
    joinDate: "2022-10-15",
    plan: "monthly",
    status: "active",
    lastPayment: "2023-06-15",
    goal: "Ganho de massa",
  },
];

function StudentList() {
  const { t, i18n } = useTranslation();
  const [students, setStudents] = useState(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Função para abrir snackbar
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
    let result = [...students];

    // Filtrar por texto de pesquisa
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower) ||
          student.phone.includes(searchText)
      );
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter((student) => student.status === statusFilter);
    }

    // Filtrar por plano
    if (planFilter !== "all") {
      result = result.filter((student) => student.plan === planFilter);
    }

    setFilteredStudents(result);
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchText("");
    setStatusFilter("all");
    setPlanFilter("all");
    setFilteredStudents(students);
  };

  // Abrir formulário para adicionar novo aluno
  const handleAddStudent = () => {
    setCurrentStudent({
      id: Math.max(...students.map((s) => s.id), 0) + 1,
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "M",
      joinDate: dayjs().format("YYYY-MM-DD"),
      plan: "monthly",
      status: "active",
      lastPayment: dayjs().format("YYYY-MM-DD"),
      goal: "",
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Abrir formulário para editar aluno existente
  const handleEditStudent = (student) => {
    setCurrentStudent({ ...student });
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Excluir aluno
  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    handleSnackbar(t("students.deleteSuccess"));
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStudent(null);
  };

  // Atualizar dados do aluno no formulário
  const handleInputChange = (field) => (event) => {
    setCurrentStudent({
      ...currentStudent,
      [field]: event.target.value,
    });
  };

  // Atualizar data de entrada
  const handleJoinDateChange = (newDate) => {
    setCurrentStudent({
      ...currentStudent,
      joinDate: dayjs(newDate).format("YYYY-MM-DD"),
    });
  };

  // Atualizar data de último pagamento
  const handleLastPaymentChange = (newDate) => {
    setCurrentStudent({
      ...currentStudent,
      lastPayment: dayjs(newDate).format("YYYY-MM-DD"),
    });
  };

  // Salvar aluno (adicionar novo ou atualizar existente)
  const handleSaveStudent = () => {
    // Validação básica
    if (
      !currentStudent.name ||
      !currentStudent.email ||
      !currentStudent.phone
    ) {
      handleSnackbar(t("students.invalidData"), "error");
      return;
    }

    if (isEditing) {
      // Atualizar aluno existente
      const updatedStudents = students.map((student) =>
        student.id === currentStudent.id ? currentStudent : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      handleSnackbar(t("students.updateSuccess"));
    } else {
      // Adicionar novo aluno
      const updatedStudents = [...students, currentStudent];
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      handleSnackbar(t("students.addSuccess"));
    }

    handleCloseDialog();
  };

  // Colunas para o DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: t("students.name"), flex: 1, minWidth: 180 },
    { field: "email", headerName: t("students.email"), flex: 1, minWidth: 200 },
    { field: "phone", headerName: t("students.phone"), width: 150 },
    { field: "age", headerName: t("students.age"), width: 90, type: "number" },
    {
      field: "gender",
      headerName: t("students.gender"),
      width: 100,
      valueFormatter: (params) =>
        params.value === "M" ? t("students.male") : t("students.female"),
    },
    {
      field: "joinDate",
      headerName: t("students.joinDate"),
      width: 120,
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "plan",
      headerName: t("students.plan"),
      width: 140,
      renderCell: (params) => (
        <Chip
          label={t(`dashboard.${params.value}Plan`)}
          color={
            params.value === "annual"
              ? "success"
              : params.value === "semiannual"
              ? "info"
              : params.value === "quarterly"
              ? "primary"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: t("students.status"),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={
            params.value === "active"
              ? t("students.active")
              : t("students.inactive")
          }
          color={params.value === "active" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: t("students.actions"),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditStudent(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteStudent(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Localization para o DataGrid
  const getDataGridLocalization = () => {
    switch (i18n.language) {
      case "pt":
        return ptBR.components.MuiDataGrid.defaultProps.localeText;
      case "en":
        return enUS.components.MuiDataGrid.defaultProps.localeText;
      default:
        return ptBR.components.MuiDataGrid.defaultProps.localeText;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("students.title")}
      </Typography>

      {/* Filtros e pesquisa */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("students.search")}
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">
                {t("students.filterStatus")}
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label={t("students.filterStatus")}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{t("students.allStatuses")}</MenuItem>
                <MenuItem value="active">{t("students.active")}</MenuItem>
                <MenuItem value="inactive">{t("students.inactive")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="plan-filter-label">
                {t("students.filterPlan")}
              </InputLabel>
              <Select
                labelId="plan-filter-label"
                value={planFilter}
                label={t("students.filterPlan")}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <MenuItem value="all">{t("students.allPlans")}</MenuItem>
                <MenuItem value="monthly">
                  {t("dashboard.monthlyPlan")}
                </MenuItem>
                <MenuItem value="quarterly">
                  {t("dashboard.quarterlyPlan")}
                </MenuItem>
                <MenuItem value="semiannual">
                  {t("dashboard.semiannualPlan")}
                </MenuItem>
                <MenuItem value="annual">{t("dashboard.annualPlan")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={applyFilters}
            >
              {t("students.applyFilters")}
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              {t("students.clearFilters")}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Botão para adicionar novo aluno */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
        >
          {t("students.add")}
        </Button>
      </Box>

      {/* Tabela de alunos */}
      <Paper
        elevation={2}
        sx={{ height: "calc(100vh - 300px)", width: "100%" }}
      >
        <DataGrid
          rows={filteredStudents}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          localeText={getDataGridLocalization()}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Paper>

      {/* Diálogo para adicionar/editar aluno */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? t("students.editStudent") : t("students.addStudent")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Informações pessoais */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t("students.personalInfo")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("students.name")}
                value={currentStudent?.name || ""}
                onChange={handleInputChange("name")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("students.email")}
                value={currentStudent?.email || ""}
                onChange={handleInputChange("email")}
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("students.phone")}
                value={currentStudent?.phone || ""}
                onChange={handleInputChange("phone")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("students.age")}
                value={currentStudent?.age || ""}
                onChange={handleInputChange("age")}
                type="number"
                InputProps={{
                  inputProps: { min: 0, max: 120 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">
                  {t("students.gender")}
                </InputLabel>
                <Select
                  labelId="gender-label"
                  value={currentStudent?.gender || "M"}
                  label={t("students.gender")}
                  onChange={handleInputChange("gender")}
                >
                  <MenuItem value="M">{t("students.male")}</MenuItem>
                  <MenuItem value="F">{t("students.female")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Informações da academia */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t("students.gymInfo")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t("students.joinDate")}
                  value={dayjs(currentStudent?.joinDate)}
                  onChange={handleJoinDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="plan-label">{t("students.plan")}</InputLabel>
                <Select
                  labelId="plan-label"
                  value={currentStudent?.plan || "monthly"}
                  label={t("students.plan")}
                  onChange={handleInputChange("plan")}
                >
                  <MenuItem value="monthly">
                    {t("dashboard.monthlyPlan")}
                  </MenuItem>
                  <MenuItem value="quarterly">
                    {t("dashboard.quarterlyPlan")}
                  </MenuItem>
                  <MenuItem value="semiannual">
                    {t("dashboard.semiannualPlan")}
                  </MenuItem>
                  <MenuItem value="annual">
                    {t("dashboard.annualPlan")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">
                  {t("students.status")}
                </InputLabel>
                <Select
                  labelId="status-label"
                  value={currentStudent?.status || "active"}
                  label={t("students.status")}
                  onChange={handleInputChange("status")}
                >
                  <MenuItem value="active">{t("students.active")}</MenuItem>
                  <MenuItem value="inactive">{t("students.inactive")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t("students.lastPayment")}
                  value={dayjs(currentStudent?.lastPayment)}
                  onChange={handleLastPaymentChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("students.goal")}
                value={currentStudent?.goal || ""}
                onChange={handleInputChange("goal")}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("buttons.cancel")}</Button>
          <Button
            onClick={handleSaveStudent}
            variant="contained"
            color="primary"
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

export default StudentList;
