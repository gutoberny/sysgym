import React from "react";
import { useAuth } from "./AuthContext";
import { Box, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Componente para proteger rotas que exigem autenticação e/ou permissões específicas
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se as condições forem atendidas
 * @param {string|string[]} [props.requiredRole] - Papel(is) necessário(s) para acessar esta rota
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { t } = useTranslation();
  const { isAuthenticated, hasRole } = useAuth();

  // Verifica se o usuário está autenticado
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t("auth.loginRequired")}</Alert>
      </Box>
    );
  }

  // Se não há perfil exigido, apenas verifica autenticação
  if (!requiredRole) {
    return children;
  }

  // Verifica se o usuário tem o perfil necessário
  if (!hasRole(requiredRole)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t("auth.notAuthorized")}</Alert>
      </Box>
    );
  }

  // Se passou por todas as verificações, renderiza o componente
  return children;
};

export default ProtectedRoute;
