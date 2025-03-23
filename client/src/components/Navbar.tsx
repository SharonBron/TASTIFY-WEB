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
      elevation={0}
      sx={{ backgroundColor: '#f5f5f5', color: '#000', px: 4 }}
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
          <Button component={Link} to="/home" color="inherit">Home</Button>
          <Button component={Link} to="/my-posts" color="inherit">My Posts</Button>
          <Button component={Link} to="/profile" color="inherit">Profile</Button>
          <Button component={Link} to="/login" color="inherit">Logout</Button>
        </Box>

        {/* Search icon and input on the right */}
        <Box sx={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
          {showSearch && (
            <InputBase
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              sx={{
                px: 1,
                py: 0.5,
                border: '1px solid #ccc',
                borderRadius: 1,
                backgroundColor: '#fff',
              }}
            />
          )}
          <IconButton onClick={handleSearchClick}>
            <SearchIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
