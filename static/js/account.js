module.exports = async () => {
  let token = localStorage.getItem("token")
  if (!token) {
    document.body.classList.add("unauthorized")
  } else {
    document.body.classList.add("authorized")
    window.user = await fetch("/api/profile/" + token)
    user = await user.json()

    document.getElementById("userdata").innerHTML = `
    <img id="userdata-avatar" src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64">
    <span id="userdata-tag">${user.username}#${user.discriminator}</span>
  
    `
  }
}
