module.exports=(socket,c,move) => {
  if(!["x","y"].includes(c)||!socket.sprite||!socket.sprite.data){return}
  if (move == 0) {

    socket.sprite.update({
      velocity: {
        ...socket.sprite.data.velocity,
      [c]:0
      }
    })
  } else if (move > 0) {
    socket.sprite.update({
      velocity: {
        ...socket.sprite.data.velocity,
      [c]:socket.sprite.data.speed
      }
    })
  } else {
    if(!socket.sprite||!socket.sprite.data||!socket.sprite.data.velocity){return}
    socket.sprite.update({
      velocity: {
        ...socket.sprite.data.velocity,
      [c]:-socket.sprite.data.speed
      }
    })
  }
}
