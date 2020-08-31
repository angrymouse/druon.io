module.exports=async (token)=>{
  let user=await fetch("https://discord.com/api/v6/users/@me",{
    headers:{
      "Authorization":token
    }
  })
  user=await user.json()
  if(!user.id){
    return null
  }else{
    return user
  }
}
