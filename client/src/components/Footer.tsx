import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #6dd5ed, #2193b0)', 
        color: '#fff',
        p: 2,
        textAlign: 'center',
        mt: 4,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Tastify — All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
