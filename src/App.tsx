// src/App.tsx

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import MatchResultPage from './pages/MatchResultPage';
import PrivateRoute from './components/PrivateRoute';
import { Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/match" element={<MatchResultPage />} />
          </Route>
        </Routes>
      </Router>
    </Box>
  );
};

export default App;
