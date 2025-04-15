import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    console.log({ email, password, remember });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f1f8e9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Card sx={{ width: 400, borderRadius: 3, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h4" align="center" color="green" gutterBottom>
            NutriSync
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" mb={3}>
            Sign in to manage your recipes 🍽️
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
            />
            <FormControlLabel
              control={<Checkbox name="remember" defaultChecked />}
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="success"
              endIcon={<LoginIcon />}
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
