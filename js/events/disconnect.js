module.exports=async (socket) => {


let user=await socket.user.fetchProfile()
if(user){

    socket.user.updatePlus("games",1)

}
socket.sprite.destroy()
}
