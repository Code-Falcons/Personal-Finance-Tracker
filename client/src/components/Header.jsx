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
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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

  const navItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'Budget & Savings', path: '/budget-savings' },
        { label: 'About', path: '/about' },
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
      ];

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'white',
        boxShadow: '0 2px 12px rgba(80, 11, 40, 0.12)',
        borderBottom: '1px solid rgba(80, 11, 40, 0.08)',
        mb: 3,
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2 } }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to={user ? '/dashboard' : '/'}
          sx={{
            flexGrow: 1,
            color: '#500b28',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              bgcolor: '#500b28',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            $
          </Box>
          Personal Finance Tracker
        </Typography>

        {/* Desktop Navigation + Logout */}
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
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: '#500b28',
                    bgcolor: 'rgba(80, 11, 40, 0.04)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {user && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleLogout}
                sx={{
                  borderColor: '#500b28',
                  color: '#500b28',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(80, 11, 40, 0.08)',
                    borderColor: '#500b28',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Menu Trigger */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={user ? handleMenuOpen : () => navigate('/login')}
            sx={{ color: '#500b28', ml: 1 }}
          >
            {user ? (
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#500b28' }}>
                {user.initials || 'JD'}
              </Avatar>
            ) : (
              <MenuIcon />
            )}
          </IconButton>
        )}

        {/* Mobile Menu (with Logout) */}
        {isMobile && user && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 12px rgba(80, 11, 40, 0.15))',
                mt: 1.5,
                minWidth: 200,
                borderRadius: '12px',
                '& .MuiMenuItem-root': {
                  py: 1.2,
                  px: 2,
                  fontSize: '0.95rem',
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#500b28', fontWeight: 600 }}>
                {user.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Divider />
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={handleMenuClose}
                sx={{
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'rgba(80, 11, 40, 0.08)' },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: '#d32f2f',
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;