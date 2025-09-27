import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Transactions from "./pages/Transactions.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import About from "./pages/About.jsx";
// import Contact from "./pages/Contact.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Header from "./components/Header.jsx";
import BudgetSavings from "./pages/BudgetSavings.jsx";

// Custom theme with finance colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Finance green
    },
    secondary: {
      main: '#500b28', // Accent color
    },
    background: {
      default: '#e2e2e2',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default function App() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/budget-savings" element={<ProtectedRoute><BudgetSavings /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
        <Route path="*" element={<h2>404 – Page not found</h2>} />
      </Routes>
    </ThemeProvider>
  );
}

