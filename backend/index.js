import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: '/api/socket.io',
});

app.get('/api', (request, response) => {
  response.send('<h1>Hello, World</h1>');
});

io.on('connection', (socket) => {
  console.log(`a user has connected: ${socket.id}`);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log('app running on port 3003');
});
