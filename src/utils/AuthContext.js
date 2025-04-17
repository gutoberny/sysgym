import React, { createContext, useState, useContext, useEffect } from "react";
import { authenticateUser } from "../data/users";

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há um usuário armazenado no localStorage quando o componente monta
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Função para realizar login
  const login = (email, password) => {
    const user = authenticateUser(email, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: "Credenciais inválidas" };
  };

  // Função para realizar logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // Verificar se o usuário tem uma determinada função
  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (typeof roles === "string") {
      return currentUser.role === roles;
    }
    return roles.includes(currentUser.role);
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    currentUser,
    login,
    logout,
    hasRole,
    isAdmin: currentUser?.role === "admin",
    isTreinador: currentUser?.role === "treinador",
    isAtendente: currentUser?.role === "atendente",
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
