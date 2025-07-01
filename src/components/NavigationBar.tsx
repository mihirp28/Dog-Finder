import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Badge,
  IconButton,
  Paper,
  InputBase,
  Tooltip
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../api';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface NavigationBarProps {
  mode: 'light' | 'dark';
  onToggleDarkMode: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  mode,
  onToggleDarkMode
}) => {
  const navigate = useNavigate();
  const { favoriteIds, clearFavorites } = useFavorites();
  const { logoutUser } = useAuth();

  // Sync with ?name=…
  const [searchParams] = useSearchParams();
  const [searchName, setSearchName] = useState(searchParams.get('name') || '');

  useEffect(() => {
    setSearchName(searchParams.get('name') || '');
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      clearFavorites();
      logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = searchName.trim();
    navigate(name ? `/search?name=${encodeURIComponent(name)}` : '/search');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo & Title */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/search')}
        >
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/assets/brand-logo.png`}
            alt="Logo"
            sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1 }}
          />
          <Typography variant="h6" noWrap>
            My Dog Finder
          </Typography>
        </Box>

        {/* Search */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ flexGrow: 1, mx: 4, maxWidth: 400 }}
        >
          <Paper
            sx={{
              p: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'action.hover',
              borderRadius: 1,
            }}
          >
            <SearchIcon color="action" sx={{ mr: 1 }} />
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Search using name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </Paper>
        </Box>

        {/* Right‐hand controls: Dark Mode, Favorites, Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Moved Dark Mode toggle here */}
          <Tooltip
            title={
              mode === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
          >
            <IconButton onClick={onToggleDarkMode} color="inherit">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={() => navigate('/favorites')}
            color="inherit"
            sx={{ flexDirection: 'column' }}
          >
            <Badge badgeContent={favoriteIds.length} color="error">
              <FavoriteIcon />
            </Badge>
            <Typography variant="caption">Favorites</Typography>
          </IconButton>

          <IconButton
            onClick={handleLogout}
            color="inherit"
            sx={{ flexDirection: 'column' }}
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
