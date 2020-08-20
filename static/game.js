let nickname = localStorage.getItem("nickname")
let time=Date.now()
if (nickname) {
  document.getElementById('nickname').value = nickname
}
let oldState=[]
let newState=[]
let sprites=new Map()
let destroing=[]
let currentOffset={
  x:0,
  y:0
}
let offsettingTo={
  x:0,
  y:0
}
let me;
window.messages = []
document.getElementById('nickname').oninput = function() {
  nickname = document.getElementById('nickname').value
  localStorage.setItem("nickname", document.getElementById('nickname').value)
}
async function startGame() {
  window.app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
  });
  document.getElementById("welcome").style.display = "none"
  document.getElementById("interface").style.display = "inline-block"
  app.view.id = "game"
  app.renderer.backgroundColor = 0x575757
  document.body.appendChild(app.view);
  PIXI.Loader.shared
    .add([
      "/assets/druon-grid.png",
      "/assets/skins/tank.svg",
      "/assets/skins/bullet-fire.svg"
    ])
    .load(play);
}
async function play() {
  const background = new PIXI.TilingSprite(
    PIXI.Loader.shared.resources["/assets/druon-grid.png"].texture,
    10000,
    10000,
  );
  app.stage.addChild(background);

  let socket = io("/game")
  socket.emit("spawn", nickname)

socket.on("id",(id)=>{window.id=id})
  app.stage.interactive = true
  socket.emit("pingx",Date.now())
setInterval(()=>{
time=Date.now()
  socket.emit("pingx",Date.now())
},1000)
socket.on("pongx",(ping)=>{document.getElementById("ping").innerHTML=Date.now()-time+"ms"})
  app.stage.on("mousemove", (event) => {
    var dist_Y = (app.screen.height / 2)+currentOffset.y - event.data.global.y;
    var dist_X = (app.screen.width / 2)+currentOffset.x - event.data.global.x;
    var angle = Math.atan2(dist_Y, dist_X);

    socket.emit("rotate", angle)
  })

  app.stage.on("pointerdown", (event) => {
    socket.emit("shoting", true)
  })
  app.stage.on("pointerup", (event) => {
    socket.emit("shoting", false)
  })
  socket.on("upgrades", (objects) => {
    newState=objects
  })

  socket.on("chat-message", (id, message) => {
    let style = new PIXI.TextStyle({

      fill: "black",
      fontFamily: "Oxygen-Regular",
      fontSize: 18
    });
    let text = new PIXI.Text(message, style);
    text.anchor.set(0.5, 0.5)
    let author = objects.find(obj => obj.data.id == id).sprite
    text.position.x = author.position.x;
    text.position.y = author.position.y - 50;
    text.author = id
    app.stage.addChild(text)
    messages.push(text)
    setTimeout(() => {
      messages.splice(messages.findIndex(m => m.author == id))

      app.stage.removeChild(text)
    }, 5000)
  })
  socket.on("leaders", (leaders) => {
    document.getElementById("leaderboard").innerHTML = "<h1>Leaderboard</h1>" + leaders
  })
  let chatting = false
  window.onkeydown = async (ev) => {
    if (chatting) {
      return handleChatting(ev)
    }
    if (ev.code == "KeyA") {
      socket.emit("move","x", -1)
    } else if (ev.code == "KeyD") {
      socket.emit("move","x", 1)
    } else if (ev.code == "KeyW") {
      socket.emit("move","y", -1)
    } else if (ev.code == "KeyS") {
      socket.emit("move","y", 1)
    } else if (ev.code == "Enter") {
      let chat = document.getElementById("chat")
      chat.style.display = "block"
      chat.focus()
      chatting = true
    }
  }
  async function handleChatting(ev) {
    if (ev.code == "Enter") {
      let chat = document.getElementById("chat")
      let message = chat.value;
      chat.value = ""
      chat.style.display = "none"
      chatting = false
      if (message.trim() == "") {
        return
      }
      socket.emit("chat-message", message)
    }
  }
  window.onkeyup = async (ev) => {
    if (ev.code == "KeyA" || ev.code == "KeyD") {
      socket.emit("move","x", 0)
    } else if (ev.code == "KeyW" || ev.code == "KeyS") {
      socket.emit("move","y", 0)
    }
  }

  app.ticker.add(async (delta) => {
    for(let obj of newState){
      let sprite=sprites.get(obj.id)

      if(!sprite){

        sprite=new PIXI.Sprite(PIXI.Loader.shared.resources["/assets/skins/"+obj.skin].texture)

        sprite.id=obj.id
        sprite.anchor.set(0.5,0.5)
        sprites.set(obj.id,sprite)
        app.stage.addChild(sprite)
        sprite.width=obj.width?obj.width:obj.size
        sprite.height=obj.height?obj.height:obj.size
      }
      sprite.position.set(obj.x,obj.y)
sprite.rotation=obj.rotation
      sprite.width=obj.width?obj.width:obj.size
      sprite.height=obj.height?obj.height:obj.size
      if(obj.id==id){
        me=sprite
        offsettingTo=obj.velocity
        app.stage.pivot.set(currentOffset.x+me.position.x - (app.screen.width / 2), currentOffset.y+me.position.y - (app.screen.height / 2))
      }
    }
    for (var prop in offsettingTo) {
    if(!currentOffset[prop]){currentOffset[prop]=0}

    if(offsettingTo[prop]>0){
    if(currentOffset[prop]<offsettingTo[prop]){currentOffset[prop]+=offsettingTo[prop]/10}
    if(currentOffset[prop]>offsettingTo[prop]){currentOffset[prop]-=offsettingTo[prop]/10}
  }else   if(offsettingTo[prop]<0){
    if(currentOffset[prop]>offsettingTo[prop]){currentOffset[prop]+=offsettingTo[prop]/10}
    if(currentOffset[prop]<offsettingTo[prop]){currentOffset[prop]-=offsettingTo[prop]/10}
  } else if(currentOffset[prop].toFixed(1)!==0){
    let minuser=Math.abs(currentOffset[prop])/10>0.1?Math.abs(currentOffset[prop])/10:0.1
    currentOffset[prop]+=currentOffset[prop]<0?minuser:-minuser
  }else {
    currentOffset[prop]=0
  }
    }
    let sa=[...sprites.values()]
let toDestroy=sa.filter(s=>{return !newState.find(o=>o.id==s.id)})

toDestroy.forEach((sprite, i) => {
destroing.push(sprite)

  setTimeout(()=>{
    let index=destroing.findIndex(s=>s.id==sprite.id)

    destroing.splice(index,1)
      sprites.delete(sprite.id)
      app.stage.removeChild(sprite)

  },500)

});
destroing.forEach(sp=>{
  if(!sp){return}
  sp.alpha-=0.03*delta
  sp.scale.x+=0.01*delta
  sp.scale.y+=0.01*delta
})

  })
  setInterval(() => {
    if (!me) {
      return
    }
    document.getElementById("cords").innerHTML = "X - " + me.position.x + " | Y - " + me.position.y
  }, 3000)
}
window.onresize=()=>{
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
