import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import services from '../services/services';

const LoginForm = ({ handleLogin }) => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

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
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username: 
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );
}

export default LoginForm;
