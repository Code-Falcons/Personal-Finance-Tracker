// src/Dashboard.jsx
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const mockSummary = {
  income: 4250,
  expenses: 2870,
  balance: 1380,
};

const mockTransactions = [
  { id: 1, date: '2023-05-15', category: 'Salary', type: 'Income', amount: 3500, notes: 'Monthly salary' },
  { id: 2, date: '2023-05-16', category: 'Rent', type: 'Expense', amount: 1200, notes: 'Apartment rent' },
  { id: 3, date: '2023-05-17', category: 'Groceries', type: 'Expense', amount: 240, notes: 'Weekly shopping' },
  { id: 4, date: '2023-05-18', category: 'Freelance', type: 'Income', amount: 750, notes: 'Website project' },
  { id: 5, date: '2023-05-19', category: 'Utilities', type: 'Expense', amount: 180, notes: 'Electricity & water' },
  { id: 6, date: '2023-05-20', category: 'Dining', type: 'Expense', amount: 95, notes: 'Dinner with friends' },
];

const mockCategoryData = [
  { name: 'Rent', value: 1200 },
  { name: 'Groceries', value: 240 },
  { name: 'Utilities', value: 180 },
  { name: 'Transport', value: 150 },
  { name: 'Entertainment', value: 120 },
  { name: 'Other', value: 980 },
];

const budgetAlerts = [
  { id: 1, category: 'Entertainment', spent: 120, budget: 100, exceeded: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Income vs Expenses data
  const incomeExpenseData = [
    { month: 'Jan', income: 4000, expenses: 2500 },
    { month: 'Feb', income: 4200, expenses: 2700 },
    { month: 'Mar', income: 3800, expenses: 2900 },
    { month: 'Apr', income: 4500, expenses: 2600 },
    { month: 'May', income: 4250, expenses: 2870 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#e2e2e2' }}>
      <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  ${mockSummary.income.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#ffebee' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                  ${mockSummary.expenses.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Balance
                </Typography>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    color: mockSummary.balance >= 0 ? '#2e7d32' : '#d32f2f',
                    fontWeight: 600 
                  }}
                >
                  ${mockSummary.balance.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4, 
              bgcolor: '#fff8e1', 
              borderLeft: '4px solid #500b28',
              '& .MuiAlert-icon': { color: '#500b28' }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#500b28' }}>
              Budget Alert: Entertainment spending exceeded by ${budgetAlerts[0].exceeded}
            </Typography>
          </Alert>
        )}

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#500b28', fontWeight: 500 }}>
                Income vs Expenses
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="income" fill="#2e7d32" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#d32f2f" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, height: isMobile ? 300 : 400 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#500b28', fontWeight: 500 }}>
                Spending by Category
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#500b28', fontWeight: 500 }}>
            Recent Transactions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: transaction.type === 'Income' ? '#e8f5e9' : '#ffebee',
                          color: transaction.type === 'Income' ? '#2e7d32' : '#d32f2f'
                        }} 
                      />
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        fontWeight: 600,
                        color: transaction.type === 'Income' ? '#2e7d32' : '#d32f2f'
                      }}
                    >
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;