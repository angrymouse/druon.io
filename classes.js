class GameObject{
constructor(scene,index){
  this.scene=scene
  this.index=index
  this.id=this.scene.objects[this.index].id
}
get data(){
    return this.scene.objects[this.index]
}
destroy(){
  this.scene.destroyObject(this.id)
}
update(edit){
  scene.updateObject(this.id,edit)
}
}
exports.Scene = class Scene {
  constructor (io){
    this.objects=[]
    this.io=io
    this.sockets=[]
    this.startPE()
  }
  addObject(type,socket,params){
    let ob={
      type:type.toUpperCase(),
      velocity:{x:0,y:0},
      id:genId("dr"),
      ...params

    }
    this.objects.push(ob)
  this.dispatch("spawn",ob)
    return this.getObject(ob.id)
  }
  getObject(id){
    let oi=this.objects.findIndex(o=>o.id==id)
    if(oi==-1){return null}
    return new GameObject(this,oi)
  }
  get gameObjects(){
    let self=this
    return this.objects.map((o,oi)=>{return new GameObject(self,oi)})
  }
  destroyObject(id){
    let oi=this.objects.findIndex(o=>o.id==id)
    if(oi==-1){return false}
    this.dispatch("destroy",id)
    this.objects.splice(oi,1)
    return true
  }
  updateObject(id,edit){
    let oi=this.objects.findIndex(o=>o.id==id)
    if(oi==-1){return false}
    this.objects[oi]={...this.objects[oi],...edit}

    return new GameObject(this,oi)
  }
  dispatch(ue,...arg){
    this.sockets.forEach(async socket=>socket.emit(ue,...arg))
  }
  dispatchOne(id,ue,...arg){
    let socket=this.sockets.find(s=>s.id==id);
    if(!socket){return}
    socket.emit(ue,...arg)
  }
  startPE(){
    let self=this
    setInterval(async ()=>{
      await physicsTick(self)
    
      self.dispatch("upgrades",self.objects)
    },1000/30)
  }
}
function genId(prefix) {
  if (!prefix) {
    prefix = "unk"
  }
  return prefix + Date.now().toString(16) + (Math.random() * 100000).toString(16)
}
async function physicsTick(scene){
console.log(scene.gameObjects);
}
