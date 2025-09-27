import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  LinearProgress,
  Typography
} from '@mui/material';

export default function SavingGoalDialog({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    initialAmount: '',
    targetDate: '',
    description: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const progress = formData.initialAmount && formData.targetAmount
    ? (Number(formData.initialAmount) / Number(formData.targetAmount)) * 100
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.initialAmount) >= Number(formData.targetAmount)) {
      setError('Initial amount must be less than target amount');
      return;
    }
    if (new Date(formData.targetDate) <= new Date()) {
      setError('Target date must be in the future');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#500B28' }}>Create Saving Goal</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              name="title"
              label="Goal Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="targetAmount"
              label="Target Amount"
              type="number"
              value={formData.targetAmount}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="initialAmount"
              label="Initial Amount"
              type="number"
              value={formData.initialAmount}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              name="targetDate"
              label="Target Date"
              type="date"
              value={formData.targetDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            {progress > 0 && (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Initial Progress: {progress.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#27AE60'
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Goal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}