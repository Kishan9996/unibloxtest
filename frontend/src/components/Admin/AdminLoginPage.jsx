import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AdminLoginForm from './AdminLoginForm';

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/admin');
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
        Admin Login
      </Typography>
      <AdminLoginForm onSuccess={handleLoginSuccess} />
    </Box>
  );
};

export default AdminLoginPage;
