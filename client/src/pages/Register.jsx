// src/pages/Register.jsx
import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const currencyOptions = ["CAD", "USD", "EUR", "GBP"];

export default function Register() {
  const { register: authRegister, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: { currency: "CAD" },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    const { name, email, password, currency } = data;
    const res = await authRegister({ name, email, password, currency });
    if (res.ok) {
      navigate("/dashboard");
    } else {
      // Set form error for better UX instead of alert
      setError("root", { 
        type: "manual", 
        message: res.error || "Registration failed" 
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#e2e2e2',
        p: 2
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: isMobile ? 400 : 450,
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                color: '#500b28',
                fontWeight: 700,
                mb: 1
              }}
            >
              Create an Account
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Join Personal Finance Tracker to manage your finances
            </Typography>
          </Box>

          {/* Error Alert */}
          {(errors.root?.message || authError) && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError("root", { message: "" })}
            >
              {errors.root?.message || authError}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Name"
              type="text"
              placeholder="Your name"
              margin="normal"
              autoComplete="name"
              {...formRegister("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
              InputProps={{
                sx: {
                  bgcolor: 'white',
                  borderRadius: '12px'
                }
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="you@example.com"
              margin="normal"
              autoComplete="email"
              {...formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              InputProps={{
                sx: {
                  bgcolor: 'white',
                  borderRadius: '12px'
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              margin="normal"
              autoComplete="new-password"
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              InputProps={{
                sx: {
                  bgcolor: 'white',
                  borderRadius: '12px'
                },
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              margin="normal"
              autoComplete="new-password"
              {...formRegister("passwordConfirm", {
                required: "Please confirm your password",
                validate: (val) => val === password || "Passwords do not match",
              })}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              disabled={loading}
              InputProps={{
                sx: {
                  bgcolor: 'white',
                  borderRadius: '12px'
                },
                endAdornment: (
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.currency}
              disabled={loading}
            >
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                label="Currency"
                {...formRegister("currency", { required: "Currency is required" })}
                sx={{
                  bgcolor: 'white',
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    py: 1.5,
                  }
                }}
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.currency?.message}</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#500b28',
                '&:hover': {
                  bgcolor: '#3c081e'
                },
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          {/* Footer Links */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#2e7d32',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}