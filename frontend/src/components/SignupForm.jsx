import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import services from '../services/services';

const SignupForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await services.signup({ username, name, password });
      navigate('/login');
    } catch(error) {
      console.log(error.message);
    }
  };

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
      <Typography variant="h3">Signup</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          variant="standard"
          label="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="standard"
          label="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="standard"
          label="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Signup
        </Button>
      </Box>
    </Paper>
  );
};

export default SignupForm;
