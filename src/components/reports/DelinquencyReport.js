import React from "react";
import { Box, Typography, Paper, Grid, Card } from "@mui/material";
import { PieChart, BarChart } from "@mui/x-charts";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

function DelinquencyReport({ transactions }) {
  const { t } = useTranslation();

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para obter dados para o relatório de inadimplência
  const getDelinquencyData = () => {
    // Se não houver transações, retornar objeto vazio
    if (!Array.isArray(transactions) || transactions.length === 0) {
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
    const delinquentTransactions = transactions.filter(
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

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("reports.delinquencyTitle", "Relatório de Inadimplência")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t(
                "reports.pendingValuesByStatus",
                "Valores Pendentes por Status"
              )}
            </Typography>
            <Box sx={{ height: 300 }}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: getDelinquencyData().byStatus.data[0],
                        label: t("reports.pending", "Pendente"),
                        color: "#ff9800",
                      },
                      {
                        id: 1,
                        value: getDelinquencyData().byStatus.data[1],
                        label: t("reports.overdue", "Atrasado"),
                        color: "#f44336",
                      },
                    ],
                    valueFormatter: (value) => formatCurrency(value),
                  },
                ]}
                height={250}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("reports.delinquencySummary", "Resumo de Inadimplência")}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <Box sx={{ p: 2, bgcolor: "#f4433620" }}>
                      <Typography variant="subtitle2">
                        {t("reports.totalPending", "Total Pendente")}
                      </Typography>
                      <Typography variant="h5">
                        {formatCurrency(getDelinquencyData().total)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <Box sx={{ p: 2, bgcolor: "#ff980020" }}>
                      <Typography variant="subtitle2">
                        {t(
                          "reports.pendingMembershipsCount",
                          "Quantidade de Mensalidades Pendentes"
                        )}
                      </Typography>
                      <Typography variant="h5">
                        {getDelinquencyData().count}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t(
              "reports.pendingValuesByMonth",
              "Valores Pendentes por Mês de Vencimento"
            )}
          </Typography>
          {getDelinquencyData().byMonth.labels.length > 0 ? (
            <Box sx={{ height: 300 }}>
              <BarChart
                series={[
                  {
                    data: getDelinquencyData().byMonth.data,
                    label: t("reports.totalPending", "Valor Pendente"),
                    color: "#f44336",
                    valueFormatter: (value) => formatCurrency(value),
                  },
                ]}
                xAxis={[
                  {
                    data: getDelinquencyData().byMonth.labels,
                    scaleType: "band",
                  },
                ]}
                height={250}
              />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ fontStyle: "italic", mt: 2 }}>
              {t(
                "reports.noPendingData",
                "Não há dados pendentes para exibir."
              )}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DelinquencyReport;
