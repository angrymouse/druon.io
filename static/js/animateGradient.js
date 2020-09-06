module.exports=()=>{
  let r=Math.rand(0,255),
      g=Math.rand(0,255),
      b=Math.rand(0,255)
  let background=document.getElementById("loading")

  background.style.backgroundImage=`linear-gradient(217deg, rgba(${r},0,0,.8), rgba(${r},0,0,0) 70.71%),linear-gradient(127deg, rgba(0,${g},0,.8), rgba(0,${g},0,0) 70.71%),linear-gradient(336deg, rgba(0,0,${b},.8), rgba(0,0,${b},0) 70.71%)`


}
