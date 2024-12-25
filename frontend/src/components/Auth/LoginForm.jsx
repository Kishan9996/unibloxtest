import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../../services/api/auth';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate to redirect the user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login function from your API service
      const response = await login({ email, password });

      // Assuming the response contains the token, extract it and store it in localStorage
      const token = response.data.data.accessToken; // Adjust this depending on the actual response structure
      const user = response.data.data.user; // Adjust this depending on the actual response structure

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Call the onSuccess callback and redirect to the products page
      onSuccess();
      navigate('/products'); // Redirect to the products page upon successful login
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: '0 auto',
        padding: 2,
        borderRadius: 1,
        boxShadow: 3,
        bgcolor: 'background.paper', // Background for the form box
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Log In
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        sx={{ marginBottom: 2 }}
      />
      {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ padding: 1 }}
      >
        {loading ? 'Logging In...' : 'Log In'}
      </Button>
    </Box>
  );
};

export default LoginForm;