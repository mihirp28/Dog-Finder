import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { useFavorites } from '../context/FavoritesContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds } = useFavorites();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // redirect to login page after logout
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
      <Typography variant="h4">Search Dogs</Typography>
      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate('/favorites')}>
          Favorites ({favoriteIds.length})
        </Button>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
