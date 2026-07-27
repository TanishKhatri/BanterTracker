import Conversation from './Conversation';
import { Box, Typography, AppBar, Toolbar, TextField, Stack } from '@mui/material';

const ConversationList = ({ conversations }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chats
          </Typography>

          <TextField
            placeholder='search'
            variant="outlined"
            size="small"
            sx={{
              ml: 2, // gap between "Chats" and the search field
              bgcolor: "white",
              borderRadius: 1,

              "& .MuiOutlinedInput-root": {
                color: "black", // input text
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },

              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black",
              },
            }}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        {!conversations && <Typography variant="h6" component="div">Oops no Chats here</Typography>}
        {conversations && (
          <Stack spacing={1}>
            {conversations.map(convo => <Conversation key={convo.id} convoObj={convo} />)}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ConversationList;
