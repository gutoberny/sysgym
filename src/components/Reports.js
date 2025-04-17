import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BarChart, PieChart } from "@mui/x-charts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  AttachMoney as AttachMoneyIcon,
  PriceCheck as PriceCheckIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
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

// Importar os componentes de relatórios
import IncomeExpenseReport from "./reports/IncomeExpenseReport";
import DelinquencyReport from "./reports/DelinquencyReport";
import DetailedDelinquencyReport from "./reports/DetailedDelinquencyReport";

function Reports() {
  const { t } = useTranslation();

  // Estado para o relatório selecionado
  const [selectedReport, setSelectedReport] = useState("income-expense");

  // Estado para as transações
  const [allTransactions, setAllTransactions] = useState([]);

  // Estados para o relatório
  const [reportPeriod, setReportPeriod] = useState("current_month");
  const [reportYear, setReportYear] = useState(dayjs().year());
  const [reportMonth, setReportMonth] = useState(dayjs().month());

  // Estado para busca no relatório detalhado
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar transações no carregamento do componente
  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para obter dados para o relatório de receitas e despesas por mês
  const getIncomeExpenseData = () => {
    // Se não houver transações, retornar arrays vazios
    if (!Array.isArray(allTransactions) || allTransactions.length === 0) {
      return {
        income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }

    // Inicializar arrays com zeros para cada mês
    const incomeByMonth = Array(12).fill(0);
    const expenseByMonth = Array(12).fill(0);

    // Filtrar as transações pelo ano selecionado e somar por mês
    allTransactions.forEach((transaction) => {
      if (!transaction || !transaction.date) return;

      const date = dayjs(transaction.date);
      if (date.year() !== reportYear) return;

      const month = date.month();

      if (transaction.type === "income" && transaction.status === "paid") {
        incomeByMonth[month] += transaction.amount;
      } else if (
        transaction.type === "expense" &&
        transaction.status === "paid"
      ) {
        expenseByMonth[month] += transaction.amount;
      }
    });

    return {
      income: incomeByMonth,
      expense: expenseByMonth,
    };
  };

  // Função para obter dados para o relatório de inadimplência
  const getDelinquencyData = () => {
    // Se não houver transações, retornar objeto vazio
    if (!Array.isArray(allTransactions) || allTransactions.length === 0) {
      return {
        total: 0,
        count: 0,
        byMonth: {
          labels: [],
          data: [],
        },
        byStatus: {
          labels: ["Pendente", "Atrasado"],
          data: [0, 0],
        },
      };
    }

    // Filtra transações pendentes e atrasadas
    const delinquentTransactions = allTransactions.filter(
      (transaction) =>
        transaction?.type === "income" &&
        (transaction?.status === "pending" || transaction?.status === "overdue")
    );

    // Calcula o total de valores pendentes
    const totalAmount = delinquentTransactions.reduce(
      (total, transaction) => total + (transaction?.amount || 0),
      0
    );

    // Agrupa por status
    const pendingAmount = delinquentTransactions
      .filter((t) => t?.status === "pending")
      .reduce((total, t) => total + (t?.amount || 0), 0);

    const overdueAmount = delinquentTransactions
      .filter((t) => t?.status === "overdue")
      .reduce((total, t) => total + (t?.amount || 0), 0);

    // Agrupa por mês de vencimento
    const monthMap = new Map();
    delinquentTransactions.forEach((transaction) => {
      if (!transaction?.dueDate) return;

      const monthYear = dayjs(transaction.dueDate).format("MM/YYYY");
      const current = monthMap.get(monthYear) || 0;
      monthMap.set(monthYear, current + (transaction.amount || 0));
    });

    // Converte o mapa para arrays de labels e dados
    const monthLabels = Array.from(monthMap.keys());
    const monthData = Array.from(monthMap.values());

    return {
      total: totalAmount,
      count: delinquentTransactions.length,
      byMonth: {
        labels: monthLabels,
        data: monthData,
      },
      byStatus: {
        labels: ["Pendente", "Atrasado"],
        data: [pendingAmount, overdueAmount],
      },
    };
  };

  // Função para obter dados para o relatório detalhado de inadimplência
  const getDetailedDelinquencyData = () => {
    // Se não houver transações, retornar array vazio
    if (!Array.isArray(allTransactions) || allTransactions.length === 0) {
      return [];
    }

    // Filtra transações pendentes e atrasadas
    const delinquentTransactions = allTransactions.filter(
      (transaction) =>
        transaction?.type === "income" &&
        (transaction?.status === "pending" ||
          transaction?.status === "overdue") &&
        transaction?.category === 1 // Apenas mensalidades
    );

    // Agrupa por aluno
    const studentMap = new Map();

    delinquentTransactions.forEach((transaction) => {
      if (!transaction?.relatedPerson?.id) return;

      const studentId = transaction.relatedPerson.id;
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: studentId,
          name: transaction.relatedPerson.name,
          email: `${transaction.relatedPerson.name
            .toLowerCase()
            .replace(/\s/g, ".")}@email.com`,
          phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${
            Math.floor(Math.random() * 9000) + 1000
          }`,
          transactions: [],
          totalAmount: 0,
          maxDaysLate: 0,
        });
      }

      const student = studentMap.get(studentId);

      // Calcular dias em atraso
      let daysLate = 0;
      if (transaction.status === "overdue" && transaction.dueDate) {
        daysLate = dayjs().diff(dayjs(transaction.dueDate), "day");
      }

      // Atualizar dados do aluno
      student.transactions.push({
        ...transaction,
        daysLate,
      });

      student.totalAmount += transaction.amount;
      student.maxDaysLate = Math.max(student.maxDaysLate, daysLate);
    });

    // Converter o mapa para array
    return Array.from(studentMap.values());
  };

  // Função para filtrar os dados de inadimplência por nome do aluno
  const getFilteredDelinquencyData = () => {
    const data = getDetailedDelinquencyData();

    if (!searchTerm) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.phone.toLowerCase().includes(searchLower)
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t("reports.title", "Relatórios")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(
            "reports.subtitle",
            "Selecione um relatório para visualizar informações detalhadas"
          )}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Menu lateral de relatórios */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ width: "100%" }}>
            <List component="nav" aria-label="relatórios disponíveis">
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedReport === "income-expense"}
                  onClick={() => setSelectedReport("income-expense")}
                >
                  <ListItemIcon>
                    <BarChartIcon
                      color={
                        selectedReport === "income-expense"
                          ? "primary"
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("reports.incomeExpense", "Receitas e Despesas")}
                    primaryTypographyProps={{
                      fontWeight:
                        selectedReport === "income-expense" ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedReport === "delinquency"}
                  onClick={() => setSelectedReport("delinquency")}
                >
                  <ListItemIcon>
                    <PieChartIcon
                      color={
                        selectedReport === "delinquency" ? "primary" : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("reports.delinquency", "Inadimplência")}
                    primaryTypographyProps={{
                      fontWeight:
                        selectedReport === "delinquency" ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedReport === "detailed-delinquency"}
                  onClick={() => setSelectedReport("detailed-delinquency")}
                >
                  <ListItemIcon>
                    <PersonIcon
                      color={
                        selectedReport === "detailed-delinquency"
                          ? "primary"
                          : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(
                      "reports.detailedDelinquency",
                      "Inadimplência Detalhada"
                    )}
                    primaryTypographyProps={{
                      fontWeight:
                        selectedReport === "detailed-delinquency"
                          ? "bold"
                          : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <Divider sx={{ my: 1 }} />
              <Typography variant="overline" sx={{ pl: 2, opacity: 0.7 }}>
                {t("common.comingSoon", "Em breve")}
              </Typography>

              <ListItem disablePadding>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <AttachMoneyIcon color="disabled" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("reports.cashFlow", "Fluxo de Caixa")}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <PriceCheckIcon color="disabled" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(
                      "reports.studentRevenue",
                      "Faturamento por Aluno"
                    )}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Área de conteúdo do relatório */}
        <Grid item xs={12} md={9}>
          {selectedReport === "income-expense" && (
            <IncomeExpenseReport transactions={allTransactions} />
          )}
          {selectedReport === "delinquency" && (
            <DelinquencyReport transactions={allTransactions} />
          )}
          {selectedReport === "detailed-delinquency" && (
            <DetailedDelinquencyReport transactions={allTransactions} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;
