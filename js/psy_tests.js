module.exports=(obj)=>{
  let bullets=require("../json/bullets.json")

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
bullet.rotation=obj.data.rotation+((Math.random()-Math.random())*bullet.scatter)
    let bo=  obj.scene.addObject("BULLET",{
        ...bullet,
        from:obj.data.id,
        x:obj.data.x-Math.cos(obj.data.rotation)*50,
        y:obj.data.y-Math.sin(obj.data.rotation)*50,

    velocity:calcV(bullet.rotation,bullet.speed),
        id:genId("bullet")
      })
      let recoilId=genId("recoil")
      let recoilPower={
        expireAt:Date.now()+Math.min(500,bullet.alive/4),
        ...calcV(bullet.rotation,bullet.recoil,true)
      }
      obj.data.energies.set(recoilId,recoilPower)
      setTimeout(()=>{bo.destroy()},bullet.alive)



      }
    },

  ]

}
