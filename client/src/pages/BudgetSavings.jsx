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
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data
const initialBudgets = [
  { id: 1, category: 'Food', budget: 500, spent: 420 },
  { id: 2, category: 'Rent', budget: 1200, spent: 1200 },
  { id: 3, category: 'Transportation', budget: 200, spent: 250 },
  { id: 4, category: 'Entertainment', budget: 150, spent: 80 },
  { id: 5, category: 'Shopping', budget: 300, spent: 450 },
];

const initialSavings = [
  { id: 1, name: 'Emergency Fund', goal: 5000, saved: 3200 },
  { id: 2, name: 'Vacation', goal: 2000, saved: 1200 },
  { id: 3, name: 'New Laptop', goal: 1500, saved: 800 },
];

const categories = ['Food', 'Rent', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'];

const BudgetSavings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [budgets, setBudgets] = useState(initialBudgets);
  const [savings, setSavings] = useState(initialSavings);
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openSavingsDialog, setOpenSavingsDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingSavings, setEditingSavings] = useState(null);
  
  // Form states
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    budget: '',
  });
  
  const [savingsForm, setSavingsForm] = useState({
    name: '',
    goal: '',
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Calculate over-budget categories
  const overBudgetCategories = useMemo(() => {
    return budgets.filter(budget => budget.spent > budget.budget);
  }, [budgets]);

  // Calculate near-goal savings (>=80%)
  const nearGoalSavings = useMemo(() => {
    return savings.filter(saving => (saving.saved / saving.goal) >= 0.8);
  }, [savings]);

  // Budget form validation
  const validateBudgetForm = () => {
    const errors = {};
    if (!budgetForm.category) errors.category = 'Category is required';
    if (!budgetForm.budget || budgetForm.budget <= 0) errors.budget = 'Valid budget amount is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Savings form validation
  const validateSavingsForm = () => {
    const errors = {};
    if (!savingsForm.name) errors.name = 'Goal name is required';
    if (!savingsForm.goal || savingsForm.goal <= 0) errors.goal = 'Valid goal amount is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle budget form submit
  const handleBudgetSubmit = () => {
    if (!validateBudgetForm()) return;
    
    const newBudget = {
      id: editingBudget?.id || Date.now(),
      category: budgetForm.category,
      budget: parseFloat(budgetForm.budget),
      spent: editingBudget?.spent || 0,
    };
    
    if (editingBudget) {
      setBudgets(prev => prev.map(b => b.id === editingBudget.id ? newBudget : b));
    } else {
      setBudgets(prev => [...prev, newBudget]);
    }
    
    handleCloseBudgetDialog();
  };

  // Handle savings form submit
  const handleSavingsSubmit = () => {
    if (!validateSavingsForm()) return;
    
    const newSavings = {
      id: editingSavings?.id || Date.now(),
      name: savingsForm.name,
      goal: parseFloat(savingsForm.goal),
      saved: editingSavings?.saved || 0,
    };
    
    if (editingSavings) {
      setSavings(prev => prev.map(s => s.id === editingSavings.id ? newSavings : s));
    } else {
      setSavings(prev => [...prev, newSavings]);
    }
    
    handleCloseSavingsDialog();
  };

  // Delete budget
  const handleDeleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Delete savings goal
  const handleDeleteSavings = (id) => {
    setSavings(prev => prev.filter(s => s.id !== id));
  };

  // Open budget dialog for new
  const handleOpenBudgetDialog = () => {
    setBudgetForm({ category: '', budget: '' });
    setEditingBudget(null);
    setFormErrors({});
    setOpenBudgetDialog(true);
  };

  // Open budget dialog for edit
  const handleEditBudget = (budget) => {
    setBudgetForm({ category: budget.category, budget: budget.budget.toString() });
    setEditingBudget(budget);
    setFormErrors({});
    setOpenBudgetDialog(true);
  };

  // Open savings dialog for new
  const handleOpenSavingsDialog = () => {
    setSavingsForm({ name: '', goal: '' });
    setEditingSavings(null);
    setFormErrors({});
    setOpenSavingsDialog(true);
  };

  // Open savings dialog for edit
  const handleEditSavings = (saving) => {
    setSavingsForm({ name: saving.name, goal: saving.goal.toString() });
    setEditingSavings(saving);
    setFormErrors({});
    setOpenSavingsDialog(true);
  };

  // Close dialogs
  const handleCloseBudgetDialog = () => {
    setOpenBudgetDialog(false);
    setEditingBudget(null);
  };

  const handleCloseSavingsDialog = () => {
    setOpenSavingsDialog(false);
    setEditingSavings(null);
  };

  // Chart data preparation
  const budgetChartData = budgets.map(budget => ({
    category: budget.category,
    budgeted: budget.budget,
    actual: budget.spent,
  }));

  const savingsTrendData = [
    { month: 'Jan', savings: 1200 },
    { month: 'Feb', savings: 1800 },
    { month: 'Mar', savings: 2400 },
    { month: 'Apr', savings: 3200 },
    { month: 'May', savings: 4200 },
    { month: 'Jun', savings: 5200 },
  ];

  const COLORS = ['#2e7d32', '#500b28', '#1976d2', '#ed6c02', '#7b1fa2', '#0288d1', '#388e3c', '#d32f2f'];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#e2e2e2', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5, pt: { xs: 2, sm: 4 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          sx={{ 
            color: '#500b28', 
            fontWeight: 700,
            mb: 2
          }}
        >
          Budgets & Savings
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Track your spending limits and savings goals.
        </Typography>
      </Box>

      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ 
            mb: 3, 
            bgcolor: '#fff8e1', 
            borderLeft: '4px solid #500b28',
            '& .MuiAlert-icon': { color: '#500b28' }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#500b28' }}>
            Budget Alert: {overBudgetCategories.length} category{overBudgetCategories.length > 1 ? 's are' : ' is'} over budget!
          </Typography>
        </Alert>
      )}

      {nearGoalSavings.length > 0 && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ 
            mb: 4, 
            bgcolor: '#e8f5e9',
            borderLeft: '4px solid #2e7d32',
            '& .MuiAlert-icon': { color: '#2e7d32' }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#2e7d32' }}>
            Great progress! {nearGoalSavings.length} savings goal{nearGoalSavings.length > 1 ? 's are' : ' is'} nearly complete!
          </Typography>
        </Alert>
      )}

      {/* Budget Overview */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#500b28', fontWeight: 600 }}>
              Budget Overview
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenBudgetDialog}
              sx={{ 
                bgcolor: '#500b28',
                '&:hover': { bgcolor: '#3c081e' },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Add Budget
            </Button>
          </Box>
          
          {budgets.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No budgets created yet. Click "Add Budget" to get started.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.budget) * 100;
                const isOverBudget = budget.spent > budget.budget;
                const progressColor = isOverBudget ? '#d32f2f' : '#2e7d32';
                
                return (
                  <Grid item xs={12} key={budget.id}>
                    <Card 
                      sx={{ 
                        borderRadius: '12px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: isOverBudget ? '2px solid #d32f2f' : 'none',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {budget.category}
                          </Typography>
                          <Box>
                            <IconButton size="small" onClick={() => handleEditBudget(budget)}>
                              <EditIcon sx={{ color: '#500b28' }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteBudget(budget.id)}>
                              <DeleteIcon sx={{ color: '#d32f2f' }} />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          ${budget.spent.toLocaleString()} / ${budget.budget.toLocaleString()}
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
                              '& .MuiLinearProgress-bar': {
                                bgcolor: progressColor
                              }
                            }} 
                          />
                          <Typography variant="body2" sx={{ minWidth: 50, fontWeight: 600, color: progressColor }}>
                            {Math.min(Math.round(percentage), 100)}%
                          </Typography>
                        </Box>
                        
                        {isOverBudget && (
                          <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                            Over budget by ${(budget.spent - budget.budget).toLocaleString()}
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

      {/* Savings Goals */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#500b28', fontWeight: 600 }}>
              Savings Goals
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenSavingsDialog}
              sx={{ 
                bgcolor: '#500b28',
                '&:hover': { bgcolor: '#3c081e' },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Add Goal
            </Button>
          </Box>
          
          {savings.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No savings goals created yet. Click "Add Goal" to get started.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {savings.map((saving) => {
                const percentage = (saving.saved / saving.goal) * 100;
                const isNearGoal = percentage >= 80;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={saving.id}>
                    <Card 
                      sx={{ 
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        height: '100%',
                        border: isNearGoal ? '2px solid #2e7d32' : 'none',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <CircularProgress
                            variant="determinate"
                            value={Math.min(percentage, 100)}
                            size={80}
                            thickness={4}
                            sx={{ 
                              color: isNearGoal ? '#2e7d32' : '#500b28',
                              mb: 2
                            }}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                              {Math.min(Math.round(percentage), 100)}%
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
                          {saving.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                          ${saving.saved.toLocaleString()} / ${saving.goal.toLocaleString()}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
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

      {/* Analytics & Charts */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
                Budget vs Actual Spending
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#2e7d32" name="Budgeted" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#500b28" name="Actual" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
                Savings Growth Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#2e7d32" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#2e7d32' }}
                      activeDot={{ r: 8, fill: '#2e7d32' }}
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
        <DialogTitle sx={{ color: '#500b28', fontWeight: 600 }}>
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
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Amount *"
                type="number"
                value={budgetForm.budget}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, budget: e.target.value }))}
                error={!!formErrors.budget}
                helperText={formErrors.budget}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseBudgetDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleBudgetSubmit} 
            variant="contained" 
            sx={{ 
              bgcolor: '#500b28',
              '&:hover': { bgcolor: '#3c081e' }
            }}
          >
            {editingBudget ? 'Update' : 'Add'} Budget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Savings Dialog */}
      <Dialog open={openSavingsDialog} onClose={handleCloseSavingsDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#500b28', fontWeight: 600 }}>
          {editingSavings ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Goal Name *"
                value={savingsForm.name}
                onChange={(e) => setSavingsForm(prev => ({ ...prev, name: e.target.value }))}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Amount *"
                type="number"
                value={savingsForm.goal}
                onChange={(e) => setSavingsForm(prev => ({ ...prev, goal: e.target.value }))}
                error={!!formErrors.goal}
                helperText={formErrors.goal}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseSavingsDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSavingsSubmit} 
            variant="contained" 
            sx={{ 
              bgcolor: '#500b28',
              '&:hover': { bgcolor: '#3c081e' }
            }}
          >
            {editingSavings ? 'Update' : 'Add'} Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// // Custom CircularProgress component for savings goals
const CircularProgress = ({ value, size, thickness, sx, children }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `${thickness}px solid rgba(0, 0, 0, 0.1)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `${thickness}px solid`,
            borderColor: sx?.color || 'primary.main',
            clipPath: `inset(0 ${value < 50 ? '50%' : '0'} 0 0)`,
            transform: value < 50 ? 'rotate(0deg)' : 'rotate(180deg)',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
        {value >= 50 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `${thickness}px solid`,
              borderColor: sx?.color || 'primary.main',
              clipPath: 'inset(0 0 0 50%)',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default BudgetSavings;