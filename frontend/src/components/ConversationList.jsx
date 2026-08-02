import Conversation from './Conversation';
import { Drawer, Box, Typography, AppBar, Toolbar, TextField, Stack } from '@mui/material';

const ConversationList = ({ conversations, drawerWidth, selectedConversationId, setSelectedConversationId }) => {
  return (
    <Drawer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chats
          </Typography>

          <TextField
            placeholder="search"
            variant="outlined"
            size="small"
            sx={{
              ml: 2, // gap between "Chats" and the search field
              bgcolor: 'white',
              borderRadius: 1,

              '& .MuiOutlinedInput-root': {
                color: 'black', // input text
                '& fieldset': {
                  borderColor: 'black',
                },
                '&:hover fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
              },

              '& .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!conversations && (
          <Typography variant="h6" component="div">
            Oops no Chats here
          </Typography>
        )}
        {conversations && (
          <Stack spacing={1}>
            {conversations.map((convo) => (
              <Conversation
                key={convo.id}
                convoObj={convo}
                selectedConversationId={selectedConversationId}
                setSelectedConversationId={setSelectedConversationId}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

export default ConversationList;
