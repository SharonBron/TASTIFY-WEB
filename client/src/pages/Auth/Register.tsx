import React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Paper,
  Link,
  Divider
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

type FormValues = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, data);
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user._id);
      navigate('/home', { replace: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.response?.data?.msg || 'Registration failed.');
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google`, {
        idToken: credentialResponse.credential,
      });

      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user._id);
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('❌ Google login failed:', error);
      alert('Google login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
          <PersonAddAlt1Icon />
        </Avatar>
        <Typography variant="h5" mt={1}>Register</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Username" margin="normal" {...register('username')} error={!!errors.username} helperText={errors.username?.message} />
          <TextField fullWidth label="First Name" margin="normal" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} />
          <TextField fullWidth label="Last Name" margin="normal" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Register</Button>
        </Box>

        <Divider sx={{ my: 3 }}>Or register with</Divider>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert('Google login failed')}
        />

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account?
            <Link component={RouterLink} to="/login" sx={{ ml: 1 }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
