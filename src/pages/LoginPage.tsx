import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadFavorites } = useFavorites();
  const { loginUser } = useAuth();
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      await login(name.trim(), email.trim());
      loginUser(email.trim());
      loadFavorites(email.trim());
      navigate('/search');
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  const assetBase = process.env.PUBLIC_URL || '';
  const radius = theme.shape.borderRadius;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 70%: Image Panel */}
      <Box
        sx={{
          flex: 7,
          position: 'relative',
          backgroundImage: `url("${assetBase}/assets/t-dog.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
          },
          borderTopRightRadius: radius * 2,
          borderBottomRightRadius: radius * 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          pt: 2,
          pl: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <Box
            component="img"
            src={`${assetBase}/assets/brand-logo.png`}
            alt="Logo"
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',           // <-- make it perfectly circular
            }}
          />
          <Typography
            variant="h5"
            sx={{ color: 'common.white', fontWeight: 'bold', ml: 1 }}
          >
            My Dog Finder
          </Typography>
        </Box>
      </Box>

      {/* 30%: Login Form Panel */}
      <Box
        sx={{
          flex: 3,
          position: 'relative',
          bgcolor: darkMode ? 'grey.900' : 'grey.50',
          borderTopLeftRadius: radius * 2,
          borderBottomLeftRadius: radius * 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => setDarkMode((prev) => !prev)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: darkMode ? 'common.white' : 'text.primary',
          }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Paper
          elevation={8}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '80%',
            maxWidth: 360,
            p: 4,
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
            bgcolor: darkMode
              ? 'rgba(25,25,25,0.85)'
              : 'rgba(255,255,255,0.85)',
            color: darkMode ? 'common.white' : 'text.primary',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>
          {error && (
            <Typography color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon
                    sx={{ color: darkMode ? 'common.white' : undefined }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputLabel-root': {
                color: darkMode ? 'rgba(255,255,255,0.75)' : undefined,
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? 'grey.700' : undefined,
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon
                    sx={{ color: darkMode ? 'common.white' : undefined }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputLabel-root': {
                color: darkMode ? 'rgba(255,255,255,0.75)' : undefined,
              },
              '& .MuiInputBase-input': {
                color: darkMode ? '#fff' : undefined,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: darkMode ? 'grey.700' : undefined,
              },
            }}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleLogin}
            sx={{
              mt: 2,
              background: darkMode
                ? (t) =>
                    `linear-gradient(45deg, ${t.palette.primary.dark}, ${t.palette.secondary.dark})`
                : 'linear-gradient(45deg, #FF8E53, #FE6B8B)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            LOG IN
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don’t have an account?{' '}
              <Link
                href="#"
                underline="none"
                sx={{ color: darkMode ? 'primary.light' : 'primary.main' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
