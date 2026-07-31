const joinUserId = (io, socket) => {
  socket.join(socket.user.id);
}

export default joinUserId;