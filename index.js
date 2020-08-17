(async () => {
  let express = require("express")
  let app = express()
  let http = require('http').createServer(app);
  let io = require("socket.io")(http)
  app.use(express.static(__dirname + "/static"))
  http.listen(3000, () => {

  });
  global.objects = []
  global.players = []
  io.of("/game").on("connection", async (socket) => {
    socket.once("spawn", async (nickname) => {
      if (nickname.trim() == "") {
        nickname = "druon.io"
      }
      let player = {
        type: "PLAYER",
        base: "tank",
        xp: 1,
        velocity:{x:0,y:0},
        speed:10,
        hp: 30,
        rotation: 0,
        nickname: nickname,
        id: genId("player"),
        x: Math.rand(10, 9990),
        y: Math.rand(10, 9990),
        me: false
      }
      socket.id = player.id
      players.forEach(connection => {
        connection.emit("spawn", player)
      })
      objects.push(player)
      players.push(socket)

      socket.emit("spawn", {...player,me:true})
      objects.filter(o => o.id !== player.id).forEach(o => {
        socket.emit("spawn", o)
      })
      setInterval(() => {
        players.forEach(p => {
          p.emit("leaders", (() => {
            return objects.sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join("")
          })())
        })
      }, 1000)
      socket.on("rotate", async (angle) => {

        let objIndex = objects.findIndex(o => o.id == player.id)
        objects[objIndex].rotation = angle
        // console.log(  objects[objIndex],objIndex);
        player.rotation = angle
        players.forEach(connection => {
          connection.emit("upgrade", player.id, {
            rotation: angle
          })
        })
      })
      socket.on("move-x",(move)=>{
          let objIndex = objects.findIndex(o => o.id == player.id)
        if(move==0){
            objects[objIndex].velocity.x=0
        }else if(move>0){
            objects[objIndex].velocity.x=  objects[objIndex].speed
        }else{
          objects[objIndex].velocity.x= -objects[objIndex].speed
        }
      })
      socket.on("move-y",(move)=>{
          let objIndex = objects.findIndex(o => o.id == player.id)
        if(move==0){
            objects[objIndex].velocity.y=0
        }else if(move>0){
            objects[objIndex].velocity.y=  objects[objIndex].speed
        }else{
          objects[objIndex].velocity.y= -objects[objIndex].speed
        }
      })
      socket.on("chat-message",(message)=>{
        players.forEach(connection=>{connection.emit("chat-message",player.id,message)})
      })
      socket.on("disconnect",()=>{
          let objIndex = objects.findIndex(o => o.id == player.id)
          objects.splice(objIndex,1)
          players.forEach((pl) => {
            pl.emit("base-killed",player.id)
          });

      })
    })
  })
})()
setInterval(async ()=>{
let needUpdate=  objects.filter(o=>(o.velocity.y!==0||o.velocity.x!==0))

needUpdate.forEach((ob,obi)=>{

  let rid=objects.findIndex(o=>o.id==ob.id)

  if(rid==-1){return}
    objects[rid].x+=ob.velocity.x
    objects[rid].y+=ob.velocity.y
    if(objects[rid].x<10){objects[rid].x=9990}
    else if(objects[rid].x>9990){objects[rid].x=10}
    if(objects[rid].y<10){objects[rid].y=9990}
    else if(objects[rid].y>9990){objects[rid].y=10}
    players.forEach(async player=>{
      player.emit("upgrade",ob.id,{position:{x:objects[rid].x,y:objects[rid].y}})
    })
  })
},1000/40)
Math.rand = function(min, max) {

  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function genId(prefix) {
  if (!prefix) {
    prefix = "unk"
  }
  return prefix + Date.now().toString(16) + (Math.random() * 100000).toString(16)
}
