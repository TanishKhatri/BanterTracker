import { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Link, useNavigate } from 'react-router';
import { SocketProvider } from './components/SocketProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import MainAppPage from './components/MainAppPage';
import './app.css'

const App = () => {
  return (
    <Box sx={{
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <SocketProvider>
              <MainAppPage />
            </SocketProvider>
          } />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
