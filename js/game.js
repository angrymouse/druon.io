module.exports=async () => {

  let io

  if(process.env.KINTO){
     io = require("socket.io")(http)
  }else{
     io = require("socket.io")(https)
  }

  let {
    Scene,
    GameObject
  } = require("./classes.js")


  global.scene = new Scene(io, bases)

  io.of("/game").on("connection", async (socket) => {
    socket.on("spawn", async (nickname) => {
      if (!nickname||nickname.trim() == "") {
        nickname = "druon.io"
      }
      socket.sprite = scene.addPlayer("tank", socket, {
        nickname: nickname
      })
      socket.god=false
      setEvents(socket)
    })
  })
}
