// This is a worker that extract words from a message response 
//  and returns an array with those words.
var Worker_Synch = (function () {
	"use strict"

	return {
		extractWords: function (data) {
			var allWords = [];
			for (var i=0;i<data.length;i++) {
				var messages = JSON.parse(data[i].body).data;
				if (messages.length === 0) {
					continue;
				}
			  	
				for (var m=0; m < messages.length; m++) {
					if (messages[m].message) {
						var date = new Date(messages[m].updated_time.substr(0,10)),
							words = messages[m].message.toLowerCase().replace(/[\n\r]/g, " ").replace(/[^åäö\w\s]/g, "").replace(/[0-9]/g, "").split(" ");
						for (var w = 0; w < words.length; w++) {
							if (words[w].length > 0)
							{
								allWords.push({word:words[w], date:date});
							}
						}
					}
				}
			}

			return allWords;
		}
	};
}());

// Use asynchronous Web Worker. 
self.addEventListener('message', function(e) {
	// Extract words
	var words = Worker_Synch.extractWords(e.data);

	// Post result. This will also terminate the worker.
	self.postMessage({result: words});
});