import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend
} from 'recharts';
import TransactionDialog from '../components/TransactionDialog';
import BudgetDialog from '../components/BudgetDialog';
import SavingGoalDialog from '../components/SavingGoalDialog';

// Styled Components
const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  height: '100%',
  background: '#FFFFFF',
  '& .card-title': {
    color: '#500B28',
    marginBottom: theme.spacing(2),
    fontWeight: 600
  }
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E21C34',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#C1172D',
  },
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600
}));

const COLORS = ['#E21C34', '#500B28', '#27AE60', '#F39C12', '#8884d8'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState({ type: null, open: false });
  const [timeRange, setTimeRange] = useState('month');
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    currentBalance: 0,
    totalSavings: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    categories: [],
    recentTransactions: [],
    activeBudgets: [],
    savingsGoals: [],
    spendingByCategory: [],
    incomeVsExpensesTrend: []
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        if (!user) {
          const userData = await api.me();
          setMe(userData.user);
        }
        
        // Fetch all dashboard data in parallel
        const [
          summary, 
          transactions, 
          budgets, 
          savings,
          categoryData,
          spendingData
        ] = await Promise.all([
          api.get('/api/transactions/summary'),
          api.get('/api/transactions?limit=5'),
          api.get('/api/budgets/in-progress'),
          api.get('/api/savings/active'),
          api.get(`/api/category/${user?.id}`),
          api.get('/api/transactions/category-spending')
        ]);

        setCategories(categoryData || []);
        setDashboardData({
          currentBalance: summary.currentBalance || 0,
          totalSavings: summary.totalSavings || 0,
          monthlyIncome: summary.monthlyIncome || 0,
          monthlyExpenses: summary.monthlyExpenses || 0,
          categories: summary.categories || [],
          recentTransactions: transactions.data || [],
          activeBudgets: budgets.data || [],
          savingsGoals: savings.data || [],
          spendingByCategory: spendingData || [],
          incomeVsExpensesTrend: summary.trends || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!user) logout();
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, logout, timeRange]);

  const handleAddTransaction = async (data) => {
    try {
      await api.post('/api/transactions', data);
      // Refresh dashboard data
      window.location.reload();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAddBudget = async (data) => {
    try {
      await api.post('/api/budgets', data);
      window.location.reload();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleAddSavingGoal = async (data) => {
    try {
      await api.post('/api/savings', data);
      window.location.reload();
    } catch (error) {
      console.error('Error creating saving goal:', error);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress sx={{ color: '#E21C34' }} />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ color: '#500B28', fontWeight: 600 }}>
              Welcome back, {me?.name || 'User'}
            </Typography>
            <Box>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  size="small"
                >
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
              <QuickActionButton onClick={logout}>Logout</QuickActionButton>
            </Box>
          </Box>
        </Grid>

        {/* Overview Cards */}
        <Grid item xs={12} md={3}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Current Balance</Typography>
            <Typography variant="h4" sx={{ color: '#E21C34', fontWeight: 700 }}>
              {me?.currency} {dashboardData.currentBalance.toLocaleString()}
            </Typography>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Total Savings</Typography>
            <Typography variant="h4" sx={{ color: '#27AE60', fontWeight: 700 }}>
              {me?.currency} {dashboardData.totalSavings.toLocaleString()}
            </Typography>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Monthly Income</Typography>
            <Typography variant="h4" sx={{ color: '#27AE60', fontWeight: 700 }}>
              {me?.currency} {dashboardData.monthlyIncome.toLocaleString()}
            </Typography>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Monthly Expenses</Typography>
            <Typography variant="h4" sx={{ color: '#F39C12', fontWeight: 700 }}>
              {me?.currency} {dashboardData.monthlyExpenses.toLocaleString()}
            </Typography>
          </DashboardCard>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <DashboardCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Income vs Expenses" />
                <Tab label="Spending by Category" />
              </Tabs>
            </Box>
            <Box sx={{ height: 300 }}>
              {activeTab === 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.incomeVsExpensesTrend}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#27AE60" name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#E21C34" name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.spendingByCategory}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {dashboardData.spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Quick Actions</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <QuickActionButton 
                fullWidth
                onClick={() => setOpenDialog({ type: 'transaction', open: true })}
              >
                Add Transaction
              </QuickActionButton>
              <QuickActionButton 
                fullWidth
                onClick={() => setOpenDialog({ type: 'budget', open: true })}
              >
                Create Budget
              </QuickActionButton>
              <QuickActionButton 
                fullWidth
                onClick={() => setOpenDialog({ type: 'saving', open: true })}
              >
                Set Saving Goal
              </QuickActionButton>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Recent Transactions</Typography>
            <Box sx={{ mt: 2 }}>
              {dashboardData.recentTransactions.map((transaction, index) => (
                <Box
                  key={transaction._id || index}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#500B28', fontWeight: 600 }}>
                      {transaction.category?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: transaction.type === 'income' ? '#27AE60' : '#E21C34',
                      fontWeight: 600
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {me?.currency} {transaction.amount.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        {/* Active Budgets & Savings Goals */}
        <Grid item xs={12} md={4}>
          <DashboardCard>
            <Typography className="card-title" variant="h6">Active Budgets & Goals</Typography>
            <Box sx={{ mt: 2 }}>
              {dashboardData.activeBudgets.map((budget, index) => (
                <Box
                  key={budget._id || index}
                  sx={{ mb: 2 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">{budget.category?.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {budget.spent}/{budget.amount} {me?.currency}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(budget.spent / budget.amount) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: (budget.spent / budget.amount) > 0.9 ? '#E21C34' : '#27AE60'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <TransactionDialog
        open={openDialog.type === 'transaction'}
        onClose={() => setOpenDialog({ type: null, open: false })}
        onSubmit={handleAddTransaction}
      />
      <BudgetDialog
        open={openDialog.type === 'budget'}
        onClose={() => setOpenDialog({ type: null, open: false })}
        onSubmit={handleAddBudget}
        categories={categories}
      />
      <SavingGoalDialog
        open={openDialog.type === 'saving'}
        onClose={() => setOpenDialog({ type: null, open: false })}
        onSubmit={handleAddSavingGoal}
      />
    </Container>
  );
}