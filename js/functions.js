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

global.calcV=(angle,speed,rev)=>{
  return {
    x:rev?Math.cos(angle)*speed:-Math.cos(angle)*speed,
    y:rev?Math.sin(angle)*speed:-Math.sin(angle)*speed,
  }
}
global.formUrlencode=function formUrlencode(obj) {
  return Object.keys(obj).map(key=>`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&")
}
global.calcAngle=(pos1,pos2)=>{
  let dist_Y = pos1.y-pos2.y;
  let dist_X = pos1.x-pos2.x;
  let angle = Math.atan2(dist_Y, dist_X);
  return angle
}
let events=fs.readdirSync(__dirname+"/events").map(f=>{

  let en=f.split(".")
  en.pop()
  en=en.join(".")
  return [en,require("./events/"+f)]
})

global.setEvents=(socket)=>{
events.forEach(e=>{
  socket.on(e[0],(...params)=>{e[1](socket,...params)})
})
}
