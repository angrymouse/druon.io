module.exports=function genId(prefix) {
  if (!prefix) {
    prefix = "unk"
  }
  return prefix + Date.now().toString(16) + (Math.random() * 100000).toString(16)
}
