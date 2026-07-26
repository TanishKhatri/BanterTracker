import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Conversation from './Conversation';
import services from '../services/services';

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
    <div>
      <div>Hello world</div>
      {conversations && (
        <ul>
          {conversations.map((convo) => (
            <Conversation
              key={convo.id}
              convoObj={convo}
            />
          ))}
        </ul>
      )}
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default MainAppPage;
