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
  bullet.destroy()
},
"PLAYER":async(player,collider)=>{

  switch (collider.data.type) {
    case "PLAYER":
      let angle=calcAngle({x:player.data.x,y:player.data.y},{x:collider.data.x,y:collider.data.y})
      let move=calcV(angle,(player.data.speed+collider.data.speed)/2,true)
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
let collides=obj.scene.gameObjects.filter(go=>{
  if(go.id==obj.id){return false}
  return  hitTests[go.data.hitbox][obj.data.hitbox](go,obj)
})
for (var collider of collides) {
  await  handleByType[obj.data.type](obj,collider)
}



return true
}
