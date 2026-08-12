// Joins the user to the socket room of their userId
// - for messaging, marking read, typing etc.
const joinUserId = (socket) => {
  socket.join(socket.user.id);
}

export default joinUserId;