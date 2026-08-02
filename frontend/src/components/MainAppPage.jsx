import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketProvider';
import ConversationList from './ConversationList';
import services from '../services/services';
import MessageBox from './MessageBox';
import { Box, Drawer, AppBar } from '@mui/material';

const drawerWidth = 400;

const MainAppPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState(null);
  const { logout } = useAuth();

  const generateTitle = useCallback((convoObj) => {
    if (convoObj.title) {
      return convoObj.title;
    } else {
      return convoObj.participants.find((u) => u.userId.id !== user.id).userId.name;
    }
  }, [user]);

  const handleMessageLoad = useCallback(async (convoId) => {
    try {
      const newMessages = await services.getMessages(convoId);
      setMessages(newMessages);
    } catch {
      console.log('Messages failed to load');
    }
  }, []);

  const handleReceiveMessage = ({ receivingConversation }) => {
    setConversations(prev => {
      if (!prev) return [receivingConversation];

      const exists = prev.find((c) => c.id === receivingConversation.id);
      if (!exists) {
        return [...prev, receivingConversation];
      }

      return prev.map((c) => c.id === receivingConversation.id ? receivingConversation : c);
    });

    if (receivingConversation.id === selectedConversationIdRef.current) {
      setMessages((prev) => [...prev, receivingConversation.lastMessage])
    }
  }

  const selectedConversationIdRef = useRef(null);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    if (!socket) return;

    const initialize = async () => {
      try {
        let convos = await services.getConversations();
        console.log(convos);
        convos = convos.map(c => ({
          ...c,
          title: generateTitle(c),
        }));

        setConversations(convos);

        if (convos.length > 0) {
          setSelectedConversationId(convos[0].id);
        }
      } catch {
        console.log("Couldn't retrieve conversations");
      }
    };

    initialize();

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedConversationId) return;
    handleMessageLoad(selectedConversationId);
  }, [selectedConversationId]);

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
        selectedConversationId={selectedConversationId}
        setSelectedConversationId={setSelectedConversationId}
      />
      <MessageBox
        drawerWidth={drawerWidth}
        messages={messages}
        convoObj={conversations && conversations.find((c) => c.id === selectedConversationId)}
      />
    </Box>
  );
};

export default MainAppPage;
