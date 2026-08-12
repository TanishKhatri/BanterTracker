import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import SignupForm from './SignupForm';
import services from '../services/services';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { token, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await services.login({ username, password });
      login(res);
      navigate('/');
    } catch {
      console.log('error occured');
    }
  };

  const signupEvent = () => {
    navigate('/signup');
  }

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 2,
        width: 450,
      }}
    >
      <Typography variant="h3">Login</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          variant="standard"
          label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></TextField>
        <TextField
          variant="standard"
          label="password"
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <Box sx={{
          display: 'flex',
          gap: 2
        }}>
          <Button type='submit' variant='contained'>login</Button>
          <Button variant='contained' onClick={signupEvent}>signup</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;
