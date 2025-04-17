import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const theme = useTheme();

  // Auto-login predefinido para modo de demonstração
  const handleLogin = (e) => {
    e.preventDefault();

    // Login automático como administrador
    const demoEmail = "admin@demo.com";
    const demoPassword = "demo123";

    // Chamar a função de login com credenciais pré-definidas
    login(demoEmail, demoPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {t("login.title")}
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            Versão de demonstração - Acesso sem credenciais
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("login.signIn")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
