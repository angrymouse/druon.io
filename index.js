(async () => {
  let express = require("express"),
  app = express(),
  http = require('http').createServer(app),
  io = require("socket.io")(http)
  app.use(express.static(__dirname + "/static"))
  http.listen(3000, () =>
    console.log('Ready'))
  global.objects = global.players = []
  io.of("/game").on("connection", async (socket) => {
    socket.once("spawn", async (nickname) => {
      if (nickname.trim() == "")
        nickname = "druon.io"
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
      players.forEach(connection =>
        connection.emit("spawn", player)
      )
      objects.push(player)
      players.push(socket)

      socket.emit("spawn", {...player,me:true})
      objects.filter(o => o.id !== player.id).forEach(o =>
        socket.emit("spawn", o)
      )
      setInterval(() => {
        players.forEach(p => {
          p.emit("leaders", (() => {
            return objects.sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join("")
          })())
        })
      }, 1000)
      socket.on("move", (i, m) => {
        let obj = objects.find(o => o.id == player.id)
        switch(i) {
          case 'r':
            obj.rotation = m
            player.rotation = m
            players.forEach(c => c.emit("upgrade", player.id,
              {rotation: m}))
          break
          case 'x':
            obj.velocity.x = (m==0?0:m>0?obj.speed:-obj.speed)
          break
          case 'y':
            obj.velocity.y = (m==0?0:m>0?obj.speed:-obj.speed)
          break
        }
      })
      socket.on("chat-message", msg =>
        players.forEach(con=>con.emit("chat-message",player.id,msg))
      )
      socket.on("disconnect",()=>{
          let objIndex = objects.findIndex(o => o.id == player.id)
          objects.splice(objIndex,1)
          players.forEach(pl =>
            pl.emit("base-killed",player.id)
          )

      })
    })
  })
})()
setInterval(async ()=>{
//console.log(objects, players)
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
Math.rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

function genId(prefix) {
  if (!prefix)
    prefix = "unk"
  return prefix + Date.now().toString(16) + (Math.random() * 100000).toString(16)
}
