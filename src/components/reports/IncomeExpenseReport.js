import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useTranslation } from "react-i18next";

function IncomeExpenseReport({ transactions }) {
  const { t } = useTranslation();

  // Estados para o relatório
  const [reportPeriod, setReportPeriod] = useState("current_month");
  const [reportYear, setReportYear] = useState(dayjs().year());

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
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }

    // Inicializar arrays com zeros para cada mês
    const incomeByMonth = Array(12).fill(0);
    const expenseByMonth = Array(12).fill(0);

    // Filtrar as transações pelo ano selecionado e somar por mês
    transactions.forEach((transaction) => {
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

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("reports.incomeExpenseTitle", "Receitas e Despesas")} ({reportYear})
      </Typography>

      {/* Seleção de período */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{t("reports.period", "Período")}</InputLabel>
          <Select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            label={t("reports.period", "Período")}
          >
            <MenuItem value="current_month">
              {t("reports.currentMonth", "Mês Atual")}
            </MenuItem>
            <MenuItem value="previous_month">
              {t("reports.previousMonth", "Mês Anterior")}
            </MenuItem>
            <MenuItem value="current_year">
              {t("reports.currentYear", "Ano Atual")}
            </MenuItem>
            <MenuItem value="custom">
              {t("reports.custom", "Personalizado")}
            </MenuItem>
          </Select>
        </FormControl>

        {reportPeriod === "custom" && (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              views={["year"]}
              label={t("reports.year", "Ano")}
              value={dayjs().year(reportYear)}
              onChange={(newValue) =>
                setReportYear(newValue ? newValue.year() : dayjs().year())
              }
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 120 },
                },
              }}
            />
          </LocalizationProvider>
        )}
      </Box>

      {/* Gráfico de Receitas e Despesas */}
      <Box sx={{ height: 400, width: "100%" }}>
        <BarChart
          series={[
            {
              data: getIncomeExpenseData().income,
              label: t("reports.income", "Receitas"),
              color: "#4caf50",
              valueFormatter: (value) => formatCurrency(value),
            },
            {
              data: getIncomeExpenseData().expense,
              label: t("reports.expenses", "Despesas"),
              color: "#f44336",
              valueFormatter: (value) => formatCurrency(value),
            },
          ]}
          xAxis={[
            {
              data: [
                t("reports.january", "Jan"),
                t("reports.february", "Fev"),
                t("reports.march", "Mar"),
                t("reports.april", "Abr"),
                t("reports.may", "Mai"),
                t("reports.june", "Jun"),
                t("reports.july", "Jul"),
                t("reports.august", "Ago"),
                t("reports.september", "Set"),
                t("reports.october", "Out"),
                t("reports.november", "Nov"),
                t("reports.december", "Dez"),
              ],
              scaleType: "band",
            },
          ]}
          height={300}
        />
      </Box>

      {/* Tabela de resumo */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t("reports.annualSummary", "Resumo Anual")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 2, bgcolor: "#4caf5020" }}>
                <Typography variant="subtitle2">
                  {t("reports.totalIncome", "Total de Receitas")}
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(
                    getIncomeExpenseData().income.reduce((a, b) => a + b, 0)
                  )}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 2, bgcolor: "#f4433620" }}>
                <Typography variant="subtitle2">
                  {t("reports.totalExpenses", "Total de Despesas")}
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(
                    getIncomeExpenseData().expense.reduce((a, b) => a + b, 0)
                  )}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <Box sx={{ p: 2, bgcolor: "#2196f320" }}>
                <Typography variant="subtitle2">
                  {t("reports.balance", "Saldo")}
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(
                    getIncomeExpenseData().income.reduce((a, b) => a + b, 0) -
                      getIncomeExpenseData().expense.reduce((a, b) => a + b, 0)
                  )}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default IncomeExpenseReport;
