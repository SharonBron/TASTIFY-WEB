import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  InputBase,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

type NavbarProps = {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ searchTerm = '', setSearchTerm }) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        background: 'linear-gradient(to right, #2193b0, #6dd5ed)', 
        color: '#fff',
        px: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Logo on the left */}
        <Box sx={{ position: 'absolute', left: 20, display: 'flex', alignItems: 'center' }}>
          <Link to="/home">
            <img
              src="/images/logo_tastify.png"
              alt="Tastify Logo"
              style={{ height: 60, width: 100 }}
            />
          </Link>
        </Box>

        {/* Centered nav links */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Button component={Link} to="/home" sx={{ color: '#fff', fontWeight: 500 }}>Home</Button>
          <Button component={Link} to="/my-posts" sx={{ color: '#fff', fontWeight: 500 }}>My Posts</Button>
          <Button component={Link} to="/profile" sx={{ color: '#fff', fontWeight: 500 }}>Profile</Button>
          <Button component={Link} to="/login" sx={{ color: '#fff', fontWeight: 500 }}>Logout</Button>
        </Box>

        {/* Search on the right */}
        <Box sx={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
          {showSearch && (
            <InputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              sx={{
                px: 1.5,
                py: 0.5,
                border: '1px solid #fff',
                borderRadius: 2,
                backgroundColor: '#fff',
                color: '#000',
                width: 200,
              }}
            />
          )}
          <IconButton onClick={handleSearchClick} sx={{ color: '#fff' }}>
            <SearchIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
