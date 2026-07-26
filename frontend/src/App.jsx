import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import MainAppPage from './components/MainAppPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainAppPage />} />
      </Route>
    </Routes>
  );
};

export default App;
