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
}
}
exports.handleCollisions=async (obj)=>{
let collides=obj.scene.gameObjects.filter(go=>{
  if(go.id==obj.id){return false}
  return hitTests[go.data.hitbox][obj.data.hitbox](go,obj)
})
if(collides.length>0){
  collides.forEach(async(collider) => {
    handleByType[obj.data.type](obj,collider)
  });

}
return true
}
