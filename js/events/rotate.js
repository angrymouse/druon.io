module.exports=async (socket,angle) => {
  socket.sprite.update({
    rotation: Number(angle)
  })
}
