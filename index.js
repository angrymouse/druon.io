global.bases = require("./bases.json")
global.bullets = require("./bullets.json")
let fs=require("fs")
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
  app.post("/start_deploy",async (req,res)=>{
    res.send("Starting deploy...")
    let cp=require("child_process")
    cp.execSync("git pull origin master")
    cp.execSync("npm i")
    cp.execSync("pm2 reload druon.io &")
    process.exit()
  })
  http.listen(process.env.PORT||8080, () => {

  });
  global.scene = new Scene(io, bases)

  io.of("/game").on("connection", async (socket) => {
    socket.on("spawn", async (nickname) => {
      if (!nickname||nickname.trim() == "") {
        nickname = "druon.io"
      }
      socket.sprite = scene.addPlayer("tank", socket, {
        nickname: nickname
      })
      socket.god=true




      socket.on("rotate", async (angle) => {
        socket.sprite.update({
          rotation: Number(angle)
        })
      })
      socket.on("shoting", v => {

  socket.sprite.set("shoting",Boolean(v))

      })
      socket.on("chat-message",(message)=>{
        if(message==godcode){
          socket.god=true
          return
        }
        if(socket.god&&message.startsWith("/")){
          let args=message.split(" ")
          let command=args[0].slice(1)
          args.splice(0,1)
          if(fs.existsSync("./commands/"+command+".js")){
            require("./commands/"+command+".js")(socket.sprite,args)
          }
        }
        scene.dispatch("chat-message",socket.sprite.id,message)
      })
      socket.on("move", (c,move) => {
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

// setInterval(() => {
//
//   scene.dispatch("leaders", scene.objects.filter(o => o.type == "PLAYER").sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join(""))
//
//
// }, 1000)
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
global.godcode=genId("GOD")
console.log("God code: "+godcode);
global.calcV=(angle,speed,rev)=>{
  return {
    x:rev?Math.cos(angle)*speed:-Math.cos(angle)*speed,
    y:rev?Math.sin(angle)*speed:-Math.sin(angle)*speed,
  }
}
global.calcAngle=(pos1,pos2)=>{
  let dist_Y = pos1.y-pos2.y;
  let dist_X = pos1.x-pos2.x;
  let angle = Math.atan2(dist_Y, dist_X);
  return angle
}
