let nickname=localStorage.getItem("nickname")
if(nickname){
  document.getElementById('nickname').value=nickname
}
let objects=[]
let me;
document.getElementById('nickname').oninput=function(){
  nickname=document.getElementById('nickname').value
  localStorage.setItem("nickname",document.getElementById('nickname').value)
}
async function startGame(){
  window.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
  document.getElementById("welcome").style.display="none"
  document.getElementById("interface").style.display="inline-block"
  app.view.id="game"
  app.renderer.backgroundColor = 0x575757
  document.body.appendChild(app.view);
  PIXI.Loader.shared
  .add([
    "/assets/druon-grid.png",
    "/assets/bases/tank.svg"
  ])
  .load(play);
}
async function play() {
  const tilingSprite = new PIXI.TilingSprite(
      PIXI.Loader.shared.resources["/assets/druon-grid.png"].texture,
      10000,
      10000,
  );
  app.stage.addChild(tilingSprite);
  app.stage.pivot.set(5000,5000)
let socket=io("/game")
socket.emit("spawn",nickname)
socket.on("spawn",handleSpawn)
app.stage.interactive=true
app.stage.on("mousemove",(event)=>{
  var dist_Y = app.screen.height/2 - event.data.global.y;
    var dist_X = app.screen.width/2 - event.data.global.x;
    var angle = Math.atan2(dist_Y,dist_X);
    socket.emit("rotate",angle)
})
socket.on("upgrade",(id,upgrade)=>{
  let sprite=objects.find(o=>o.data.id==id).sprite
  Object.keys(upgrade).forEach(up=>{
    sprite[up]=upgrade[up]
  })
})
socket.on("leaders",(leaders)=>{document.getElementById("leaderboard").innerHTML="<h1>Leaderboard</h1>"+leaders})
window.onkeydown=async(ev)=>{
if(ev.code=="KeyA"){
  socket.emit("move-x",-1)
}else if(ev.code=="KeyD"){
    socket.emit("move-x",1)
}
else if(ev.code=="KeyW"){
    socket.emit("move-y",-1)
}else if(ev.code=="KeyS"){
    socket.emit("move-y",1)
}
}
window.onkeyup=async (ev)=>{
  if(ev.code=="KeyA"||ev.code=="KeyD"){
    socket.emit("move-x",0)
  }
  else if(ev.code=="KeyW"||ev.code=="KeyS"){
      socket.emit("move-y",0)
  }
}

app.ticker.add(async ()=>{
  app.stage.pivot.set(me.position.x-(app.screen.width/2),me.position.y-(app.screen.height/2))
})
setInterval(()=>{
    document.getElementById("cords").innerHTML="X - "+me.position.x+" | Y - "+me.position.y
},1000)
}

async function handleSpawn(obj){
  switch (obj.type) {
    case "PLAYER":
    let texture=PIXI.Loader.shared.resources["/assets/bases/"+obj.base+".svg"].texture
    let sprite=new PIXI.Sprite(texture)
    sprite.width=sprite.height=100
    sprite.rotation=obj.rotation
    sprite.anchor.set(0.5,0.5)
    sprite.position.set(obj.x,obj.y)
    app.stage.addChild(sprite)
    objects.push({data:obj,sprite:sprite})
    me=sprite
    if(obj.me){
      app.stage.pivot.set(obj.x-(app.screen.width/2),obj.y-(app.screen.height/2))
      document.getElementById("cords").innerHTML="X - "+sprite.position.x+" | Y - "+sprite.position.y
    }
      break;
    default:

  }
}
