module.exports=()=>{
  require("./account.js")()
  document.body.removeChild(app.view);
// app.stage.destroy()
// app.renderer.destroy()
app.destroy()
delete window.socket
window.onkeyup = () => {}
window.onkeydown = () => {}
sprites = new Map()
oAttributes = new Map()

destroing = []
newState = []
document.getElementById("welcome").style.display = "inline-block"
document.getElementById("interface").style.display = "none"
clearInterval(pi);

if (typeof adplayer !== 'undefined') {
	aiptag.cmd.player.push(function() { adplayer.startPreRoll(); });
} else {
	//Adlib didnt load this could be due to an adblocker, timeout etc.
	//Please add your script here that starts the content, this usually is the same script as added in AIP_COMPLETE or AIP_REMOVE.
	console.log("Ad Could not be loaded, load your content here");
}
}
