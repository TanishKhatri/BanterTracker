import joinUserId from "./joinUserId.js";
import registerChatSocket from "./chat.js";
import registerMarkReadSocket from "./markRead.js";
const registerSockets = (io) => {
  io.on('connection', (socket) => {
    joinUserId(socket)
    registerChatSocket(io, socket);
    registerMarkReadSocket(io, socket)
  });
}

export default registerSockets;