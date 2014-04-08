// This file contains all the handling of the spotify data requests //

var DataHandler = new function () 
{
	// IE: Enable cross domain requests.
	$.support.cors = true;

	// Keep a reference to the XMLHTTPRequest jQuery object 
	//  to be able to abort it.
	var activeRequest = null;
	
	// Print any ajax errors.
	$(document).ajaxError(function(e, jqxhr, settings, exception) {
		console.log(exception);
	});

	this.getArtists = function (searchString, callback) 
	{
		// Send spotify request to get the artist for the specified search string.
		activeRequest = 
			$.getJSON('http://ws.spotify.com/search/1/artist.json?q=' + searchString,
				function (data) 
				{
					activeRequest = null;
					callback(data);
				});
	};
	
	this.getAlbums = function (artistUri, callback) 
	{
		// Send spotify request to get the artist for the specified artist.
		activeRequest = 
			$.getJSON('http://ws.spotify.com/lookup/1/.json?uri=' + artistUri + '&extras=albumdetail',
				function (data) 
				{
					activeRequest = null;
					callback(data);
				});
	};
	
	this.abort = function () 
	{	
		// Abort any active request.
		if (activeRequest !== null) 
		{
			activeRequest.abort();
			activeRequest = null;
			return true;
		}
		
		return false;
	};
};