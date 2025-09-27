// src/pages/Login.jsx
import React from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = React.useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async ({ email, password }) => {
    const res = await login(email, password);
    if (res.ok) {
      navigate(from, { replace: true });
    } else {
      // Set form error for better UX
      setError("root", { 
        type: "manual", 
        message: res.error || "Invalid email or password" 
      });
    }
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
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
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
              Welcome back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Sign in to your Personal Finance Tracker account
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

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="you@example.com"
              margin="normal"
              autoComplete="email"
              {...register("email", {
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
              placeholder="Your password"
              margin="normal"
              autoComplete="current-password"
              {...register("password", {
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
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

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
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          {/* Footer Links */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              New here?{' '}
              <Link
                to="/register"
                style={{
                  color: '#2e7d32',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Create an account
              </Link>
            </Typography>
            
            {/* Forgot Password (optional enhancement) */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: '#500b28',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Forgot your password?
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}