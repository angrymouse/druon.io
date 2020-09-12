let allSkins=user?user.skins||[]:[]
if (typeof user=="undefined" || user.error) {
  window.activeSkin = {
    character: "tank",
    skin: "default"
  }
  window.skinIndex=null
} else {
  if (localStorage.getItem("skin")) {
    window.skinIndex = localStorage.getItem("skin")

    window.activeSkin=allSkins[skinIndex]
    if(!activeSkin){
      skinIndex=0;
      localStorage.setItem("skin",0)
        window.activeSkin=allSkins[skinIndex]
    }
    skinIndex=parseInt(skinIndex)

  } else {
    window.skinIndex=0
    localStorage.setItem("skin", 0)
      window.activeSkin=allSkins[skinIndex]
  }
}
module.exports.last = () => {
selectSkin(activeSkin.character,activeSkin.skin)
}
window.nextSkin=()=>{
if(skinIndex>=allSkins.length-1){return}

selectSkin(allSkins[skinIndex+1].character,allSkins[skinIndex+1].skin,1)
}
window.prevSkin=()=>{
if(skinIndex<=0){return}

selectSkin(allSkins[skinIndex-1].character,allSkins[skinIndex-1].skin,-1)
}
function selectSkin(c, s,i) {
  activeSkin = {
    character: c,
    skin: s
  }
  if(i){window.skinIndex+=i;localStorage.setItem("skin",skinIndex)}
  document.getElementById("activeskin-preview").src = `/assets/preview/${c}/${s}.svg`
}
