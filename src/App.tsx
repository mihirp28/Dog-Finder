import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import MatchResultPage from './pages/MatchResultPage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light'|'dark'>('light');
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );
  const toggleDarkMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/search"
                element={
                  <SearchPage
                    mode={mode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <FavoritesPage
                    mode={mode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                }
              />
              <Route
                path="/match"
                element={
                  <MatchResultPage
                    mode={mode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                }
              />
            </Route>
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;
