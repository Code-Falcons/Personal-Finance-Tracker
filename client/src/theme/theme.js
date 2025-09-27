import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E21C34',
      dark: '#C1172D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#500B28',
      dark: '#3B081E',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#27AE60',
      dark: '#1E8449',
    },
    warning: {
      main: '#F39C12',
      dark: '#D68910',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#2B2B2B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#500B28',
    },
    h2: {
      fontWeight: 600,
      color: '#500B28',
    },
    h3: {
      fontWeight: 600,
      color: '#500B28',
    },
    h4: {
      fontWeight: 600,
      color: '#500B28',
    },
    h5: {
      fontWeight: 600,
      color: '#500B28',
    },
    h6: {
      fontWeight: 600,
      color: '#500B28',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;