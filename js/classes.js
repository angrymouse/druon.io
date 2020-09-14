let {
  handleCollisions
} = require("./physics.js")
class GameObject {
  constructor(scene, id) {
    this.scene = scene

    this.id = id
  }
  get data() {
    return this.scene.objects.get(this.id)
  }
  set data(edit) {
    return this.scene.objects.set(this.id, edit)
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
    return this.scene.sockets.get(this.id) || null
  }
}
exports.Scene = class Scene {
  constructor(io, bases) {
    this.objects = new Map()
    this.io = io
    this.bases = bases
    this.sockets = new Map()
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
      x: 200, //Math.rand(10, 9990),
      y: 200, //Math.rand(10, 9990),
      hitbox: "circle",
      lastDamaged: null,
      energies: new Map(),
      ...params

    }
    this.objects.set(ob.id, ob)


    return this.getObject(ob.id)
  }
  addPlayer(cs, socket, other) {
    let id = genId("player")
    let baseObj = bases[cs.character]
    let skinObj= skins[cs.character][cs.skin]
    socket.id = id
    socket.emit("id", id)
    this.sockets.set(id, socket)
    return this.addObject("PLAYER", {
      id: id,
      base: cs.character,
      lastShot: 0,

      shotting: false,
      xp:1,
      hp:baseObj.maxHp,
      hitbox: "circle",
      size: 100,
      rotation: 0,
      nickname: other.nickname || "druon.io",
      ...baseObj,
      ...skinObj,
      skin:"skins/"+cs.character+"/"+skinObj.skin
    })


  }
  getObject(id) {
    return new GameObject(this, id)
  }
  get gameObjects() {
    let self = this
    let objs = [...this.objects.values()]
    return objs.map((o) => {
      return new GameObject(self, o.id)
    })
  }
  destroyObject(id) {

    this.objects.delete(id)
    return true
  }
  updateObject(id, edit) {

    this.objects.set(id, {
      ...this.objects.get(id),
      ...edit
    })

    return new GameObject(this, id)
  }
  dispatch(ue, ...arg) {


    [...this.sockets.values()].forEach(async socket => socket.emit(ue, ...arg))
  }

  startPE() {
    let self = this
    setInterval(async () => {
      await physicsTick(self)

      self.dispatch("upgrades", [...self.objects.values()])
    }, 1000 / 30)
    setInterval(() => {
      self.dispatch("leaders", [...self.objects.values()].filter(o => o.type == "PLAYER").sort((a, b) => b.xp - a.xp).slice(0, 10).map((l, li) => `${li+1}. ${l.nickname} - ${l.xp}xp <br>`).join(""))


    }, 1000)
  }
}


async function physicsTick(scene) {
  scene.gameObjects.forEach(async (obj, i) => {



    if (!obj || !obj.data) {
      return
    }
 handleCollisions(obj);
    [...obj.data.energies.entries()].forEach((item, i) => {
      if (item[1].expireAt < Date.now()) {
        obj.data.energies.delete(item[0])
      }
    });
    let absoluteMovements = [...obj.data.energies.values()].reduce((vea, ener) => {
      return {
        x: vea.x + ener.x,
        y: vea.y + ener.y
      }
    }, obj.data.velocity)

    obj.plusProp("x", absoluteMovements.x)
    obj.plusProp("y", absoluteMovements.y)
    obj.set("absoluteMovements", absoluteMovements)
    let exp = require("./psy_tests.js")(obj)
    exp.forEach((ev, i) => {
      if (ev.e) {
        ev.a()
      }
    });

  });

}
exports.User = class User {
  constructor(token) {
    this.token = token
    let self = this

  }
  async fetchUser() {
    return await require("./disprofile.js")(this.token)
  }
  async fetchProfile() {
    let user = await this.fetchUser()
    if (!user) {
      return null
    }
    let profile = await db.collection("profiles").findOne({
      id: user.id
    })
    if (!profile) {
      await db.collection("profiles").insertOne({
        id: user.id,
        gems: 10,
        characters: ["tank"],
        skins: [{
          character: "tank",
          skin: "default"
        },
      {character:"fireshoter",
    skin:"turbo"}],
        record: 0,
        games: 0
      })
      profile = await db.collection("profiles").findOne({
        id: user.id
      })
    }
    return profile
  }
  async updateProfile(k, v) {
    let user = await this.fetchUser()
    if (!user) {
      return null
    }
    let profile = await this.fetchProfile()
    if (!profile) {
      return null
    }
    db.collection("profiles").updateOne({
      id: user.id
    }, {
      $set: {
        [k]: v
      }
    })
    profile = await this.fetchProfile()
    return profile
  }
  async updatePlus(k, v) {
    let user = await this.fetchUser()
    if (!user) {
      return null
    }
    let profile = await this.fetchProfile()
    if (!profile) {
      return null
    }

    db.collection("profiles").updateOne({
      id: user.id
    }, {
      $set: {
        [k]: ((typeof profile[k] == "object"&&Array.isArray(profile[k])) ? [...profile[k],...v].unique(): (v + profile[k]))
      }
    })
    profile = await this.fetchProfile()
    return profile
  }
}
