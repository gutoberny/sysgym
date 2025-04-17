import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../utils/AuthContext";
import { getAllUsers, addUser } from "../data/users";

const UserManagement = () => {
  const { t } = useTranslation();
  const { hasRole, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "atendente",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Carregar usuários
  useEffect(() => {
    const loadUsers = () => {
      try {
        const allUsers = getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        showSnackbar(error.message, "error");
      }
    };

    loadUsers();
  }, []);

  // Verificar se o usuário tem permissão para acessar esta página
  if (!hasRole("admin")) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t("auth.adminRequired")}</Alert>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpar erros quando o usuário digita
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = t("users.invalidData");
    }

    if (!formData.email.trim()) {
      errors.email = t("users.invalidData");
    }

    if (selectedUser === null && !formData.password.trim()) {
      errors.password = t("users.invalidData");
    }

    if (
      selectedUser === null &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = t("users.passwordsMustMatch");
    }

    if (!formData.role) {
      errors.role = t("users.invalidData");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "atendente",
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = () => {
    // Em uma aplicação real, isso seria uma chamada à API
    try {
      const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      showSnackbar(t("users.userDeleted"), "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    }
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (selectedUser === null) {
        // Adicionar novo usuário
        const { confirmPassword, ...userData } = formData;
        const newUser = addUser(userData);
        setUsers([...users, newUser]);
        showSnackbar(t("users.userAdded"), "success");
      } else {
        // Atualizar usuário existente
        const { confirmPassword, ...userData } = formData;
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...userData,
                password: userData.password || user.password,
              }
            : user
        );
        setUsers(updatedUsers);
        showSnackbar(t("users.userUpdated"), "success");
      }

      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          {t("users.management")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddUser}
        >
          {t("users.addUser")}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("users.name")}</TableCell>
              <TableCell>{t("users.email")}</TableCell>
              <TableCell>{t("users.role")}</TableCell>
              <TableCell>{t("users.createdAt")}</TableCell>
              <TableCell align="right">{t("users.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{t(`users.${user.role}`)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditUser(user)}
                    disabled={user.id === currentUser?.id}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user)}
                    disabled={user.id === currentUser?.id}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar usuário */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? t("users.editUser") : t("users.addUser")}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t("users.name")}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("users.email")}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              label={t("users.password")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required={selectedUser === null}
            />
            <TextField
              margin="normal"
              fullWidth
              id="confirmPassword"
              label={t("users.confirmPassword")}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              required={selectedUser === null}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">{t("users.role")}</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label={t("users.role")}
                onChange={handleInputChange}
                error={!!formErrors.role}
              >
                <MenuItem value="admin">{t("users.admin")}</MenuItem>
                <MenuItem value="treinador">{t("users.treinador")}</MenuItem>
                <MenuItem value="atendente">{t("users.atendente")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {t("buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmação para excluir usuário */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t("users.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>{userToDelete?.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button onClick={confirmDeleteUser} color="error">
            {t("buttons.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
};

export default UserManagement;
