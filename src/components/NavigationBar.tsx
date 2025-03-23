// src/components/NavigationBar.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Badge,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds, clearFavorites } = useFavorites();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      clearFavorites(); 
      logoutUser(); 
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        margin: 0,
        borderRadius: 0,
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff', // White background
        color: 'black',          // Black text/icons
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left: Brand Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden',
              marginRight: 2,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/search')}
          >
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/assets/brand-logo.png`}
              alt="Brand Logo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
            My Dog Finder
          </Typography>
        </Box>

        {/* Center: Nav Icons (LinkedIn-style) */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <IconButton
            onClick={() => navigate('/search')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              color: 'inherit',
              padding: 0,
            }}
          >
            <SearchIcon />
            <Typography variant="caption">Search</Typography>
          </IconButton>

          {/* Favorites with Badge */}
          <IconButton
            onClick={() => navigate('/favorites')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              color: 'inherit',
              padding: 0,
            }}
          >
            <Badge
              badgeContent={favoriteIds.length}
              color="error"
              overlap="rectangular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  transform: 'scale(1) translate(30%, -30%)',
                },
              }}
            >
              <FavoriteIcon />
            </Badge>
            <Typography variant="caption">Favorites</Typography>
          </IconButton>

          {/* Logout */}
          <IconButton
            onClick={handleLogout}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              color: 'inherit',
              padding: 0,
            }}
          >
            <LogoutIcon />
            <Typography variant="caption">Logout</Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
