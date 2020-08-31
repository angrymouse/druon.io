module.exports=function drawRect(color, width, height, borderSize, borderColor) {
  var graphics = new PIXI.Graphics();
  if (!borderSize) {
    borderSize = 0
  }
  if (!borderColor) {
    borderColor = 0x00000000
  }
  graphics.beginFill(color);

  graphics.lineStyle(borderSize, borderColor);

  graphics.drawRect(0, 0, width, height);
  return graphics

}
