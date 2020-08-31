module.exports=()=>{
  aiptag.cmd.player.push(function() {
	adplayer = new aipPlayer({
		AD_WIDTH: 960,
		AD_HEIGHT: 540,
		AD_FULLSCREEN: false,
		AD_CENTERPLAYER: false,
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
