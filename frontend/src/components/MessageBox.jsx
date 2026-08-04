import { useEffect, useRef, useCallback } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  Card,
  Typography,
  Stack,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { useSocket } from './SocketProvider';
import { useAuth } from './AuthContext';
import Message from './Message';
import SendMessage from './SendMessages';

const MessageBox = ({ drawerWidth, messages, convoObj }) => {
  const { user } = useAuth();
  const toBeMarked = useRef(null);
  const unreadMessages = useRef(new Set());

  const getAllUnreadMessages = useCallback(() => {
    const lastMessageReadDate = new Date(convoObj.participants.find((p) => p.userId.id === user.id).lastMessageRead);
    messages.forEach((m) => {
      const messageDate = new Date(m.createdAt);
      if (messageDate > lastMessageReadDate) {
        unreadMessages.add(m.id);
      }
    })
  }, [messages, convoObj])

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'auto',
    });
  }, [convoObj?.id]);

  const socket = useSocket();
  const handleMessageSending = (msg) => {
    socket.emit('sendMessage', { message: msg, convoId: convoObj.id });
    bottomRef.current?.scrollIntoView({
      behavior: 'auto',
    });
  };

  useEffect(() => {
    if (!messages) return;
    socket.emit('markRead', { messageId: messages[messages.length - 1].id });
  }, [messages]);

  const { logout } = useAuth();

  if (!convoObj) {
    return null;
  }

  return (
    <Box
      position="fixed"
      sx={{
        display: 'flex',
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {convoObj.title}
          </Typography>
          <Button onClick={logout} color="white">
            logout
          </Button>
        </Toolbar>
      </AppBar>
      <Stack
        spacing={2}
        sx={{
          flex: '1 1 auto', // take remaining space under AppBar
          minHeight: 0,
          overflowY: 'auto',
          p: 4,
        }}
      >
        {messages &&
          messages.map((m, i) => {
            const currentDate = new Date(m.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            const previousDate =
              i > 0
                ? new Date(messages[i - 1].createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : null;

            const showDivider = i === 0 || currentDate !== previousDate;
            return (
              <Box
                key={m.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {showDivider && (
                  <Divider>
                    <Chip label={currentDate} size="small" />
                  </Divider>
                )}
                <Message messageObj={m} />
              </Box>
            );
          })}
        <Box ref={bottomRef}></Box>
      </Stack>
      <SendMessage handleMessageSending={handleMessageSending} />
    </Box>
  );
};

export default MessageBox;
