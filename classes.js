let {handleCollisions}=require("./physics.js")
class GameObject {
  constructor(scene, id) {
    this.scene = scene

    this.id = id
  }
  get data() {
    return this.scene.objects.get(this.id)
  }
  set data(edit){
    return this.scene.objects.set(this.id,edit)
  }
  destroy() {
    this.scene.destroyObject(this.id)
  }
  update(edit) {
    scene.updateObject(this.id, edit)
  }
  set(c, t) {
    this.update({
      [c]: t
    })
  }
  plusProp(c, np) {
    this.update({
      [c]: this.data[c] + np
    })
  }
  get socket() {
    return this.scene.sockets.find(c => c.id == this.id) || null
  }
}
exports.Scene = class Scene {
  constructor(io, bases) {
    this.objects = new Map()
    this.io = io
    this.bases = bases
    this.sockets = []
    this.startPE()
  }
  addObject(type, params) {
    let ob = {
      type: type.toUpperCase(),
      velocity: {
        x: 0,
        y: 0
      },
      rotation: 0,
      id: genId("dr"),
      rp: 0,
      x: Math.rand(10, 9990),
      y: Math.rand(10, 9990),
      hitbox:"circle",
      ...params

    }
    this.objects.set(ob.id,ob)


    return this.getObject(ob.id)
  }
  addPlayer(base, socket, other) {
    let id = genId("player")
    let baseObj = bases[base]
    socket.id = id
    socket.emit("id", id)
    this.sockets.push(socket)
    return this.addObject("PLAYER", {
      id: id,
      base: base,
      lastShot: 0,
      shotting: false,
      xp: 1,
      hitbox:"circle",
      size: 100,
      rotation: 0,
      nickname: other.nickname || "druon.io",
      ...baseObj
    })


  }
  getObject(id) {
    return new GameObject(this, id)
  }
  get gameObjects() {
    let self = this
    let objs= [...this.objects.values()]
    return objs.map((o) => {
      return new GameObject(self, o.id)
    })
  }
  destroyObject(id) {

    this.objects.delete(id)
    return true
  }
  updateObject(id, edit) {

    this.objects.set(id,{
      ...this.objects.get(id),
      ...edit
    })

    return new GameObject(this, id)
  }
  dispatch(ue, ...arg) {


    this.sockets.forEach(async socket => socket.emit(ue, ...arg))
  }
  dispatchExclude(exclude, ue, ...arg) {
    this.sockets.filter(s => s.id !== exclude).forEach(async socket => socket.emit(ue, ...arg))
  }
  dispatchOne(id, ue, ...arg) {
    let socket = this.sockets.find(s => s.id == id);
    if (!socket) {
      return
    }
    socket.emit(ue, ...arg)
  }
  startPE() {
    let self = this
    setInterval(async () => {
      await physicsTick(self)

      self.dispatch("upgrades", [...self.objects.values()])
    }, 1000 / 30)
    setInterval(() => {
      self.dispatch("leaders",  [...self.objects.values()].filter(o => o.type == "PLAYER").sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join(""))


    }, 1000)
  }
}


async function physicsTick(scene) {
  scene.gameObjects.forEach(async (obj, i) => {
    let canMove=await handleCollisions(obj)

      if(!obj||!obj.data){return}
    let uV = calcV(obj.data.rotation, obj.data.rp, true)
    obj.plusProp("x", obj.data.velocity.x + Math.round(uV.x))
    obj.plusProp("y", obj.data.velocity.y + Math.round(uV.y))

    let exp = require("./psy_tests.js")(obj)
    exp.forEach((ev, i) => {
      if (ev.e) {
        ev.a()
      }
    });

  });

}
