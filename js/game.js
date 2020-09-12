module.exports=async () => {

  let io

  if(process.env.KINTO||process.env.HEROKU){
     io = require("socket.io")(http)
  }else{
     io = require("socket.io")(https)
  }

  let {
    Scene,
    GameObject,
    User
  } = require("./classes.js")


  global.scene = new Scene(io, bases)

  io.of("/game").on("connection", async (socket) => {
    socket.on("spawn", async (nickname,token,csi) => {
      if (!nickname||nickname.trim() == "") {
        nickname = "druon.io"
      }
      socket.user=new User(token)
            socket.discordUser=await socket.user.fetchUser()
      if(isNaN(parseInt(csi))||!socket.discordUser){
        csi=0
      }
      let ci=[{skin:"default"}]

      socket.profile=await socket.user.fetchProfile()
      if(socket.profile){
        ci=socket.profile.skins
      }
      let character=ci[csi]
      socket.sprite = scene.addPlayer(character, socket, {
        nickname: nickname
      })

      socket.god=false
      setEvents(socket)
    })
  })
}
