import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

function Dashboard() {
  const { t } = useTranslation();

  // Dados fictícios para o dashboard
  const summaryData = {
    totalStudents: 127,
    activeStudents: 98,
    newStudentsMonth: 12,
    monthlyRevenue: "R$ 25.480,00",
    pendingPayments: "R$ 3.750,00",
    totalExpenses: "R$ 18.920,00",
    netProfit: "R$ 6.560,00",
    profitMargin: "25.7%",
  };

  // Dados fictícios para gráficos
  const monthlyRevenueData = {
    xAxis: [
      {
        id: "months",
        data: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        scaleType: "band",
      },
    ],
    series: [
      {
        data: [18400, 19200, 21500, 22700, 24100, 25480],
        label: t("dashboard.revenue"),
      },
      {
        data: [15200, 16100, 17300, 17900, 18400, 18920],
        label: t("dashboard.expenses"),
      },
    ],
  };

  // Dados para o gráfico de pizza
  const membershipTypeData = [
    { id: 0, value: 50, label: t("dashboard.monthlyPlan") },
    { id: 1, value: 25, label: t("dashboard.quarterlyPlan") },
    { id: 2, value: 15, label: t("dashboard.semiannualPlan") },
    { id: 3, value: 8, label: t("dashboard.annualPlan") },
  ];

  // Lista de alunos com pagamentos pendentes
  const pendingPaymentsStudents = [
    { id: 1, name: "João Silva", amount: "R$ 120,00", daysLate: 5 },
    { id: 2, name: "Maria Oliveira", amount: "R$ 240,00", daysLate: 8 },
    { id: 3, name: "Carlos Mendes", amount: "R$ 180,00", daysLate: 3 },
    { id: 4, name: "Ana Carolina", amount: "R$ 350,00", daysLate: 12 },
  ];

  // Lista de novos alunos
  const newStudents = [
    {
      id: 1,
      name: "Pedro Santos",
      joinDate: "15/06/2023",
      plan: t("dashboard.monthlyPlan"),
    },
    {
      id: 2,
      name: "Lúcia Ferreira",
      joinDate: "18/06/2023",
      plan: t("dashboard.annualPlan"),
    },
    {
      id: 3,
      name: "Roberto Alves",
      joinDate: "20/06/2023",
      plan: t("dashboard.quarterlyPlan"),
    },
  ];

  // Lista de aniversariantes do mês
  const birthdaysThisMonth = [
    { id: 1, name: "Marcelo Costa", date: "28/06" },
    { id: 2, name: "Fernanda Lima", date: "30/06" },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("dashboard.title")}
      </Typography>

      {/* Cards com resumo de dados */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t("dashboard.totalStudents")}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="primary">
                {summaryData.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.activeStudents")}: {summaryData.activeStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t("dashboard.newStudents")}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="success.main">
                {summaryData.newStudentsMonth}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.thisMonth")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MoneyIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  {t("dashboard.monthlyRevenue")}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="info.main">
                {summaryData.monthlyRevenue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.profitMargin")}: {summaryData.profitMargin}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Badge
                  badgeContent={pendingPaymentsStudents.length}
                  color="error"
                  sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem" } }}
                >
                  <NotificationsIcon color="warning" sx={{ mr: 1 }} />
                </Badge>
                <Typography variant="h6" component="div">
                  {t("dashboard.pendingPayments")}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="warning.main">
                {summaryData.pendingPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pendingPaymentsStudents.length} {t("dashboard.students")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos e listas */}
      <Grid container spacing={3}>
        {/* Gráfico de receita e despesas mensais */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.monthlyFinancials")}
            </Typography>
            <Box sx={{ height: 300, width: "100%" }}>
              <LineChart
                xAxis={monthlyRevenueData.xAxis}
                series={monthlyRevenueData.series}
                height={280}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de distribuição de planos */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.membershipDistribution")}
            </Typography>
            <Box sx={{ height: 280, width: "100%" }}>
              <PieChart
                series={[{ data: membershipTypeData }]}
                height={280}
                slotProps={{
                  legend: { hidden: false },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Lista de pagamentos pendentes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("dashboard.pendingPaymentsList")}
            </Typography>
            <List>
              {pendingPaymentsStudents.map((student) => (
                <React.Fragment key={student.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <MoneyIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={`${student.amount} • ${t(
                        "dashboard.daysLate",
                        { count: student.daysLate }
                      )}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Lista de novos alunos e aniversariantes */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Novos alunos */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("dashboard.newStudentsList")}
                </Typography>
                <List>
                  {newStudents.map((student) => (
                    <React.Fragment key={student.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "success.main" }}>
                            <PeopleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={student.name}
                          secondary={`${student.joinDate} • ${student.plan}`}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Aniversariantes do mês */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t("dashboard.birthdaysThisMonth")}
                </Typography>
                <List>
                  {birthdaysThisMonth.map((student) => (
                    <React.Fragment key={student.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "info.main" }}>
                            <CalendarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={student.name}
                          secondary={student.date}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
