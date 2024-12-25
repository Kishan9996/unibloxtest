import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api/auth';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate to redirect the user

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
