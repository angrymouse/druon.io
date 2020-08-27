module.exports=(socket,message)=>{
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
}
