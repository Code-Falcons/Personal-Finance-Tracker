// src/pages/Transactions.jsx
import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

// Mock data
const mockCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Rent',
  'Groceries',
  'Utilities',
  'Transportation',
  'Dining',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
];

const initialTransactions = [
  { id: 1, date: '2023-05-15', category: 'Salary', type: 'Income', amount: 3500, notes: 'Monthly salary' },
  { id: 2, date: '2023-05-16', category: 'Rent', type: 'Expense', amount: 1200, notes: 'Apartment rent' },
  { id: 3, date: '2023-05-17', category: 'Groceries', type: 'Expense', amount: 240, notes: 'Weekly shopping' },
  { id: 4, date: '2023-05-18', category: 'Freelance', type: 'Income', amount: 750, notes: 'Website project' },
  { id: 5, date: '2023-05-19', category: 'Utilities', type: 'Expense', amount: 180, notes: 'Electricity & water' },
  { id: 6, date: '2023-05-20', category: 'Dining', type: 'Expense', amount: 95, notes: 'Dinner with friends' },
  { id: 7, date: '2023-05-21', category: 'Investments', type: 'Income', amount: 200, notes: 'Dividend payment' },
  { id: 8, date: '2023-05-22', category: 'Transportation', type: 'Expense', amount: 65, notes: 'Gas refill' },
];

const budgetAlerts = [
  { id: 1, category: 'Entertainment', spent: 120, budget: 100, exceeded: 20 },
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
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    type: 'Expense',
    category: '',
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
      if (filters.category !== 'All' && transaction.category !== filters.category) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          transaction.category.toLowerCase().includes(searchLower) ||
          transaction.notes.toLowerCase().includes(searchLower)
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
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Valid amount is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleFormSubmit = () => {
    if (!validateForm()) return;
    
    const newTransaction = {
      id: editingId || Date.now(),
      date: format(formData.date, 'yyyy-MM-dd'),
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
    };
    
    if (editingId) {
      setTransactions(prev => 
        prev.map(t => t.id === editingId ? newTransaction : t)
      );
    } else {
      setTransactions(prev => [...prev, newTransaction]);
    }
    
    handleCloseDialog();
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setFormData({
      date: parseISO(transaction.date),
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      notes: transaction.notes,
    });
    setEditingId(transaction.id);
    setOpenDialog(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Open dialog for new transaction
  const handleOpenDialog = () => {
    setFormData({
      date: new Date(),
      type: 'Expense',
      category: '',
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

  // DataGrid columns
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => format(parseISO(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Typography 
          sx={{ 
            color: params.value === 'Income' ? '#2e7d32' : '#d32f2f',
            fontWeight: 500 
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography 
          sx={{ 
            color: params.row.type === 'Income' ? '#2e7d32' : '#d32f2f',
            fontWeight: 600 
          }}
        >
          ${params.value.toLocaleString()}
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
          <IconButton 
            size="small" 
            onClick={() => handleEdit(params.row)}
            sx={{ color: '#500b28' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDelete(params.row.id)}
            sx={{ color: '#d32f2f' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Custom toolbar for DataGrid
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#e2e2e2', minHeight: '100vh' }}>
      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            bgcolor: '#fff8e1', 
            borderLeft: '4px solid #500b28',
            '& .MuiAlert-icon': { color: '#500b28' }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#500b28' }}>
            Budget Alert: {budgetAlerts[0].category} spending exceeded by ${budgetAlerts[0].exceeded}
          </Typography>
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
            fontWeight: 500
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#500b28' }}>
              Filters
            </Typography>
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              size="small"
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
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
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
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Notes or category"
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
      <Card>
        <Box sx={{ height: 600, width: '100%' }}>
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
            }}
          />
        </Box>
      </Card>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#500b28', fontWeight: 600 }}>
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
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category *"
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                error={!!formErrors.category}
                helperText={formErrors.category}
              >
                {mockCategories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleFormSubmit} 
            variant="contained" 
            sx={{ 
              bgcolor: '#500b28',
              '&:hover': { bgcolor: '#3c081e' }
            }}
          >
            {editingId ? 'Update' : 'Add'} Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;