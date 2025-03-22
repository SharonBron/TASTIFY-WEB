import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', p: 2, textAlign: 'center', mt: 4 }}>
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Tastify - All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
