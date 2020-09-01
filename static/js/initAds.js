module.exports=()=>{
  window.aiptag = window.aiptag || {cmd: []};
  aiptag.cmd.display = aiptag.cmd.display || [];
  aiptag.cmd.player = aiptag.cmd.player || [];

  //CMP tool settings
  aiptag.cmp = {
    show: true,
    position: "centered",  //centered, bottom
    button: true,
    buttonText: "Privacy settings",
    buttonPosition: "bottom-left" //bottom-left, bottom-right, top-left, top-right
  }
  aiptag.cmd.player.push(function() {
	window.adplayer = new aipPlayer({
		AD_WIDTH: 960,
		AD_HEIGHT: 540,
		AD_FULLSCREEN: true,
		AD_CENTERPLAYER: true,
		LOADING_TEXT: 'loading advertisement',
		PREROLL_ELEM: function(){return document.getElementById('preroll')},
		AIP_COMPLETE: function (evt)  {
			/*******************
			 ***** WARNING *****
			 *******************
			 Please do not remove the PREROLL_ELEM
			 from the page, it will be hidden automaticly.
			 If you do want to remove it use the AIP_REMOVE callback.
			*/
			console.log("Preroll Ad Completed: " + evt);
		},
		AIP_REMOVE: function ()  {
			// Here it's save to remove the PREROLL_ELEM from the page if you want. But it's not recommend.
		}
	});
});
}
