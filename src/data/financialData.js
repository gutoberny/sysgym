// Dados de exemplo para o sistema financeiro da academia

// Categorias de transações (receitas)
export const incomeCategories = [
  {
    id: 1,
    name: "Mensalidade",
    description: "Pagamentos de mensalidade dos alunos",
  },
  {
    id: 2,
    name: "Matrícula",
    description: "Taxas de matrícula de novos alunos",
  },
  {
    id: 3,
    name: "Avaliação Física",
    description: "Pagamentos de avaliações físicas",
  },
  {
    id: 4,
    name: "Personal Trainer",
    description: "Sessões de personal trainer",
  },
  {
    id: 5,
    name: "Venda de Produtos",
    description: "Venda de suplementos, roupas e acessórios",
  },
  { id: 6, name: "Outros", description: "Outras receitas" },
];

// Categorias de transações (despesas)
export const expenseCategories = [
  {
    id: 1,
    name: "Salários",
    description: "Pagamentos de funcionários e instrutores",
  },
  { id: 2, name: "Aluguel", description: "Aluguel do espaço físico" },
  {
    id: 3,
    name: "Equipamentos",
    description: "Compra e manutenção de equipamentos",
  },
  { id: 4, name: "Serviços", description: "Água, luz, internet, etc." },
  { id: 5, name: "Marketing", description: "Publicidade e promoções" },
  { id: 6, name: "Limpeza", description: "Materiais e serviços de limpeza" },
  { id: 7, name: "Impostos", description: "Impostos e taxas" },
  { id: 8, name: "Seguros", description: "Seguros do espaço e equipamentos" },
  {
    id: 9,
    name: "Suprimentos",
    description: "Materiais de escritório e outros suprimentos",
  },
  { id: 10, name: "Outros", description: "Outras despesas" },
];

// Status possíveis para transações
export const transactionStatus = [
  { id: "pending", name: "Pendente", color: "#FFA726" },
  { id: "paid", name: "Pago", color: "#66BB6A" },
  { id: "overdue", name: "Atrasado", color: "#EF5350" },
  { id: "cancelled", name: "Cancelado", color: "#9E9E9E" },
];

// Métodos de pagamento
export const paymentMethods = [
  { id: "cash", name: "Dinheiro" },
  { id: "credit_card", name: "Cartão de Crédito" },
  { id: "debit_card", name: "Cartão de Débito" },
  { id: "bank_transfer", name: "Transferência Bancária" },
  { id: "pix", name: "PIX" },
  { id: "boleto", name: "Boleto" },
];

// Transações de exemplo
export const transactions = [
  {
    id: 1,
    type: "income",
    description: "Mensalidade - João Silva",
    amount: 120.0,
    date: "2023-10-05",
    dueDate: "2023-10-10",
    category: 1,
    status: "paid",
    paymentMethod: "credit_card",
    relatedPerson: {
      id: 101,
      name: "João Silva",
      type: "student",
    },
    notes: "Pagamento antecipado",
  },
  {
    id: 2,
    type: "income",
    description: "Matrícula - Maria Oliveira",
    amount: 80.0,
    date: "2023-10-03",
    dueDate: "2023-10-03",
    category: 2,
    status: "paid",
    paymentMethod: "pix",
    relatedPerson: {
      id: 102,
      name: "Maria Oliveira",
      type: "student",
    },
    notes: "",
  },
  {
    id: 3,
    type: "expense",
    description: "Conta de Energia",
    amount: 450.0,
    date: null,
    dueDate: "2023-10-15",
    category: 4,
    status: "pending",
    paymentMethod: null,
    relatedPerson: {
      id: 201,
      name: "Companhia de Energia",
      type: "supplier",
    },
    notes: "Referente ao mês de setembro",
  },
  {
    id: 4,
    type: "expense",
    description: "Salário - Instrutor Carlos",
    amount: 2000.0,
    date: null,
    dueDate: "2023-10-05",
    category: 1,
    status: "overdue",
    paymentMethod: null,
    relatedPerson: {
      id: 301,
      name: "Carlos Mendes",
      type: "employee",
    },
    notes: "Salário mensal",
  },
  {
    id: 5,
    type: "income",
    description: "Avaliação Física - Pedro Santos",
    amount: 50.0,
    date: "2023-10-01",
    dueDate: "2023-10-01",
    category: 3,
    status: "paid",
    paymentMethod: "cash",
    relatedPerson: {
      id: 103,
      name: "Pedro Santos",
      type: "student",
    },
    notes: "",
  },
  {
    id: 6,
    type: "expense",
    description: "Manutenção Esteira",
    amount: 300.0,
    date: "2023-09-28",
    dueDate: "2023-09-28",
    category: 3,
    status: "paid",
    paymentMethod: "debit_card",
    relatedPerson: {
      id: 202,
      name: "Técnico Equipamentos",
      type: "supplier",
    },
    notes: "Troca de peças e manutenção preventiva",
  },
  {
    id: 7,
    type: "income",
    description: "Mensalidade - Ana Costa",
    amount: 120.0,
    date: null,
    dueDate: "2023-10-12",
    category: 1,
    status: "pending",
    paymentMethod: null,
    relatedPerson: {
      id: 104,
      name: "Ana Costa",
      type: "student",
    },
    notes: "",
  },
  {
    id: 8,
    type: "expense",
    description: "Material de Limpeza",
    amount: 180.0,
    date: "2023-10-02",
    dueDate: "2023-10-02",
    category: 6,
    status: "paid",
    paymentMethod: "credit_card",
    relatedPerson: {
      id: 203,
      name: "Distribuidora Limpeza",
      type: "supplier",
    },
    notes: "Compra mensal",
  },
  {
    id: 9,
    type: "income",
    description: "Venda de Suplementos",
    amount: 75.0,
    date: "2023-10-04",
    dueDate: "2023-10-04",
    category: 5,
    status: "paid",
    paymentMethod: "cash",
    relatedPerson: {
      id: 105,
      name: "Ricardo Gomes",
      type: "student",
    },
    notes: "Whey Protein 500g",
  },
  {
    id: 10,
    type: "expense",
    description: "Aluguel",
    amount: 3500.0,
    date: null,
    dueDate: "2023-10-10",
    category: 2,
    status: "pending",
    paymentMethod: null,
    relatedPerson: {
      id: 204,
      name: "Imobiliária Central",
      type: "supplier",
    },
    notes: "Referente ao mês de outubro",
  },
];

// Funções auxiliares para cálculos financeiros
export const getTransactionsByType = (type) => {
  return transactions.filter((transaction) => transaction.type === type);
};

export const getTransactionsByStatus = (status) => {
  return transactions.filter((transaction) => transaction.status === status);
};

export const getTotalByType = (type) => {
  return getTransactionsByType(type).reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
};

export const getTotalByStatus = (status, type = null) => {
  let filtered = transactions.filter(
    (transaction) => transaction.status === status
  );

  if (type) {
    filtered = filtered.filter((transaction) => transaction.type === type);
  }

  return filtered.reduce((total, transaction) => total + transaction.amount, 0);
};

export const getCategoryName = (categoryId, type) => {
  const categories = type === "income" ? incomeCategories : expenseCategories;
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Desconhecido";
};

export const getPaymentMethodName = (methodId) => {
  const method = paymentMethods.find((method) => method.id === methodId);
  return method ? method.name : "Desconhecido";
};

export const getStatusName = (statusId) => {
  const status = transactionStatus.find((status) => status.id === statusId);
  return status ? status.name : "Desconhecido";
};

export const getStatusColor = (statusId) => {
  const status = transactionStatus.find((status) => status.id === statusId);
  return status ? status.color : "#9E9E9E";
};
