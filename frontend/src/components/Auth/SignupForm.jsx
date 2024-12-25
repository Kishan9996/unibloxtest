import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { signup } from '../../services/api/auth';

const SignupForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate to navigate programmatically

  const validateForm = () => {
    if (!email || !name || !password) {
      setError('All fields are required.');
      return false;
    }
    // Add more validation logic as needed (e.g., regex for email, password length)
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await signup({ email, name, password });
      if (response.status === 200) {
        onSuccess();
        navigate('/login'); // Redirect to the login page upon successful signup
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Sign Up
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
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </Box>
  );
};

export default SignupForm;
