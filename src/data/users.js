// Dados simulados de usuários
export const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@sysgym.com",
    password: "admin123",
    role: "admin",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Treinador Silva",
    email: "treinador@sysgym.com",
    password: "treinador123",
    role: "treinador",
    createdAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Atendente Santos",
    email: "atendente@sysgym.com",
    password: "atendente123",
    role: "atendente",
    createdAt: "2023-01-03T00:00:00.000Z",
  },
];

// Funções auxiliares para manipulação de usuários
export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const authenticateUser = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Funções para gerenciamento de usuários (em uma aplicação real, estas
// seriam chamadas para API)
export const getAllUsers = () => {
  return users.map(({ password, ...user }) => user);
};

export const getUserById = (id) => {
  const user = users.find((user) => user.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Em uma aplicação real, isso seria persistido em um banco de dados
export const addUser = (user) => {
  const newId = Math.max(...users.map((u) => u.id)) + 1;
  const newUser = {
    id: newId,
    ...user,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};
