module.exports=async(id)=>{
    let modal=document.getElementById("modal")
    let fsm=document.getElementById("fullscreen-modal")
  switch (id) {
    case "profile":

    modal.style.display="block"
    modal.innerHTML=`
    <img id="profile-avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128">
    <span id="profile-tag">${user.username}#${user.discriminator}</span>
      <span id="profile-gems">Gems: ${user.gems} <i class="icon-gem"></i></span>
      <span id="profile-maxXp">Max. XP: ${user.record} <i class="icon-trophy"></i></span>
<span id="profile-gamesPlayed">Games played: ${user.games} <i class="icon-swords"></i></span>
<span id="profile-title">Unlocked skins</span>
<div id="profile-skins">${
  user.skins.map(skin=>`<div class="profile-skin"><img class="profile-skin-image" src="/assets/skins/${skin.character}/${skin.skin}.svg"></img><span class="skin-name">${skin.skin}</span></div>`).join("")
}</div>
<a href="#" id="close-modal"></a>
      `
      return ;
      case "shop":
          fsm.style.display="block"
fsm.innerHTML=`
<a href="#" id="close-modal-large">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path
  fill="#31373D"
  id="cl"
  d="M22.238 18.004l9.883-9.883c1.172-1.171 1.172-3.071 0-4.243-1.172-1.171-3.07-1.171-4.242 0l-9.883 9.883-9.883-9.882c-1.171-1.172-3.071-1.172-4.243 0-1.171 1.171-1.171 3.071 0 4.243l9.883 9.882-9.907 9.907c-1.171 1.171-1.171 3.071 0 4.242.585.586 1.354.879 2.121.879s1.536-.293 2.122-.879l9.906-9.906 9.882 9.882c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879c1.172-1.171 1.172-3.071 0-4.242l-9.881-9.883z"/>
<style>
  #cl{

  transition:all .4s;
  }
  #cl:hover{
  fill:#DD2E44
  }
</style>
</svg>

</a>
<div id="triangle-shop"></div>
<span id="shop-title">Shop</span>
<div id="resources"><i class="icon-gem"></i> ${user.gems}</div>
<img src="/assets/comingsoon.svg" class="comingsoon"></img>
`
        break;
    default:

      modal.style.display="none"
          fsm.style.display="none"
      return;
  }
}
