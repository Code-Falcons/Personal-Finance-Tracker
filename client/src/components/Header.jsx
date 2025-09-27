// src/components/Header.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // For mobile navigation
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  // Navigation items based on auth state
  const navItems = user 
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'BudgetSavings', path: '/budget-savings' },
        { label: 'About', path: '/about' },
        // { label: 'Contact', path: '/contact' },
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
      ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'white', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        mb: 3
      }}
    >
      <Toolbar>
        {/* Logo/Title */}
        <Typography 
          variant="h6" 
          component={Link}
          to={user ? "/dashboard" : "/"}
          sx={{ 
            flexGrow: 1, 
            color: '#2e7d32', 
            fontWeight: 600,
            textDecoration: 'none',
            mr: 2
          }}
        >
          Personal Finance Tracker
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': { color: '#2e7d32' }
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {user && (
              <>
                <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32, mr: 1 }}>
                  {user.initials || 'JD'}
                </Avatar>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && user && (
          <>
            <Avatar 
              sx={{ bgcolor: '#2e7d32', width: 32, height: 32, mr: 1 }}
              onClick={handleMenuOpen}
            >
              {user.initials || 'JD'}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Mobile Auth Buttons (non-logged in) */}
        {isMobile && !user && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={Link} 
              to="/login"
              size="small"
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register"
              variant="contained"
              size="small"
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;