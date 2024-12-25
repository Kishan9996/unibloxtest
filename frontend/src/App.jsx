import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import { AuthProvider } from './components/Auth/Auth';
import ProductsPage from './components/ProductList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdminLoginPage from './components/Admin/AdminLoginPage';

function App() {
  // Define a Material-UI theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Customize the primary color
      },
      secondary: {
        main: '#9c27b0', // Customize the secondary color
      },
      error: {
        main: '#f44336', // Customize the error color
      },
      background: {
        default: '#f4f6f8', // Customize the background color
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif', // Set default font family
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained', // Set default button style
        },
      },
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Header />
          <Routes>
            {/* Default route redirects to /products */}
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
