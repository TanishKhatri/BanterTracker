import { createContext, useContext, useState } from 'react';
import services from '../services/services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const newToken = localStorage.getItem('token');
    if (newToken) {
      services.setToken(newToken);
    }
    return newToken;
  });
  
  const [user, setUser] = useState(() => {
    const stringUser = localStorage.getItem('user');
    if (stringUser) {
      return JSON.parse(stringUser);
    }
    return null;
  });

  const login = (userObj) => {
    localStorage.setItem('token', userObj.token);
    localStorage.setItem('user', JSON.stringify(userObj));
    services.setToken(userObj.token);
    setUser(userObj);
    setToken(userObj.token);
  };

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token');
    services.setToken(null);
    setToken(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
