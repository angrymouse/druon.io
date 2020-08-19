global.bases = require("./bases.json")
global.bullets = require("./bullets.json")
global.fps = 30;
(async () => {
  let express = require("express")
  let app = express()
  let http = require('http').createServer(app);
  let io = require("socket.io")(http)
  let {
    Scene,
    GameObject
  } = require("./classes.js")

  app.use(express.static(__dirname + "/static"))
  http.listen(3000, () => {

  });
  global.scene = new Scene(io, bases)
  global.objects = []
  global.players = []
  io.of("/game").on("connection", async (socket) => {
    socket.once("spawn", async (nickname) => {
      if (nickname.trim() == "") {
        nickname = "druon.io"
      }
      socket.sprite = scene.addPlayer("tank", socket, {
        nickname: nickname
      })





      socket.on("rotate", async (angle) => {
        socket.sprite.update({
          rotation: Number(angle)
        })
      })
      socket.on("shoting", v => {

  socket.sprite.set("shoting",Boolean(v))

      })
      socket.on("move", (c,move) => {
        if(!["x","y"].includes(c)){return}
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
          socket.sprite.update({
            velocity: {
              ...socket.sprite.data.velocity,
            [c]:-socket.sprite.data.speed
            }
          })
        }
      })

      socket.on("pingx", (time) => {
        socket.emit("pongx", Date.now() - time)
      })
      socket.on("disconnect", () => {
      socket.sprite.destroy()

      })
    })
  })
})()

setInterval(() => {

  scene.dispatch("leaders", scene.objects.filter(o => o.type == "PLAYER").sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join(""))


}, 1000)
Math.rand = function(min, max) {

  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

global.genId=function genId(prefix) {
  if (!prefix) {
    prefix = "unk"
  }
  return prefix + Date.now().toString(16) + (Math.random() * 100000).toString(16)
}
global.calcV=(angle,speed,rev)=>{
  return {
    x:rev?Math.cos(angle)*speed:-Math.cos(angle)*speed,
    y:rev?Math.sin(angle)*speed:-Math.sin(angle)*speed,
  }
}
