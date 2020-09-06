module.exports=async ()=>{
  let textures=require("./textures.json")

  Object.entries(textures).forEach(e=>{
    if(e[1]=="original"){e[1]=e[0]}
    PIXI.Loader.shared.add(e[1],e[0])
  })

PIXI.Loader.shared.load(()=>{
    document.getElementById("loading").style.display="none"
  document.getElementById("welcome").style.display="inline-block"
})
}
