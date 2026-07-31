import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketProvider';
import ConversationList from './ConversationList';
import services from '../services/services';
import MessageBox from './MessageBox';
import { Box, Drawer, AppBar } from '@mui/material';

const MainAppPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState(null);
  const [selectedChat, setSelectedChat] = useState(0);
  const [messages, setMessages] = useState(null);
  const { logout } = useAuth();

  const handleMessageLoad = async (convoId) => {
    try {
      const newMessages = await services.getMessages(convoId);
      setMessages(newMessages);
    } catch {
      console.log('Messages failed to load');
    }
  };

  useEffect(() => {
    if (conversations && conversations[selectedChat]) {
      handleMessageLoad(conversations[selectedChat].id);
    }
  }, [selectedChat, conversations]);

  const generateTitle = (convoObj) => {
    if (convoObj.title) {
      return convoObj.title;
    } else {
      return convoObj.participants.find((u) => u.id !== user.id).name;
    }
  };

  const loadConversations = async () => {
    try {
      let convos = await services.getConversations();
      convos = convos.map((c) => ({ ...c, title: generateTitle(c) }));
      setConversations(convos);
    } catch {
      console.log('Couldnt retrieve conversations');
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', loadConversations);
    socket.on('receiveMessage', loadConversations);

    return () => {
      socket.off('connect', loadConversations);
      socket.off('receiveMessage', loadConversations);
    };
  }, [socket]);

  const drawerWidth = 400;
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <ConversationList
        conversations={conversations}
        drawerWidth={drawerWidth}
        handleMessageLoad={handleMessageLoad}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <MessageBox
        drawerWidth={drawerWidth}
        messages={messages}
        convoObj={conversations?.[selectedChat]}
      />
    </Box>
  );
};

export default MainAppPage;
