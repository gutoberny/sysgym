import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { lightTheme, darkTheme } from "./themes/theme";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/StudentList";
import StudentWorkoutList from "./components/StudentWorkoutList";
import Login from "./components/Login";
import UserManagement from "./components/UserManagement";
import FinancialManagement from "./components/FinancialManagement";
import Reports from "./components/Reports";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./i18n";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./utils/AuthContext";

// Verifica se o site está em modo de demonstração
const isDemoMode = () => {
  // Você pode implementar lógica mais complexa aqui se necessário
  return (
    window.location.hostname.includes("vercel.app") ||
    process.env.NODE_ENV === "development"
  );
};

function AppContent() {
  // Estado para o tema
  const [theme, setTheme] = useState("light");

  // Estado para a navegação
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Estado para o idioma
  const [language, setLanguage] = useState("pt");
  const { i18n } = useTranslation();
  const { isAuthenticated, login } = useAuth();

  // Carregar preferência de tema e idioma do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Efeito para autologin em modo de demonstração
  useEffect(() => {
    if (isDemoMode() && !isAuthenticated) {
      // Login automático no modo de demonstração
      const demoEmail = "admin@demo.com";
      const demoPassword = "demo123";

      // Tentar fazer login automático após um pequeno atraso
      const timerId = setTimeout(() => {
        login(demoEmail, demoPassword);
      }, 500); // Pequeno delay para permitir que o sistema carregue

      return () => clearTimeout(timerId);
    }
  }, [isAuthenticated, login]);

  // Efeito para redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated && currentPage !== "login") {
      setCurrentPage("login");
    } else if (isAuthenticated && currentPage === "login") {
      // Redirecionar para dashboard quando fizer login
      setCurrentPage("dashboard");
    }
  }, [isAuthenticated, currentPage]);

  // Efeito para mudar o idioma quando o state mudar
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language, i18n]);

  // Função para alternar entre temas claro e escuro
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Renderizar o conteúdo com base na página atual
  const renderContent = () => {
    // Se não estiver autenticado, mostrar a tela de login
    if (!isAuthenticated) {
      return <Login />;
    }

    switch (currentPage) {
      case "dashboard":
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case "workouts":
        return (
          <ProtectedRoute requiredRole={["admin", "treinador"]}>
            <StudentWorkoutList />
          </ProtectedRoute>
        );
      case "students":
        return (
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        );
      case "finances":
        return (
          <ProtectedRoute requiredRole={["admin"]}>
            <FinancialManagement />
          </ProtectedRoute>
        );
      case "reports":
        return (
          <ProtectedRoute requiredRole={["admin"]}>
            <Reports />
          </ProtectedRoute>
        );
      case "student-form":
        return (
          <ProtectedRoute>
            <div>
              <Box sx={{ p: 3 }}>
                <h2>Formulário de Estudante</h2>
                <p>Esta funcionalidade será implementada em breve.</p>
              </Box>
            </div>
          </ProtectedRoute>
        );
      case "user-management":
        return (
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        );
      case "login":
        return <Login />;
      // Adicionar outras páginas conforme necessário
      default:
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
    }
  };

  // Se não estiver autenticado, mostrar apenas a tela de login
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100vh" }}>{renderContent()}</Box>
      </ThemeProvider>
    );
  }

  // Interface completa para usuários autenticados
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Menu Lateral */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Conteúdo Principal */}
        <Box sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
          <Header toggleTheme={toggleTheme} currentTheme={theme} />

          {/* Área de conteúdo */}
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
