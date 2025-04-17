import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Tooltip,
  Snackbar,
  Alert,
  Stack,
  TextField,
  IconButton,
  Card,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AttachMoney as AttachMoneyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  transactions,
  incomeCategories,
  expenseCategories,
  transactionStatus,
  paymentMethods,
  getCategoryName,
  getPaymentMethodName,
  getStatusName,
  getStatusColor,
} from "../data/financialData";

function FinancialManagement() {
  // Usando a tradução apenas para elementos que precisam ser internacionalizados
  const { t } = useTranslation();

  // Estado para a aba atual
  const [currentTab, setCurrentTab] = useState("receivables");

  // Estado para as transações
  const [allTransactions, setAllTransactions] = useState([]);

  // Estado para o diálogo de geração de mensalidades
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [monthToGenerate, setMonthToGenerate] = useState(dayjs());

  // Estado para a transação selecionada para edição/detalhes
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Estado para o diálogo de nova transação
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);

  // Estado para o diálogo de exclusão
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Estado para snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Estado para o diálogo de filtros
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  // Estado para os filtros
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateFrom: null,
    dateTo: null,
    category: "all",
    amountMin: "",
    amountMax: "",
    searchTerm: "",
  });

  // Estado para o formulário de nova transação
  const [transactionForm, setTransactionForm] = useState({
    id: null,
    type: "income",
    description: "",
    amount: "",
    date: null,
    dueDate: null,
    category: "",
    status: "pending",
    paymentMethod: "",
    relatedPerson: {
      id: "",
      name: "",
      type: "",
    },
    notes: "",
  });

  // Estado para erros de validação do formulário
  const [formErrors, setFormErrors] = useState({});

  // Carregar transações no carregamento do componente
  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  // Função para trocar a aba atual
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Função para abrir o diálogo de nova transação
  const handleOpenTransactionDialog = (transaction = null) => {
    if (transaction) {
      // Editar transação existente
      setTransactionForm({
        ...transaction,
        date: transaction.date ? dayjs(transaction.date) : null,
        dueDate: transaction.dueDate ? dayjs(transaction.dueDate) : null,
      });
      setSelectedTransaction(transaction);
    } else {
      // Nova transação
      setTransactionForm({
        id: null,
        type: "income",
        description: "",
        amount: "",
        date: null,
        dueDate: null,
        category: "",
        status: "pending",
        paymentMethod: "",
        relatedPerson: {
          id: "",
          name: "",
          type: "",
        },
        notes: "",
      });
      setSelectedTransaction(null);
    }
    setFormErrors({});
    setOpenTransactionDialog(true);
  };

  // Função para fechar o diálogo de transação
  const handleCloseTransactionDialog = () => {
    setOpenTransactionDialog(false);
  };

  // Função para validar o formulário de transação
  const validateTransactionForm = () => {
    const errors = {};

    if (!transactionForm.description.trim()) {
      errors.description = "Descrição é obrigatória";
    }

    if (
      !transactionForm.amount ||
      isNaN(transactionForm.amount) ||
      parseFloat(transactionForm.amount) <= 0
    ) {
      errors.amount = "Valor deve ser um número positivo";
    }

    if (!transactionForm.dueDate) {
      errors.dueDate = "Data de vencimento é obrigatória";
    }

    if (!transactionForm.category) {
      errors.category = "Categoria é obrigatória";
    }

    if (transactionForm.status === "paid" && !transactionForm.paymentMethod) {
      errors.paymentMethod =
        "Método de pagamento é obrigatório para transações pagas";
    }

    if (transactionForm.status === "paid" && !transactionForm.date) {
      errors.date = "Data de pagamento é obrigatória para transações pagas";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Função para salvar uma transação (nova ou editada)
  const handleSaveTransaction = () => {
    if (!validateTransactionForm()) {
      return;
    }

    const newTransaction = {
      ...transactionForm,
      id: transactionForm.id || allTransactions.length + 1,
      amount: parseFloat(transactionForm.amount),
      date: transactionForm.date
        ? transactionForm.date.format("YYYY-MM-DD")
        : null,
      dueDate: transactionForm.dueDate
        ? transactionForm.dueDate.format("YYYY-MM-DD")
        : null,
    };

    if (selectedTransaction) {
      // Editar transação existente
      const updatedTransactions = allTransactions.map((t) =>
        t.id === newTransaction.id ? newTransaction : t
      );
      setAllTransactions(updatedTransactions);
      setSnackbar({
        open: true,
        message: "Transação atualizada com sucesso!",
        severity: "success",
      });
    } else {
      // Adicionar nova transação
      setAllTransactions([...allTransactions, newTransaction]);
      setSnackbar({
        open: true,
        message: "Transação adicionada com sucesso!",
        severity: "success",
      });
    }

    handleCloseTransactionDialog();
  };

  // Função para abrir o diálogo de exclusão
  const handleOpenDeleteDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDeleteDialog(true);
  };

  // Função para fechar o diálogo de exclusão
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Função para excluir uma transação
  const handleDeleteTransaction = () => {
    const updatedTransactions = allTransactions.filter(
      (t) => t.id !== selectedTransaction.id
    );
    setAllTransactions(updatedTransactions);
    setSnackbar({
      open: true,
      message: "Transação excluída com sucesso!",
      severity: "success",
    });
    handleCloseDeleteDialog();
  };

  // Função para atualizar o status de uma transação (dar baixa)
  const handleUpdateTransactionStatus = (transaction, newStatus) => {
    const updatedTransaction = {
      ...transaction,
      status: newStatus,
      date:
        newStatus === "paid" ? dayjs().format("YYYY-MM-DD") : transaction.date,
    };

    const updatedTransactions = allTransactions.map((t) =>
      t.id === transaction.id ? updatedTransaction : t
    );

    setAllTransactions(updatedTransactions);
    setSnackbar({
      open: true,
      message: `Status atualizado para: ${getStatusName(newStatus)}`,
      severity: "success",
    });
  };

  // Função para fechar o snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Função para atualizar o filtro
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Função para aplicar os filtros
  const handleApplyFilters = () => {
    setOpenFilterDialog(false);
  };

  // Função para limpar os filtros
  const handleClearFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateFrom: null,
      dateTo: null,
      category: "all",
      amountMin: "",
      amountMax: "",
      searchTerm: "",
    });
  };

  // Função para atualizar o campo do formulário
  const handleFormChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setTransactionForm({
        ...transactionForm,
        [parent]: {
          ...transactionForm[parent],
          [child]: value,
        },
      });
    } else {
      setTransactionForm({
        ...transactionForm,
        [field]: value,
      });
    }
  };

  // Função para filtrar as transações
  const getFilteredTransactions = () => {
    return allTransactions.filter((transaction) => {
      // Filtrar por tipo
      if (filters.type !== "all" && transaction.type !== filters.type) {
        return false;
      }

      // Filtrar por status
      if (filters.status !== "all" && transaction.status !== filters.status) {
        return false;
      }

      // Filtrar por data de início
      if (
        filters.dateFrom &&
        transaction.dueDate &&
        dayjs(transaction.dueDate).isBefore(dayjs(filters.dateFrom))
      ) {
        return false;
      }

      // Filtrar por data de fim
      if (
        filters.dateTo &&
        transaction.dueDate &&
        dayjs(transaction.dueDate).isAfter(dayjs(filters.dateTo))
      ) {
        return false;
      }

      // Filtrar por categoria
      if (filters.category !== "all") {
        if (parseInt(filters.category) !== transaction.category) {
          return false;
        }
      }

      // Filtrar por valor mínimo
      if (
        filters.amountMin &&
        transaction.amount < parseFloat(filters.amountMin)
      ) {
        return false;
      }

      // Filtrar por valor máximo
      if (
        filters.amountMax &&
        transaction.amount > parseFloat(filters.amountMax)
      ) {
        return false;
      }

      // Filtrar por termo de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const descriptionMatch = transaction.description
          .toLowerCase()
          .includes(searchLower);
        const relatedPersonMatch = transaction.relatedPerson.name
          .toLowerCase()
          .includes(searchLower);
        const notesMatch = transaction.notes
          .toLowerCase()
          .includes(searchLower);

        if (!descriptionMatch && !relatedPersonMatch && !notesMatch) {
          return false;
        }
      }

      return true;
    });
  };

  // Obter transações a receber (mensalidades)
  const getReceivableTransactions = () => {
    // Certifique-se de que allTransactions existe e é um array
    if (!Array.isArray(allTransactions)) return [];

    return allTransactions.filter((transaction) => {
      if (!transaction) return false;

      return (
        transaction.type === "income" &&
        transaction.category === 1 && // Categoria 1 = Mensalidade
        (transaction.status === "pending" || transaction.status === "overdue")
      );
    });
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Colunas para a tabela de transações
  const transactionColumns = [
    {
      field: "type",
      headerName: "Tipo",
      width: 100,
      renderCell: (params) => {
        // Verificar se o valor existe
        if (!params.value) {
          return <Chip label="Desconhecido" size="small" />;
        }

        return (
          <Chip
            icon={
              params.value === "income" ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )
            }
            label={params.value === "income" ? "Receita" : "Despesa"}
            color={params.value === "income" ? "success" : "error"}
            size="small"
          />
        );
      },
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "amount",
      headerName: "Valor",
      width: 120,
      renderCell: (params) => {
        // Verificar se o valor existe e se a row existe
        if (!params.value || !params.row) {
          return "R$ 0,00";
        }

        return (
          <Typography
            sx={{
              color:
                params.row.type === "income" ? "success.main" : "error.main",
            }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(params.value)}
          </Typography>
        );
      },
    },
    {
      field: "dueDate",
      headerName: "Vencimento",
      width: 120,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "date",
      headerName: "Pagamento",
      width: 120,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "category",
      headerName: "Categoria",
      width: 150,
      valueFormatter: (params) => {
        if (!params.value || !params.row) return "Desconhecido";
        const type = params.row.type || "income";
        return getCategoryName(params.value, type);
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        // Verificar se o valor existe
        if (!params.value) {
          return <Chip label="Desconhecido" size="small" />;
        }

        return (
          <Chip
            label={getStatusName(params.value)}
            size="small"
            sx={{
              bgcolor: `${getStatusColor(params.value)}20`,
              color: getStatusColor(params.value),
            }}
          />
        );
      },
    },
    {
      field: "paymentMethod",
      headerName: "Método",
      width: 150,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return getPaymentMethodName(params.value);
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Verificar se row existe para evitar erros
        if (!params.row) return null;

        return (
          <Box>
            {(params.row.status === "pending" ||
              params.row.status === "overdue") && (
              <Tooltip title="Dar baixa">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() =>
                    handleUpdateTransactionStatus(params.row, "paid")
                  }
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Editar">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenTransactionDialog(params.row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleOpenDeleteDialog(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Função para abrir o diálogo de geração de mensalidades
  const handleOpenGenerateDialog = () => {
    setOpenGenerateDialog(true);
  };

  // Função para fechar o diálogo de geração de mensalidades
  const handleCloseGenerateDialog = () => {
    setOpenGenerateDialog(false);
  };

  // Função para gerar mensalidades
  const handleGenerateMensalidades = () => {
    // Aqui teria a lógica para gerar as mensalidades para todos os alunos
    // Como não temos uma lista de alunos real, vamos simular com alguns exemplos

    const mesAno = monthToGenerate.format("MM/YYYY");
    const novasMensalidades = [
      {
        id: allTransactions.length + 1,
        type: "income",
        description: `Mensalidade ${mesAno} - João Silva`,
        amount: 120.0,
        date: null,
        dueDate: monthToGenerate.date(10).format("YYYY-MM-DD"),
        category: 1,
        status: "pending",
        paymentMethod: null,
        relatedPerson: {
          id: 101,
          name: "João Silva",
          type: "student",
        },
        notes: `Mensalidade referente a ${mesAno}`,
      },
      {
        id: allTransactions.length + 2,
        type: "income",
        description: `Mensalidade ${mesAno} - Maria Oliveira`,
        amount: 120.0,
        date: null,
        dueDate: monthToGenerate.date(10).format("YYYY-MM-DD"),
        category: 1,
        status: "pending",
        paymentMethod: null,
        relatedPerson: {
          id: 102,
          name: "Maria Oliveira",
          type: "student",
        },
        notes: `Mensalidade referente a ${mesAno}`,
      },
      {
        id: allTransactions.length + 3,
        type: "income",
        description: `Mensalidade ${mesAno} - Pedro Santos`,
        amount: 120.0,
        date: null,
        dueDate: monthToGenerate.date(10).format("YYYY-MM-DD"),
        category: 1,
        status: "pending",
        paymentMethod: null,
        relatedPerson: {
          id: 103,
          name: "Pedro Santos",
          type: "student",
        },
        notes: `Mensalidade referente a ${mesAno}`,
      },
      {
        id: allTransactions.length + 4,
        type: "income",
        description: `Mensalidade ${mesAno} - Ana Costa`,
        amount: 120.0,
        date: null,
        dueDate: monthToGenerate.date(10).format("YYYY-MM-DD"),
        category: 1,
        status: "pending",
        paymentMethod: null,
        relatedPerson: {
          id: 104,
          name: "Ana Costa",
          type: "student",
        },
        notes: `Mensalidade referente a ${mesAno}`,
      },
      {
        id: allTransactions.length + 5,
        type: "income",
        description: `Mensalidade ${mesAno} - Ricardo Gomes`,
        amount: 120.0,
        date: null,
        dueDate: monthToGenerate.date(10).format("YYYY-MM-DD"),
        category: 1,
        status: "pending",
        paymentMethod: null,
        relatedPerson: {
          id: 105,
          name: "Ricardo Gomes",
          type: "student",
        },
        notes: `Mensalidade referente a ${mesAno}`,
      },
    ];

    setAllTransactions([...allTransactions, ...novasMensalidades]);

    setSnackbar({
      open: true,
      message: `Mensalidades para ${mesAno} geradas com sucesso!`,
      severity: "success",
    });

    handleCloseGenerateDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Gestão Financeira
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AttachMoneyIcon />}
              onClick={handleOpenGenerateDialog}
            >
              Gerar Mensalidades
            </Button>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenTransactionDialog()}
            >
              Nova Transação
            </Button>
          </Stack>
        </Box>

        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Contas a Receber" value="receivables" />
          <Tab label="Contas a Pagar" value="payables" />
          <Tab label="Histórico" value="history" />
          <Tab label="Visão Geral" value="overview" />
        </Tabs>
      </Paper>

      {/* Conteúdo para a aba de contas a receber */}
      {currentTab === "receivables" && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Mensalidades a Receber</Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  placeholder="Buscar..."
                  size="small"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setOpenFilterDialog(true)}
                  size="small"
                >
                  Filtros
                </Button>
              </Box>
            </Box>

            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={getReceivableTransactions()}
                columns={transactionColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                autoHeight
              />
            </Box>
          </Paper>
        </>
      )}

      {/* Conteúdo para a aba de contas a pagar */}
      {currentTab === "payables" && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contas a Pagar
          </Typography>
          {/* Interface para contas a pagar será implementada aqui */}
          <Typography>
            Esta funcionalidade será implementada em breve.
          </Typography>
        </Paper>
      )}

      {/* Conteúdo para a aba de histórico */}
      {currentTab === "history" && (
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("finances.historyTitle", "Histórico de Transações")}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                placeholder={t("finances.search", "Buscar...")}
                size="small"
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setOpenFilterDialog(true)}
                size="small"
              >
                {t("finances.filters", "Filtros")}
              </Button>
            </Box>
          </Box>

          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={getFilteredTransactions()}
              columns={transactionColumns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              autoHeight
            />
          </Box>
        </Paper>
      )}

      {/* Conteúdo para a aba de visão geral */}
      {currentTab === "overview" && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Visão Geral
          </Typography>
          {/* Interface para visão geral será implementada aqui */}
          <Typography>
            Esta funcionalidade será implementada em breve.
          </Typography>
        </Paper>
      )}

      {/* Diálogo de Gerar Mensalidades */}
      <Dialog open={openGenerateDialog} onClose={handleCloseGenerateDialog}>
        <DialogTitle>Gerar Mensalidades</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Selecione o mês para gerar as mensalidades dos alunos.
          </DialogContentText>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label="Mês/Ano de Referência"
              value={monthToGenerate}
              onChange={(newValue) => setMonthToGenerate(newValue)}
              views={["month", "year"]}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenerateDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleGenerateMensalidades}
            color="primary"
            variant="contained"
          >
            Gerar Mensalidades
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de exclusão */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta transação? Esta ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteTransaction}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Nova/Editar Transação */}
      <Dialog
        open={openTransactionDialog}
        onClose={handleCloseTransactionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTransaction ? "Editar Transação" : "Nova Transação"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={transactionForm.type}
                  label="Tipo"
                  onChange={(e) => handleFormChange("type", e.target.value)}
                >
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="expense">Despesa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.category}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={transactionForm.category}
                  label="Categoria"
                  onChange={(e) => handleFormChange("category", e.target.value)}
                >
                  {transactionForm.type === "income"
                    ? incomeCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    : expenseCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                </Select>
                {formErrors.category && (
                  <FormHelperText>{formErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={transactionForm.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                value={transactionForm.amount}
                onChange={(e) => handleFormChange("amount", e.target.value)}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={transactionForm.status}
                  label="Status"
                  onChange={(e) => handleFormChange("status", e.target.value)}
                >
                  {transactionStatus.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Data de Vencimento"
                  value={transactionForm.dueDate}
                  onChange={(newValue) => handleFormChange("dueDate", newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.dueDate,
                      helperText: formErrors.dueDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Data de Pagamento"
                  value={transactionForm.date}
                  onChange={(newValue) => handleFormChange("date", newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.date,
                      helperText: formErrors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.paymentMethod}>
                <InputLabel>Método de Pagamento</InputLabel>
                <Select
                  value={transactionForm.paymentMethod || ""}
                  label="Método de Pagamento"
                  onChange={(e) =>
                    handleFormChange("paymentMethod", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>Selecione um método</em>
                  </MenuItem>
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.paymentMethod && (
                  <FormHelperText>{formErrors.paymentMethod}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pessoa Relacionada"
                value={transactionForm.relatedPerson.name}
                onChange={(e) =>
                  handleFormChange("relatedPerson.name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={transactionForm.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransactionDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveTransaction}
            color="primary"
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Filtros */}
      <Dialog
        open={openFilterDialog}
        onClose={() => setOpenFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtrar Transações</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.type}
                  label="Tipo"
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="income">Receitas</MenuItem>
                  <MenuItem value="expense">Despesas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {transactionStatus.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Data Inicial"
                  value={filters.dateFrom}
                  onChange={(newValue) =>
                    handleFilterChange("dateFrom", newValue)
                  }
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Data Final"
                  value={filters.dateTo}
                  onChange={(newValue) =>
                    handleFilterChange("dateTo", newValue)
                  }
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Mínimo"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                value={filters.amountMin}
                onChange={(e) =>
                  handleFilterChange("amountMin", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Máximo"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                value={filters.amountMax}
                onChange={(e) =>
                  handleFilterChange("amountMax", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} color="secondary">
            Limpar Filtros
          </Button>
          <Button
            onClick={handleApplyFilters}
            color="primary"
            variant="contained"
          >
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FinancialManagement;
