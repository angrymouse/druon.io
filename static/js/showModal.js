module.exports=async(id)=>{
    let modal=document.getElementById("modal")
  switch (id) {
    case "profile":

    modal.style.display="block"
    modal.innerHTML=`
    <img id="profile-avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128">
    <span id="profile-tag">${user.username}#${user.discriminator}</span>
      <span id="profile-gems">Gems: ${user.gems} <i class="icon-gem"></i></span>
      <span id="profile-maxXp">Max. XP: ${user.record} <i class="icon-trophy"></i></span>
<span id="profile-gamesPlayed">Games played: ${user.games} <i class="icon-swords"></i></span>
<a href="#" id="close-modal"></a>
      `
      return ;
    default:

      modal.style.display="none"
      return;
  }
}
