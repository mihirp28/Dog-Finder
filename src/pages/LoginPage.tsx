// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

import { 
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper
} from '@mui/material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      if (!name || !email) {
        setError('Please fill in all fields.');
        return;
      }
      await login(name, email);
      // If successful, navigate to search
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
