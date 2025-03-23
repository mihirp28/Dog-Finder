// src/components/NavigationBar.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Badge,
  IconButton,
  Paper,
  InputBase
} from '@mui/material';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { logout } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

// MUI Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteIds, clearFavorites } = useFavorites();
  const { logoutUser } = useAuth();

  // Local state for the user’s typed dog name
  const [searchName, setSearchName] = useState('');

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

  // Called when user presses Enter or clicks the search icon
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      navigate({
        pathname: '/search',
        search: `?${createSearchParams({ name: searchName })}`,
      });
    } else {
      navigate('/search');
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
        backgroundColor: '#fff',
        color: 'black',
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

        {/* Center: "Paper" search bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ flexGrow: 1, maxWidth: 400, mx: 4 }}
        >
          <Paper
            sx={{
              p: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f4f4f4', // Gray background
              borderRadius: '8px',
            }}
          >
            <SearchIcon sx={{ color: '#666', mr: 1 }} />
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Paper>
        </Box>

        {/* Right: Favorites + Logout */}
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate('/favorites')}
            sx={{ color: 'inherit', flexDirection: 'column' }}
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

          <IconButton
            onClick={handleLogout}
            sx={{ color: 'inherit', flexDirection: 'column' }}
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
