module.exports = async () => {
  let token = localStorage.getItem("token")
  if (!token) {
    window.user={error:true}
    document.body.classList.add("unauthorized")
  } else {

    window.user = await fetch("/api/profile/" + token)
    user = await user.json()
if(user.error){
    return document.body.classList.add("unauthorized")
}
  document.body.classList.add("authorized")
    document.getElementById("userdata").innerHTML = `
    <img id="userdata-avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64">
    <span id="userdata-tag">${user.username}#${user.discriminator}</span>

    `
  }
}
