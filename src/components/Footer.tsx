import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      textAlign="center"
      p={2}
      mt={4}
      sx={{
        bgcolor: 'background.paper',   // uses theme.palette.background.paper
        color: 'text.secondary',       // uses theme.palette.text.secondary
      }}
    >
      <Typography variant="body2">
        © 2025 DOG-LOVERS. All rights reserved.
      </Typography>
      <Typography variant="body2">
        Contact us: info@doglovers.com
      </Typography>
    </Box>
  );
};

export default Footer;
