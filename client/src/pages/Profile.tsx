import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Avatar, Box, IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState('Yael');
  const [lastName, setLastName] = useState('Reifman');
  const [email] = useState('example@example.com'); // לא ניתן לערוך
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert('Profile updated!');
    // בהמשך: שליחה לשרת
  };

  return (
    <>
      <Navbar />

      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>My Profile</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={profileImage ?? ''} sx={{ width: 80, height: 80 }} />
          <label htmlFor="upload-photo">
            <input
              accept="image/*"
              id="upload-photo"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <TextField
          label="First Name"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          disabled
          sx={{ mb: 3 }}
        />

        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Container>

      <Footer />
    </>
  );
};

export default Profile;
