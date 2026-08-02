import { Box, AppBar, Toolbar, TextField, Card, Typography, Stack, Button } from "@mui/material";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthContext";
import Message from "./Message";
import SendMessage from "./SendMessages";

const MessageBox = ({ drawerWidth, messages, convoObj }) => {
  if (!convoObj) {
    return null;
  }

  const socket = useSocket();
  const handleMessageSending = (msg) => {
    socket.emit('sendMessage', { message: msg, convoId: convoObj.id });
  }

  const { logout } = useAuth();
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
      </Stack>
      <SendMessage handleMessageSending={handleMessageSending} />
    </Box>
  )
}

export default MessageBox;