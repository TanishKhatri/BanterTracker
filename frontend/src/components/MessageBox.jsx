import { useEffect, useRef } from "react";
import { Box, AppBar, Toolbar, TextField, Card, Typography, Stack, Button } from "@mui/material";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthContext";
import Message from "./Message";
import SendMessage from "./SendMessages";

const MessageBox = ({ drawerWidth, messages, convoObj }) => {
  console.log(messages);
  console.log(convoObj);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [convoObj?.id]);

  const socket = useSocket();
  const handleMessageSending = (msg) => {
    socket.emit('sendMessage', { message: msg, convoId: convoObj.id });
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }

  const { logout } = useAuth();

  if (!convoObj) {
    return null;
  }
  
  return (
    <Box position='fixed' sx={{
      display: "flex", 
      width: `calc(100% - ${drawerWidth}px)`, 
      ml: `${drawerWidth}px`,
      flexDirection: 'column', 
      height: '100vh'
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {convoObj.title}
          </Typography>
          <Button onClick={logout} color="white">logout</Button>
        </Toolbar>
      </AppBar>
      <Stack spacing={2} sx={{ 
        flex: '1 1 auto',   // take remaining space under AppBar
        minHeight: 0,       
        overflowY: 'auto',
        p: 4
       }}>
        {messages && (
          messages.map((m) => <Message key={m.id} messageObj={m} />)
        )}
        <Box ref={bottomRef}></Box>
      </Stack>
      <SendMessage handleMessageSending={handleMessageSending} />
    </Box>
  )
}

export default MessageBox;