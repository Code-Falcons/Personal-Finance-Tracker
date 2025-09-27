// src/pages/Transactions.jsx
import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme,
  Collapse,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  gridClasses,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Savings as SavingsIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

// Mock data for categories and savings
const mockCategories = [
  { id: '1', name: 'Salary' },
  { id: '2', name: 'Freelance' },
  { id: '3', name: 'Investments' },
  { id: '4', name: 'Rent' },
  { id: '5', name: 'Groceries' },
  { id: '6', name: 'Utilities' },
  { id: '7', name: 'Transportation' },
  { id: '8', name: 'Dining' },
  { id: '9', name: 'Entertainment' },
  { id: '10', name: 'Shopping' },
  { id: '11', name: 'Healthcare' },
  { id: '12', name: 'Other' },
];

const mockSavings = [
  { id: 's1', title: 'Emergency Fund' },
  { id: 's2', title: 'Vacation' },
  { id: 's3', title: 'New Car' },
  { id: 's4', title: 'House Down Payment' },
];

const mockBudgets = [
  { id: 'b1', name: 'Monthly Groceries', category: 'Groceries' },
  { id: 'b2', name: 'Entertainment', category: 'Entertainment' },
  { id: 'b3', name: 'Transportation', category: 'Transportation' },
];

const initialTransactions = [
  {
    id: 1,
    date: '2023-05-15',
    category: { _id: '1', name: 'Salary' },
    type: 'income',
    amount: 3500,
    notes: 'Monthly salary'
  },
  {
    id: 2,
    date: '2023-05-16',
    category: { _id: '4', name: 'Rent' },
    type: 'expense',
    amount: 1200,
    notes: 'Apartment rent',
    budgetId: 'b1'
  },
  {
    id: 3,
    date: '2023-05-17',
    category: { _id: '5', name: 'Groceries' },
    type: 'expense',
    amount: 240,
    notes: 'Weekly shopping'
  },
  {
    id: 4,
    date: '2023-05-18',
    category: { _id: '2', name: 'Freelance' },
    type: 'income',
    amount: 750,
    notes: 'Website project'
  },
  {
    id: 5,
    date: '2023-05-19',
    category: { _id: '6', name: 'Utilities' },
    type: 'expense',
    amount: 180,
    notes: 'Electricity & water'
  },
  {
    id: 6,
    date: '2023-05-20',
    category: { _id: '8', name: 'Dining' },
    type: 'expense',
    amount: 95,
    notes: 'Dinner with friends'
  },
  {
    id: 7,
    date: '2023-05-21',
    saving: { _id: 's1', title: 'Emergency Fund' },
    type: 'saving',
    amount: 200,
    notes: 'Monthly contribution'
  },
  {
    id: 8,
    date: '2023-05-22',
    category: { _id: '7', name: 'Transportation' },
    type: 'expense',
    amount: 65,
    notes: 'Gas refill'
  },
];

const Transactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [transactions, setTransactions] = useState(initialTransactions);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    type: 'All',
    category: 'All',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    type: 'expense',
    category: '',
    saving: '',
    budget: '',
    amount: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Date range filter
      if (filters.dateRange[0] && new Date(transaction.date) < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && new Date(transaction.date) > filters.dateRange[1]) return false;

      // Type filter
      if (filters.type !== 'All' && transaction.type !== filters.type) return false;

      // Category filter
      if (filters.category !== 'All' && transaction.category?._id !== filters.category) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          (transaction.category?.name?.toLowerCase().includes(searchLower) ||
            transaction.saving?.title?.toLowerCase().includes(searchLower) ||
            transaction.notes?.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [transactions, filters]);

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset related fields when type changes
    if (field === 'type') {
      if (value === 'saving') {
        setFormData(prev => ({ ...prev, category: '', budget: '' }));
      } else if (value === 'income') {
        setFormData(prev => ({ ...prev, saving: '', budget: '' }));
      } else if (value === 'expense') {
        setFormData(prev => ({ ...prev, saving: '' }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.type) errors.type = 'Type is required';

    if (formData.type === 'saving') {
      if (!formData.saving) errors.saving = 'Saving is required';
    } else {
      if (!formData.category) errors.category = 'Category is required';
    }

    if (!formData.amount || formData.amount <= 0) errors.amount = 'Valid amount is required';

    // Budget validation for expenses
    if (formData.type === 'expense' && formData.budget) {
      const budget = mockBudgets.find(b => b.id === formData.budget);
      const category = mockCategories.find(c => c.id === formData.category);
      if (budget && category && budget.category !== category.name) {
        errors.budget = `Budget "${budget.name}" is for "${budget.category}" category`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleFormSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newTransaction = {
        id: editingId || Date.now(),
        date: format(formData.date, 'yyyy-MM-dd'),
        type: formData.type,
        amount: parseFloat(formData.amount),
        notes: formData.notes,
      };

      if (formData.type === 'saving') {
        const saving = mockSavings.find(s => s.id === formData.saving);
        newTransaction.saving = { _id: saving.id, title: saving.title };
      } else {
        const category = mockCategories.find(c => c.id === formData.category);
        newTransaction.category = { _id: category.id, name: category.name };

        if (formData.type === 'expense' && formData.budget) {
          newTransaction.budgetId = formData.budget;
        }
      }

      if (editingId) {
        setTransactions(prev =>
          prev.map(t => t.id === editingId ? newTransaction : t)
        );
        setNotification({ type: 'success', message: 'Transaction updated successfully!' });
      } else {
        setTransactions(prev => [...prev, newTransaction]);
        setNotification({ type: 'success', message: 'Transaction added successfully!' });
      }

      handleCloseDialog();
      setLoading(false);
    }, 800);
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setFormData({
      date: parseISO(transaction.date),
      type: transaction.type,
      category: transaction.category?._id || '',
      saving: transaction.saving?._id || '',
      budget: transaction.budgetId || '',
      amount: transaction.amount.toString(),
      notes: transaction.notes || '',
    });
    setEditingId(transaction.id);
    setOpenDialog(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setNotification({ type: 'success', message: 'Transaction deleted successfully!' });
      setLoading(false);
    }, 800);
  };

  // Open dialog for new transaction
  const handleOpenDialog = () => {
    setFormData({
      date: new Date(),
      type: 'expense',
      category: '',
      saving: '',
      budget: '',
      amount: '',
      notes: '',
    });
    setEditingId(null);
    setFormErrors({});
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setNotification(null);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      dateRange: [null, null],
      type: 'All',
      category: 'All',
      search: '',
    });
  };

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

  // Get transaction icon
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income': return <IncomeIcon />;
      case 'expense': return <ExpenseIcon />;
      case 'saving': return <SavingsIcon />;
      default: return <WalletIcon />;
    }
  };

  // DataGrid columns
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => format(parseISO(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getTransactionIcon(params.value)}
          label={getTransactionTypeDisplay(params.value)}
          size="small"
          sx={{
            backgroundColor: `${getTransactionTypeColor(params.value)}15`,
            color: getTransactionTypeColor(params.value),
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: getTransactionTypeColor(params.value)
            }
          }}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      flex: 1,
      renderCell: (params) => params.row.category?.name || params.row.saving?.title || '-',
    },
    {
      field: 'budget',
      headerName: 'Budget',
      width: 150,
      renderCell: (params) => {
        if (params.row.budgetId) {
          const budget = mockBudgets.find(b => b.id === params.row.budgetId);
          return budget ? budget.name : 'Unknown';
        }
        return '-';
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            color: getTransactionTypeColor(params.row.type),
            fontWeight: 600
          }}
        >
          {params.row.type === 'expense' ? '-$' : '$'}
          {params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{ color: '#500b28' }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: '#d32f2f' }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbar
        csvOptions={{ disableToolbarButton: true }}
        printOptions={{ disableToolbarButton: true }}
        quickFilterProps={{ debounceMs: 500 }}
      />
    );
  };

  // Close notification after delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Notification */}
      {notification && (
        <Alert
          severity={notification.type}
          onClose={() => setNotification(null)}
          sx={{ mb: 2 }}
        >
          {notification.message}
        </Alert>
      )}

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#500b28', fontWeight: 600 }}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            bgcolor: '#500b28',
            '&:hover': { bgcolor: '#3c081e' },
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 500 }}>
              Filters
            </Typography>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              size="small"
              sx={{
                bgcolor: showFilters ? '#f5f5f5' : 'transparent',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              {showFilters ? <CloseIcon /> : <FilterListIcon />}
            </IconButton>
          </Box>

          <Collapse in={showFilters}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="saving">Saving</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {mockCategories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Notes, category or saving"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{ height: '100%' }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.dateRange[0]}
                    onChange={(newValue) => handleFilterChange('dateRange', [newValue, filters.dateRange[1]])}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.dateRange[1]}
                    onChange={(newValue) => handleFilterChange('dateRange', [filters.dateRange[0], newValue])}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card sx={{ boxShadow: 2 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          {loading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000
              }}
            />
          )}
          <DataGrid
            rows={filteredTransactions}
            columns={columns}
            components={{
              Toolbar: CustomToolbar,
            }}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                outline: 'none',
              },
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9f9f9',
              }
            }}
          />
        </Box>
      </Card>

      {/* Add/Edit Transaction Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#500b28',
          fontWeight: 600,
          pb: 1,
          borderBottom: '1px solid #e0e0e0'
        }}>
          {editingId ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date *"
                  value={formData.date}
                  onChange={(newValue) => handleFormChange('date', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.date}
                      helperText={formErrors.date}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type *"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                error={!!formErrors.type}
                helperText={formErrors.type}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) => {
                    if (!value) return <em>Select type</em>;
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }
                }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="saving">Saving</MenuItem>
              </TextField>
            </Grid>

            {formData.type === 'saving' ? (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Saving Goal *"
                  value={formData.saving}
                  onChange={(e) => handleFormChange('saving', e.target.value)}
                  error={!!formErrors.saving}
                  helperText={formErrors.saving}
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (value) => {
                      if (!value) return <em>Select saving goal</em>;
                      const selected = mockSavings.find(s => s.id === value);
                      return selected ? selected.title : value;
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select saving goal</em>
                  </MenuItem>
                  {mockSavings.map(saving => (
                    <MenuItem key={saving.id} value={saving.id}>
                      {saving.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Category *"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    error={!!formErrors.category}
                    helperText={formErrors.category}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (value) => {
                        if (!value) return <em>Select category</em>;
                        const selected = mockCategories.find(c => c.id === value);
                        return selected ? selected.name : value;
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select category</em>
                    </MenuItem>
                    {mockCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {formData.type === 'expense' && (
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Budget (Optional)"
                      value={formData.budget}
                      onChange={(e) => handleFormChange('budget', e.target.value)}
                      error={!!formErrors.budget}
                      helperText={formErrors.budget || "Associate with a budget for tracking"}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (!value) return <em>None</em>;
                          const selected = mockBudgets.find(b => b.id === value);
                          return selected ? selected.name : value;
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {mockBudgets.map(budget => (
                        <MenuItem key={budget.id} value={budget.id}>
                          {budget.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount *"
                type="number"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                error={!!formErrors.amount}
                helperText={formErrors.amount}
                InputProps={{
                  startAdornment: '$',
                }}
                inputProps={{
                  min: 0.01,
                  step: 0.01,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Add any additional details..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#500b28',
              '&:hover': { bgcolor: '#3c081e' },
              fontWeight: 500
            }}
          >
            {loading ? 'Processing...' : (editingId ? 'Update' : 'Add')} Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;