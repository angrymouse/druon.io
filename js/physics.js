let hitFuntions={
  circleCircle:(fo,so)=>{
    let dX=fo.data.x-so.data.x
    let dY=fo.data.y-so.data.y
    let dist= Math.sqrt(dX * dX + dY * dY)
    return dist<(fo.data.size/4+so.data.size/4)
  }
}
let hitTests={
"circle":{
  "circle":hitFuntions.circleCircle
}
}

let handleByType={
"BULLET":async (bullet,collider)=>{

  switch (collider.data.type) {
    case "PLAYER":
      let angle=calcAngle({x:bullet.data.x,y:bullet.data.y},{x:collider.data.x,y:collider.data.y})
      let move=calcV(angle,(bullet.data.speed+collider.data.speed)/2)

      collider.data.energies.set(genId("br"),{...move,expireAt:Date.now()+(1000/fps)})

      collider.plusProp("hp",-bullet.data.damage)
      collider.data.lastDamaged=bullet.data.from
      break;
  }
    bullet.destroy()
},
"PLAYER":async(player,collider)=>{

  switch (collider.data.type) {
    case "PLAYER":
      let angle=calcAngle({x:player.data.x,y:player.data.y},{x:collider.data.x,y:collider.data.y})
      let move=calcV(angle,(player.data.speed+collider.data.speed)/4,true)
      player.plusProp("x",Math.round(move.x/4))
      player.plusProp("y",Math.round(move.y/4))
      collider.plusProp("x",Math.round(-move.x))
      collider.plusProp("y",Math.round(-move.y))

      break;
    default:
return
  }
}
}
exports.handleCollisions=async (obj)=>{
    if(!obj.data){return}

let collides=obj.scene.gameObjects.filter(go=>{
  if(go.id==obj.id||!go.data){return false}
  return  hitTests[go.data.hitbox][obj.data.hitbox](go,obj)
})
for (var collider of collides) {
if(!collider.data){return}
  await  handleByType[obj.data.type](obj,collider)
}
  if(!obj.data){return}
if(obj.data.type=="PLAYER"){

  if(obj.data.effects.includes("heal")&&obj.data.hp<obj.data.maxHp){

     obj.data.hp=parseFloat(Number(obj.data.hp+0.01).toFixed(2))

  }
  if(obj.data.hp<0){
    let killer=obj.scene.getObject(obj.data.lastDamaged)

    if(killer.data){  killer.data.xp+=obj.data.xp}
    obj.socket.disconnect(true)
    obj.destroy()


  }
}


return true
}
