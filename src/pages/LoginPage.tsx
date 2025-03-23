// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';


// Simple email validation function
const isValidEmail = (email: string) => {
  // Basic regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadFavorites } = useFavorites();
  const { loginUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
     // Validate required fields and email format
     if (!name.trim() && !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
     if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await login(name, email);
      loginUser(email)
      // Load favorites for this user using email as key
      loadFavorites(email);
      navigate('/search');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Dog Finder
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
          <TextField 
            label="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <TextField 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Button variant="contained" onClick={handleLogin}>
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
