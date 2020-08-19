module.exports=(obj)=>{
  let bullets=require("./bullets.json")

  return [{
      e: obj.data.x > 9990,
      a: () => {
        obj.set("x", 10)
      }
    },
    {
      e: obj.data.y > 9990,
      a: () => {
        obj.set("y", 10)
      }
    },
    {
      e: obj.data.x < 10,
      a: () => {
        obj.set("x", 9990)
      }
    },
    {
      e: obj.data.y < 10,
      a: () => {
        obj.set("y", 9990)
      }
    },
    {
      e:obj.data.shoting&&obj.data.lastShot<Date.now()-obj.data.shotTimeout,
      a:async ()=>{
        obj.set("lastShot",Date.now())
        let bullet=bullets[obj.data.bullet]

    let bo=  obj.scene.addObject("BULLET",{
        ...bullet,
        x:obj.data.x-Math.cos(obj.data.rotation)*50,
        y:obj.data.y-Math.sin(obj.data.rotation)*50,
    rotation:obj.data.rotation,
    velocity:calcV(obj.data.rotation,bullet.speed),
        id:genId("bullet")
      })
      let changes=calcV(obj.data.rotation,bullet.speed,true)
      obj.plusProp("x",Math.round(changes.x))
        obj.plusProp("y",Math.round(changes.y))
      setTimeout(()=>{bo.destroy()},bullet.alive)
      }
    }
  ]

}
