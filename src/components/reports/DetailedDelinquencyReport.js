import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  Button,
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
  useTheme,
  alpha,
} from "@mui/material";
import dayjs from "dayjs";
import {
  Person as PersonIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function DetailedDelinquencyReport({ transactions }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para obter dados para o relatório detalhado de inadimplência
  const getDetailedDelinquencyData = () => {
    // Se não houver transações, retornar array vazio
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }

    // Filtra transações pendentes e atrasadas
    const delinquentTransactions = transactions.filter(
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

  const delinquencyData = getFilteredDelinquencyData();

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">
          {t(
            "reports.detailedDelinquencyTitle",
            "Relatório Detalhado de Inadimplência"
          )}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder={t("reports.searchStudent", "Buscar aluno...")}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title={t("reports.downloadReport", "Baixar Relatório")}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              size="small"
            >
              {t("reports.export", "Exportar")}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box
          sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.7) }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {t("reports.summary", "Resumo")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                {t(
                  "reports.totalStudentsWithDebt",
                  "Total de Alunos Inadimplentes"
                )}
                :
              </Typography>
              <Typography variant="h6" color="error">
                {delinquencyData.length}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                {t("reports.totalOutstandingAmount", "Valor Total em Aberto")}:
              </Typography>
              <Typography variant="h6" color="error">
                {formatCurrency(
                  delinquencyData.reduce(
                    (total, student) => total + student.totalAmount,
                    0
                  )
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                {t("reports.averageDebtPerStudent", "Média por Aluno")}:
              </Typography>
              <Typography variant="h6" color="error">
                {delinquencyData.length > 0
                  ? formatCurrency(
                      delinquencyData.reduce(
                        (total, student) => total + student.totalAmount,
                        0
                      ) / delinquencyData.length
                    )
                  : formatCurrency(0)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("reports.student", "Aluno")}</TableCell>
              <TableCell>{t("reports.contact", "Contato")}</TableCell>
              <TableCell>
                {t("reports.pendingTransactions", "Transações Pendentes")}
              </TableCell>
              <TableCell align="right">
                {t("reports.totalAmount", "Valor Total")}
              </TableCell>
              <TableCell align="right">
                {t("reports.maxDaysLate", "Dias em Atraso")}
              </TableCell>
              <TableCell>{t("reports.actions", "Ações")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {delinquencyData.length > 0 ? (
              delinquencyData.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            student.maxDaysLate > 30
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {student.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{student.email}</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{student.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      {student.transactions.map((transaction, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={
                              transaction.status === "pending"
                                ? t("reports.pending", "Pendente")
                                : t("reports.overdue", "Atrasado")
                            }
                            size="small"
                            color={
                              transaction.status === "pending"
                                ? "warning"
                                : "error"
                            }
                          />
                          <Tooltip title={transaction.description}>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 150 }}
                            >
                              {dayjs(transaction.dueDate).format("DD/MM/YYYY")}{" "}
                              - {formatCurrency(transaction.amount)}
                            </Typography>
                          </Tooltip>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={
                        student.maxDaysLate > 30
                          ? theme.palette.error.main
                          : theme.palette.warning.main
                      }
                    >
                      {formatCurrency(student.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {student.maxDaysLate > 0 && (
                        <WarningIcon
                          fontSize="small"
                          color={student.maxDaysLate > 30 ? "error" : "warning"}
                        />
                      )}
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          student.maxDaysLate > 30
                            ? theme.palette.error.main
                            : student.maxDaysLate > 0
                            ? theme.palette.warning.main
                            : theme.palette.text.primary
                        }
                      >
                        {student.maxDaysLate > 0 ? student.maxDaysLate : "0"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip
                        title={t("reports.sendWhatsApp", "Enviar WhatsApp")}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          sx={{ minWidth: "auto", p: 0.8 }}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title={t("reports.sendEmail", "Enviar Email")}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ minWidth: "auto", p: 0.8 }}
                        >
                          <EmailIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    {t(
                      "reports.noDelinquentStudents",
                      "Não há alunos inadimplentes para exibir."
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DetailedDelinquencyReport;
