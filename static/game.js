console.log('go ahead')
let nickname=localStorage.getItem("nickname")
if(nickname)
  document.getElementById('nickname').value=nickname
let objects=[],me,
keys = [
{k: "A", t: "x", m: -1},
{k: "D", t: "x", m: 1},
{k: "W", t: "y", m: -1},
{k: "S", t: "y", m: 1}
]
window.messages=[]
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

    socket.emit("move", "r",angle)
})
socket.on("upgrade",(id,upgrade)=>{
  let sprite=objects.find(o=>o.data.id==id).sprite
  Object.keys(upgrade).forEach(up=>{
    sprite[up]=upgrade[up]
  })
  if(upgrade.position){
    sprite.nickname.position.x=sprite.position.x;
    sprite.nickname.position.y=sprite.position.y+50;
  }
})
socket.on("chat-message",(id,message)=>{
  let style = new PIXI.TextStyle({

   fill: "black",
   fontFamily: "Oxygen-Regular",
   fontSize: 18
});
let text = new PIXI.Text(message, style);
text.anchor.set(0.5,0.5)
let author=objects.find(obj=>obj.data.id==id).sprite
text.position.x=author.position.x;
text.position.y=author.position.y-50;
text.author=id
app.stage.addChild(text)
messages.push(text)
setTimeout(()=>{
  messages.splice(messages.findIndex(m=>m.author==id))

  app.stage.removeChild(text)
},5000)
})
socket.on("leaders",(leaders)=>document.getElementById("leaderboard").innerHTML="<h1>Leaderboard</h1>"+leaders)
let chatting=false
window.onkeydown=async(ev)=>{
  if(chatting)
return handleChatting(ev)
let k = keys.find(i=>ev.code.endsWith(i.k))
if(k)
socket.emit("move", k.t, k.m)
else
if(ev.code=="Enter"){
    let chat=document.getElementById("chat")
    chat.style.display="block"
    chat.focus()
    chatting=true
}
}
async function handleChatting(ev){
  if(ev.code=="Enter"){
      let chat=document.getElementById("chat")
    let message=chat.value;
    chat.value=""
    chat.style.display="none"
chatting=false
    if(message.trim()==""){return}
    socket.emit("chat-message",message)
  }
}
window.onkeyup=async (ev)=>{
let k = keys.find(i=>ev.code.endsWith(i.k))
if(k)
socket.emit("move", k.t, 0)
}

app.ticker.add(async ()=>{
  messages.forEach(async message=>{
    let author=objects.find(o=>o.data.id==message.author).sprite
    console.log(author);
    message.position.x=author.position.x;
    message.position.y=author.position.y-50;
  })
  if(!me){return}

  app.stage.pivot.set(me.position.x-(app.screen.width/2),me.position.y-(app.screen.height/2))
})
setInterval(()=>{
    if(!me){return}
    document.getElementById("cords").innerHTML="X - "+me.position.x+" | Y - "+me.position.y
},3000)
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
    let style = new PIXI.TextStyle({

     fill: "blue",
     fontFamily: "Oxygen-Regular",
     fontSize: 16
    });
    let text = new PIXI.Text(obj.nickname, style);
    text.anchor.set(0.5,0.5)
    app.stage.addChild(sprite)
    text.position.x=sprite.position.x;
    text.position.y=sprite.position.y+50;
    sprite.nickname=text
    app.stage.addChild(text)
    if(obj.me){
      me=sprite
      app.stage.pivot.set(obj.x-(app.screen.width/2),obj.y-(app.screen.height/2))
      document.getElementById("cords").innerHTML="X - "+sprite.position.x+" | Y - "+sprite.position.y
    }
      break;
    default:

  }
}
