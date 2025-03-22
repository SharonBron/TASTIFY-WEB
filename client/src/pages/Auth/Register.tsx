import React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Paper,
  Link
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log('Register Data:', data);
    // Submit to backend API
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
          <PersonAddAlt1Icon />
        </Avatar>
        <Typography variant="h5" mt={1}>Register</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Register
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Already have an account?
              <Link component={RouterLink} to="/login" sx={{ ml: 1 }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
