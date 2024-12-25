import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { Box, Typography } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/products');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'white', // Set the background color to white for the entire page
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Login to Your Account
      </Typography>
      <LoginForm onSuccess={handleLoginSuccess} />
    </Box>
  );
};

export default LoginPage;
