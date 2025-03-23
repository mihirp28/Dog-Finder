// src/components/Footer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box textAlign="center" padding="1rem" marginTop="2rem" bgcolor="#f5f5f5">
      <Typography variant="body2">© 2025 DOG-LOVERS. All rights reserved.</Typography>
      <Typography variant="body2">Contact us: info@doglovers.com</Typography>
    </Box>
  );
};

export default Footer;
