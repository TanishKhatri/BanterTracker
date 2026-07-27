import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import ConversationList from './ConversationList';
import services from '../services/services';
import MessageBox from './MessageBox';
import { Box, Drawer, AppBar } from '@mui/material';

const MainAppPage = () => {
  const [conversations, setConversations] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    (async function () {
      try {
        let convos = await services.getConversations();
        setConversations(convos);
        console.log(convos);
      } catch {
        console.log('Couldnt retrieve conversations');
      }
    })();
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      height: '100%',
      width: '100%'
    }}>
      <Drawer variant='permanent' sx={{
        width: 240,
        anchor: 'left'
      }}>
        <ConversationList conversations={conversations} />
      </Drawer>
      <MessageBox />
    </Box>
    // <div>
    //   <div>Hello world</div>
    //   {conversations && (
    //     <ul>
    //       {conversations.map((convo) => (
    //         <Conversation
    //           key={convo.id}
    //           convoObj={convo}
    //         />
    //       ))}
    //     </ul>
    //   )}
    //   <button onClick={logout}>logout</button>
    // </div>
  );
};

export default MainAppPage;
