module.exports=(socket,time) => {
 socket.emit("pongx", Date.now() - time)
}
