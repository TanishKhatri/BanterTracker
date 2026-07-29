import { Box, AppBar, Toolbar, TextField, Card, Typography, Stack } from "@mui/material";
import Message from "./Message";

const MessageBox = ({ drawerWidth, messages, convoObj }) => {
  if (!messages || !convoObj) {
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
        </Toolbar>
      </AppBar>
      <Stack spacing={2} sx={{ 
        flex: '1 1 auto',   // take remaining space under AppBar
        minHeight: 0,       
        overflowY: 'auto',
        p: 4
       }}>
        {messages.map((m) => <Message key={m.id} messageObj={m} />)}
      </Stack>
    </Box>
  )
}

export default MessageBox;