// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Savings as SavingsIcon,
  AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data aligned with backend models
const mockSummary = {
  income: 4250,
  expenses: 2870,
  balance: 1380,
  totalSavings: 5200,
};

const mockTransactions = [
  { id: 1, date: '2023-05-15', category: { name: 'Salary' }, type: 'income', amount: 3500, notes: 'Monthly salary' },
  { id: 2, date: '2023-05-16', category: { name: 'Rent' }, type: 'expense', amount: 1200, notes: 'Apartment rent' },
  { id: 3, date: '2023-05-17', category: { name: 'Groceries' }, type: 'expense', amount: 240, notes: 'Weekly shopping' },
  { id: 4, date: '2023-05-18', category: { name: 'Freelance' }, type: 'income', amount: 750, notes: 'Website project' },
  { id: 5, date: '2023-05-19', category: { name: 'Utilities' }, type: 'expense', amount: 180, notes: 'Electricity & water' },
  { id: 6, date: '2023-05-20', saving: { title: 'Emergency Fund' }, type: 'saving', amount: 200, notes: 'Monthly contribution' },
];

const mockCategoryData = [
  { name: 'Rent', value: 1200 },
  { name: 'Groceries', value: 240 },
  { name: 'Utilities', value: 180 },
  { name: 'Transport', value: 150 },
  { name: 'Entertainment', value: 120 },
  { name: 'Other', value: 980 },
];

const mockBudgets = [
  { id: 1, category: { name: 'Food' }, amountLimit: 500, currentAmount: 420, status: 'in-progress' },
  { id: 2, category: { name: 'Entertainment' }, amountLimit: 100, currentAmount: 120, status: 'over' },
];

const mockSavings = [
  { id: 1, title: 'Emergency Fund', targetAmount: 5000, currentAmount: 3200, status: 'active' },
  { id: 2, title: 'Vacation', targetAmount: 2000, currentAmount: 1200, status: 'active' },
];

const budgetAlerts = mockBudgets.filter(b => b.status === 'over');

const COLORS = ['#2e7d32', '#d32f2f', '#1976d2', '#ed6c02', '#7b1fa2', '#0288d1'];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [netWorthData, setNetWorthData] = useState([]);

  // Generate net worth trend data
  useEffect(() => {
    const data = [];
    let balance = 1000;
    let savings = 0;
    for (let i = 0; i < 6; i++) {
      const monthIncome = Math.floor(Math.random() * 1000) + 3500;
      const monthExpenses = Math.floor(Math.random() * 800) + 2000;
      balance += monthIncome - monthExpenses;
      savings += Math.floor(Math.random() * 300) + 200;
      data.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        netWorth: balance + savings,
        balance,
        savings,
      });
    }
    setNetWorthData(data);
  }, []);

  // // Income vs Expenses data
  // const incomeExpenseData = [
  //   { month: 'Jan', income: 4000, expenses: 2500 },
  //   { month: 'Feb', income: 4200, expenses: 2700 },
  //   { month: 'Mar', income: 3800, expenses: 2900 },
  //   { month: 'Apr', income: 4500, expenses: 2600 },
  //   { month: 'May', income: 4250, expenses: 2870 },
  // ];

  // Get transaction type display
  const getTransactionTypeDisplay = (type) => {
    switch (type) {
      case 'income': return 'Income';
      case 'expense': return 'Expense';
      case 'saving': return 'Saving';
      default: return type;
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'income': return '#2e7d32';
      case 'expense': return '#d32f2f';
      case 'saving': return '#1976d2';
      default: return 'inherit';
    }
  };

  // Get budget status color
  const getBudgetStatusColor = (status) => status === 'over' ? '#d32f2f' : '#2e7d32';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{ color: '#500b28', fontWeight: 700, mb: 1 }}
        >
          Financial Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Track your income, expenses, budgets, and savings in one place
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: '#e8f5e9',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 28, mr: 1.5 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Income
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ color: '#2e7d32', fontWeight: 700, mb: 0.5 }}>
                ${mockSummary.income.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: '#ffebee',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <TrendingDownIcon sx={{ color: '#d32f2f', fontSize: 28, mr: 1.5 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Expenses
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ color: '#d32f2f', fontWeight: 700, mb: 0.5 }}>
                ${mockSummary.expenses.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: '#e3f2fd',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <WalletIcon sx={{ color: '#1976d2', fontSize: 28, mr: 1.5 }} />
                <Typography color="text.secondary" variant="body2">
                  Available Balance
                </Typography>
              </Box>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  color: mockSummary.balance >= 0 ? '#2e7d32' : '#d32f2f',
                  fontWeight: 700,
                  mb: 0.5
                }}
              >
                ${mockSummary.balance.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Current balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            bgcolor: '#f3e5f5',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <SavingsIcon sx={{ color: '#7b1fa2', fontSize: 28, mr: 1.5 }} />
                <Typography color="text.secondary" variant="body2">
                  Total Savings
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ color: '#7b1fa2', fontWeight: 700, mb: 0.5 }}>
                ${mockSummary.totalSavings.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                All goals combined
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Budgets & Savings Overview */}
        {/* Budgets */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600 }}>
                  Budgets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockBudgets.length} active
                </Typography>
              </Box>

              {mockBudgets.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No budgets created yet
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {mockBudgets.map((budget) => {
                    const percentage = (budget.currentAmount / budget.amountLimit) * 100;
                    const progressColor = getBudgetStatusColor(budget.status);
                    return (
                      <Grid item xs={12} key={budget.id}>
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {budget.category.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: progressColor, fontWeight: 600 }}>
                              {Math.min(Math.round(percentage), 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(percentage, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(46, 125, 50, 0.1)',
                              '& .MuiLinearProgress-bar': { bgcolor: progressColor }
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              ${budget.currentAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              of ${budget.amountLimit.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Savings */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600 }}>
                  Savings Goals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mockSavings.length} active
                </Typography>
              </Box>

              {mockSavings.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No savings goals created yet
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {mockSavings.map((saving) => {
                    const percentage = (saving.currentAmount / saving.targetAmount) * 100;
                    return (
                      <Grid item xs={12} key={saving.id}>
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {saving.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                              {Math.min(Math.round(percentage), 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(percentage, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' }
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              ${saving.currentAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              of ${saving.targetAmount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 4,
            bgcolor: '#fff8e1',
            borderLeft: '4px solid #ed6c02',
            '& .MuiAlert-icon': { color: '#ed6c02' },
            borderRadius: '12px'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#ed6c02' }}>
            Budget Alert: {budgetAlerts.map((alert, i) => (
              <span key={alert.id}>
                {alert.category.name} exceeded by ${alert.currentAmount - alert.amountLimit}
                {i < budgetAlerts.length - 1 && ', '}
              </span>
            ))}
          </Typography>
        </Alert>
      )}

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Net Worth Trend */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%', width: '47vw' }}>
            <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
              Net Worth Trend
            </Typography>
            <Box sx={{ height: isMobile ? 280 : 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <RechartsTooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    name="Net Worth"
                    stroke="#500b28"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#500b28' }}
                    activeDot={{ r: 8, fill: '#500b28' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Balance"
                    stroke="#2e7d32"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#1976d2"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Spending by Category */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%', width: '45vw' }}>
            <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
              Spending by Category
            </Typography>
            <Box sx={{ height: isMobile ? 280 : 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 70 : 90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
          Recent Transactions
        </Typography>
        <Grid container spacing={2}>
          {mockTransactions.map((transaction) => (
            <Grid item xs={12} key={transaction.id}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(0,0,0,0.02)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {transaction.category?.name || transaction.saving?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={getTransactionTypeDisplay(transaction.type)}
                    size="small"
                    sx={{
                      bgcolor: `${getTransactionTypeColor(transaction.type)}15`,
                      color: getTransactionTypeColor(transaction.type),
                      fontWeight: 500
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: getTransactionTypeColor(transaction.type)
                    }}
                  >
                    {transaction.type === 'expense' ? '-' : ''}${transaction.amount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;