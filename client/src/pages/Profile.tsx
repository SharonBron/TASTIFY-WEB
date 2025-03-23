import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Avatar, Box, IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching user profile...', { userId, token });
  
      if (!userId || !token) {
        console.warn('Missing token or userId');
        return;
      }
  
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('✅ User fetched:', res.data);
  
        const user = res.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        if (user.profileImage) {
          setProfileImage(`${process.env.REACT_APP_API_URL}${user.profileImage}`);
        }
      } catch (err) {
        console.error('❌ Failed to fetch user profile:', err);
      }
    };
  
    fetchProfile();
  }, [userId, token]);
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId || !token) return;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedUser = res.data;
      alert('Profile updated successfully!');
      if (updatedUser.profileImage) {
        setProfileImage(`${process.env.REACT_APP_API_URL}${updatedUser.profileImage}`);
      }
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
      alert('Failed to update profile.');
    }
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