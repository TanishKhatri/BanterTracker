import { useAuth } from './AuthContext';
import { createContext, useContext, useEffect, useState} from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [ socket, setSocket ] = useState(null);

  useEffect(() => {
    if (!user) return;

    const socket = io('/', {
      auth: { token },
    });

    setSocket(socket);

    return () => socket.disconnect();
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);