const joinUserId = (socket) => {
  socket.join(socket.user.id);
}

export default joinUserId;