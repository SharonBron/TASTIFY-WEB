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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user._id);
      navigate('/home', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed.');
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google`, {
        idToken: credentialResponse.credential,
      });
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user._id);
      navigate('/home', { replace: true });
    } catch (error: any) {
      console.error('Google login error:', error);
      alert('Google login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" mt={1}>Login</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Login</Button>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log('Google login failed')}
          useOneTap
        />

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account?
            <Link component={RouterLink} to="/register" sx={{ ml: 1 }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;