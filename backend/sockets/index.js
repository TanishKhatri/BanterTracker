import joinUserId from "./joinUserId.js";
import registerChatSocket from "./chat.js";
const registerSockets = (io) => {
  io.on('connection', (socket) => {
    joinUserId(io, socket)
    registerChatSocket(io, socket);
  });
}

export default registerSockets;