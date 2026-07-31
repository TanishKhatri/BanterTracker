import Send from '@mui/icons-material/Send'
import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';

const SendMessage = ({ handleMessageSending }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    await handleMessageSending(message);
    setMessage('');
  }
  return (
    <Box component='form' sx={{ 
        display: 'flex',
        backgroundColor: 'lightblue',
        width: '100%',
        p: 2,
      }}
      onSubmit={sendMessage}
    >
      <TextField 
        variant="standard"
        placeholder='Send your message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        multiline
        maxRows={3}
        fullWidth
      />
      <IconButton type='submit'>
        <Send />
      </IconButton>
    </Box>
  )
}

export default SendMessage;