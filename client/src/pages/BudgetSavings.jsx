// src/pages/BudgetSavings.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  LinearProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO, isBefore } from 'date-fns';
import { CircularProgress } from '@mui/material';

// Mock categories
const categories = [
  'Food', 'Rent', 'Transportation', 'Entertainment', 
  'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'
];

// Initial mock data matching backend structure
const initialBudgets = [
  { 
    id: 1, 
    category: { _id: 'cat1', name: 'Food' }, 
    amountLimit: 500, 
    currentAmount: 420,
    startDate: '2023-05-01',
    endDate: '2023-05-31',
    status: 'in-progress'
  },
  { 
    id: 2, 
    category: { _id: 'cat2', name: 'Rent' }, 
    amountLimit: 1200, 
    currentAmount: 1200,
    startDate: '2023-05-01',
    endDate: '2023-05-31',
    status: 'over'
  },
  { 
    id: 3, 
    category: { _id: 'cat3', name: 'Transportation' }, 
    amountLimit: 200, 
    currentAmount: 250,
    startDate: '2023-05-01',
    endDate: '2023-05-31',
    status: 'over'
  },
];

const initialSavings = [
  { 
    id: 1, 
    title: 'Emergency Fund', 
    targetAmount: 5000, 
    currentAmount: 3200,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'active'
  },
  { 
    id: 2, 
    title: 'Vacation', 
    targetAmount: 2000, 
    currentAmount: 1200,
    startDate: '2023-03-01',
    endDate: '2023-08-31',
    status: 'active'
  },
  { 
    id: 3, 
    title: 'New Laptop', 
    targetAmount: 1500, 
    currentAmount: 800,
    startDate: '2023-04-01',
    endDate: '2023-07-31',
    status: 'active'
  },
];

const BudgetSavings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [budgets, setBudgets] = useState(initialBudgets);
  const [savings, setSavings] = useState(initialSavings);
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openSavingsDialog, setOpenSavingsDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingSavings, setEditingSavings] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form states
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    amountLimit: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
  });

  const [savingsForm, setSavingsForm] = useState({
    title: '',
    targetAmount: '',
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // +6 months
    notes: '',
  });

  // Near-goal savings (>=80%)
  const nearGoalSavings = useMemo(() => {
    return savings.filter(s => s.currentAmount / s.targetAmount >= 0.8);
  }, [savings]);

  // Budget validation
  const validateBudgetForm = () => {
    const errors = {};
    if (!budgetForm.category) errors.category = 'Category is required';
    if (!budgetForm.amountLimit || parseFloat(budgetForm.amountLimit) <= 0) 
      errors.amountLimit = 'Valid amount is required';
    if (!budgetForm.startDate) errors.startDate = 'Start date is required';
    if (!budgetForm.endDate) errors.endDate = 'End date is required';
    
    const startDate = new Date(budgetForm.startDate);
    const endDate = new Date(budgetForm.endDate);
    if (isBefore(endDate, startDate)) 
      errors.endDate = 'End date must be after start date';
      
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Savings validation
  const validateSavingsForm = () => {
    const errors = {};
    if (!savingsForm.title) errors.title = 'Goal name is required';
    if (!savingsForm.targetAmount || parseFloat(savingsForm.targetAmount) <= 0) 
      errors.targetAmount = 'Valid amount is required';
    if (!savingsForm.endDate) errors.endDate = 'End date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handlers
  const handleBudgetSubmit = () => {
    if (!validateBudgetForm()) return;
    const newBudget = {
      id: editingBudget?.id || Date.now(),
      category: { _id: budgetForm.category, name: budgetForm.category },
      amountLimit: parseFloat(budgetForm.amountLimit),
      currentAmount: editingBudget?.currentAmount || 0,
      startDate: format(budgetForm.startDate, 'yyyy-MM-dd'),
      endDate: format(budgetForm.endDate, 'yyyy-MM-dd'),
      status: editingBudget?.currentAmount >= parseFloat(budgetForm.amountLimit) ? 'over' : 'in-progress'
    };
    if (editingBudget) {
      setBudgets(prev => prev.map(b => b.id === editingBudget.id ? newBudget : b));
    } else {
      setBudgets(prev => [...prev, newBudget]);
    }
    handleCloseBudgetDialog();
  };

  const handleSavingsSubmit = () => {
    if (!validateSavingsForm()) return;
    const newSaving = {
      id: editingSavings?.id || Date.now(),
      title: savingsForm.title,
      targetAmount: parseFloat(savingsForm.targetAmount),
      currentAmount: editingSavings?.currentAmount || 0,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(savingsForm.endDate, 'yyyy-MM-dd'),
      status: editingSavings?.currentAmount >= parseFloat(savingsForm.targetAmount) ? 'completed' : 'active',
      notes: savingsForm.notes
    };
    if (editingSavings) {
      setSavings(prev => prev.map(s => s.id === editingSavings.id ? newSaving : s));
    } else {
      setSavings(prev => [...prev, newSaving]);
    }
    handleCloseSavingsDialog();
  };

  // Delete handlers
  const handleDeleteBudget = (id) => setBudgets(prev => prev.filter(b => b.id !== id));
  const handleDeleteSavings = (id) => setSavings(prev => prev.filter(s => s.id !== id));

  // Dialog handlers
  const handleOpenBudgetDialog = () => {
    setBudgetForm({
      category: '',
      amountLimit: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    setEditingBudget(null);
    setFormErrors({});
    setOpenBudgetDialog(true);
  };

  const handleEditBudget = (budget) => {
    setBudgetForm({
      category: budget.category.name,
      amountLimit: budget.amountLimit.toString(),
      startDate: parseISO(budget.startDate),
      endDate: parseISO(budget.endDate)
    });
    setEditingBudget(budget);
    setFormErrors({});
    setOpenBudgetDialog(true);
  };

  const handleOpenSavingsDialog = () => {
    setSavingsForm({
      title: '',
      targetAmount: '',
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      notes: ''
    });
    setEditingSavings(null);
    setFormErrors({});
    setOpenSavingsDialog(true);
  };

  const handleEditSavings = (saving) => {
    setSavingsForm({
      title: saving.title,
      targetAmount: saving.targetAmount.toString(),
      endDate: parseISO(saving.endDate),
      notes: saving.notes || ''
    });
    setEditingSavings(saving);
    setFormErrors({});
    setOpenSavingsDialog(true);
  };

  const handleCloseBudgetDialog = () => {
    setOpenBudgetDialog(false);
    setEditingBudget(null);
  };

  const handleCloseSavingsDialog = () => {
    setOpenSavingsDialog(false);
    setEditingSavings(null);
  };

  // Chart data
  const budgetChartData = budgets.map(b => ({
    category: b.category.name,
    budgeted: b.amountLimit,
    actual: b.currentAmount
  }));

  const savingsTrendData = [
    { month: 'Jan', savings: 1200 },
    { month: 'Feb', savings: 1800 },
    { month: 'Mar', savings: 2400 },
    { month: 'Apr', savings: 3200 },
    { month: 'May', savings: 4200 },
    { month: 'Jun', savings: 5200 },
  ];

  // Status helpers
  const getBudgetStatusColor = (status) => status === 'over' ? '#d32f2f' : '#2e7d32';
  const getBudgetStatusText = (status) => status === 'over' ? 'Over Budget' : 'In Progress';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, pt: { xs: 2, sm: 3 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          sx={{ color: '#500b28', fontWeight: 700, mb: 1 }}
        >
          Budgets & Savings
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Track your spending limits and savings goals.
        </Typography>
      </Box>

      {/* Near-goal alert */}
      {nearGoalSavings.length > 0 && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ mb: 4, bgcolor: '#e8f5e9', borderLeft: '4px solid #2e7d32' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
            Great progress! {nearGoalSavings.length} savings goal{nearGoalSavings.length > 1 ? 's are' : ' is'} nearly complete!
          </Typography>
        </Alert>
      )}

      {/* Budgets Section */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600 }}>
              Budget Overview
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenBudgetDialog}
              sx={{ bgcolor: '#500b28', '&:hover': { bgcolor: '#3c081e' }, textTransform: 'none', fontSize: '0.875rem' }}
            >
              Add Budget
            </Button>
          </Box>

          {budgets.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4, fontSize: '0.875rem' }}>
              No budgets created yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {budgets.map((budget) => {
                const percentage = (budget.currentAmount / budget.amountLimit) * 100;
                const isOver = budget.status === 'over';
                const progressColor = isOver ? '#d32f2f' : '#2e7d32';
                return (
                  <Grid item xs={12} key={budget.id}>
                    <Card sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: isOver ? '2px solid #d32f2f' : 'none',
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {budget.category.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={getBudgetStatusText(budget.status)} 
                                size="small" 
                                sx={{ 
                                  bgcolor: `${getBudgetStatusColor(budget.status)}15`,
                                  color: getBudgetStatusColor(budget.status),
                                  fontWeight: 500,
                                  fontSize: '0.75rem'
                                }} 
                              />
                              <Tooltip title={`Start: ${format(parseISO(budget.startDate), 'MMM dd, yyyy')} • End: ${format(parseISO(budget.endDate), 'MMM dd, yyyy')}`}>
                                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              </Tooltip>
                            </Box>
                          </Box>
                          <Box>
                            <IconButton size="small" onClick={() => handleEditBudget(budget)}>
                              <EditIcon sx={{ color: '#500b28', fontSize: '1.25rem' }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteBudget(budget.id)}>
                              <DeleteIcon sx={{ color: '#d32f2f', fontSize: '1.25rem' }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                          ${budget.currentAmount.toLocaleString()} / ${budget.amountLimit.toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(percentage, 100)}
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: 'rgba(46, 125, 50, 0.1)',
                              '& .MuiLinearProgress-bar': { bgcolor: progressColor }
                            }} 
                          />
                          <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 600, color: progressColor, fontSize: '0.875rem' }}>
                            {Math.min(Math.round(percentage), 100)}%
                          </Typography>
                        </Box>
                        {isOver && (
                          <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem' }}>
                            Over by ${(budget.currentAmount - budget.amountLimit).toLocaleString()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Savings Section */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600 }}>
              Savings Goals
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenSavingsDialog}
              sx={{ bgcolor: '#500b28', '&:hover': { bgcolor: '#3c081e' }, textTransform: 'none', fontSize: '0.875rem' }}
            >
              Add Goal
            </Button>
          </Box>

          {savings.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4, fontSize: '0.875rem' }}>
              No savings goals created yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {savings.map((saving) => {
                const percentage = (saving.currentAmount / saving.targetAmount) * 100;
                const isNear = percentage >= 80;
                return (
                  <Grid item xs={12} sm={6} md={4} key={saving.id}>
                    <Card sx={{ 
                      borderRadius: '16px', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      height: '100%',
                      width: '30vw',
                      border: isNear ? '2px solid #2e7d32' : 'none',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', mb: 1.5 }}>
                          <CircularProgress
                            variant="determinate"
                            value={Math.min(percentage, 100)}
                            size={70}
                            thickness={5}
                            sx={{ color: isNear ? '#2e7d32' : '#500b28' }}
                          />
                          <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1.125rem' }}>
                              {Math.min(Math.round(percentage), 100)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, textAlign: 'center', fontSize: '1rem' }}>
                          {saving.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, textAlign: 'center', fontSize: '0.875rem' }}>
                          ${saving.currentAmount.toLocaleString()} / ${saving.targetAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, fontSize: '0.75rem' }}>
                          Ends: {format(parseISO(saving.endDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1 }}>
                          <IconButton size="small" onClick={() => handleEditSavings(saving)}>
                            <EditIcon sx={{ color: '#500b28' }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteSavings(saving.id)}>
                            <DeleteIcon sx={{ color: '#d32f2f' }} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={7} sx={{ width: '45vw' }}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2, fontSize: '1.125rem' }}>
                Budget vs Actual Spending
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                    <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#2e7d32" name="Budgeted" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#500b28" name="Actual" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5} sx={{ width: '45vw' }}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2, fontSize: '1.125rem' }}>
                Savings Growth Trend
              </Typography>
              <Box sx={{ height: isMobile ? 250 : 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                    <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#2e7d32" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#2e7d32' }}
                      activeDot={{ r: 6, fill: '#2e7d32' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget Dialog */}
      <Dialog open={openBudgetDialog} onClose={handleCloseBudgetDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#500b28', fontWeight: 600, pb: 1 }}>
          {editingBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category *"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                error={!!formErrors.category}
                helperText={formErrors.category}
                size="small"
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Amount *"
                type="number"
                value={budgetForm.amountLimit}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, amountLimit: e.target.value }))}
                error={!!formErrors.amountLimit}
                helperText={formErrors.amountLimit}
                InputProps={{ startAdornment: '$' }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date *"
                  value={budgetForm.startDate}
                  onChange={(date) => setBudgetForm(prev => ({ ...prev, startDate: date }))}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.startDate}
                      helperText={formErrors.startDate}
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date *"
                  value={budgetForm.endDate}
                  minDate={budgetForm.startDate}
                  onChange={(date) => setBudgetForm(prev => ({ ...prev, endDate: date }))}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.endDate}
                      helperText={formErrors.endDate}
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseBudgetDialog} variant="outlined" size="small">Cancel</Button>
          <Button onClick={handleBudgetSubmit} variant="contained" size="small" sx={{ bgcolor: '#500b28', '&:hover': { bgcolor: '#3c081e' } }}>
            {editingBudget ? 'Update' : 'Add'} Budget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Savings Dialog */}
      <Dialog open={openSavingsDialog} onClose={handleCloseSavingsDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#500b28', fontWeight: 600, pb: 1 }}>
          {editingSavings ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Goal Name *"
                value={savingsForm.title}
                onChange={(e) => setSavingsForm(prev => ({ ...prev, title: e.target.value }))}
                error={!!formErrors.title}
                helperText={formErrors.title}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Amount *"
                type="number"
                value={savingsForm.targetAmount}
                onChange={(e) => setSavingsForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                error={!!formErrors.targetAmount}
                helperText={formErrors.targetAmount}
                InputProps={{ startAdornment: '$' }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date *"
                  value={savingsForm.endDate}
                  minDate={new Date()}
                  onChange={(date) => setSavingsForm(prev => ({ ...prev, endDate: date }))}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!formErrors.endDate}
                      helperText={formErrors.endDate}
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={savingsForm.notes}
                onChange={(e) => setSavingsForm(prev => ({ ...prev, notes: e.target.value }))}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseSavingsDialog} variant="outlined" size="small">Cancel</Button>
          <Button onClick={handleSavingsSubmit} variant="contained" size="small" sx={{ bgcolor: '#500b28', '&:hover': { bgcolor: '#3c081e' } }}>
            {editingSavings ? 'Update' : 'Add'} Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetSavings;