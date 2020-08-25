module.exports=async (obj,args)=>{
  let x=Number(args[0])
  let y=Number(args[1])
  obj.set("x",x)
  obj.set("y",y)
}
