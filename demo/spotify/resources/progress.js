// This file contains all the handling of the progress indication //

var ProgressHandler = new function () 
{
	var progressClass = 'loading_img';

	function startProgress (parent) 
	{
		var progress = $('<img src="resources/loading.gif" class="' + progressClass + '" />');
		parent.append(progress);
	}
	
	function endProgress () 
	{
		$('.' + progressClass).remove();
	}
	
	// Shows a progress icon next to the spcified item 
	//  while performing the specified action.
	this.show = function (item, action) 
	{
		startProgress(item);
		action(item, endProgress);
	};
	
	this.hide = function () 
	{
		endProgress();
	};

};