import { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
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
