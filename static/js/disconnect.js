module.exports=()=>{document.body.removeChild(app.view);
// app.stage.destroy()
// app.renderer.destroy()
app.destroy()
delete window.socket
window.onkeyup = () => {}
window.onkeydown = () => {}
sprites = new Map()
oAttributes = new Map()
textures = new Map()
destroing = []
newState = []
document.getElementById("welcome").style.display = "inline-block"
document.getElementById("interface").style.display = "none"
clearInterval(pi);

Object.keys(PIXI.utils.TextureCache).forEach(function(texture) {
  PIXI.utils.TextureCache[texture].destroy(true);
});
require("./showVideoAd.js")()
}
