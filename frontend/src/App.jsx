import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io({
  path: '/api/socket.io',
});

const App = () => {
  const [chatLog, setChatLog] = useState([])
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', content);
    setContent('')
  };

  socket.on('connect', () => {
    console.log('Connected!', socket.id);
  });

  socket.on('chat message', (msg) => {
    setChatLog(chatLog.concat(msg))
  });

  return (
    <div>
      <h1>Frontend</h1>
      <ul id="chat">
        {chatLog.map((chat) => <li key={chat}>{chat}</li>)}
      </ul>
      <form id="sendChat" onSubmit={handleSubmit}>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default App;
