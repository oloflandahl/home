// Facebook is responsible for all interactions with the Graph API, 
// including; loading the JavaScript SDK, handling authorisation, response errors and caching.  
var Facebook = (function() {
	"use strict"

	var BATCH_LIMIT = 20;
	var ARG = "_ARG_";
	var KEYS = {
		me: "/me",
		friends: "/me/friends",
		friendsIds: "/me/friends?fields=id",
		friendsInfo: "/me/friends?fields=id,name,picture",
		messages: "/" + ARG + "/statuses?fields=message" // ARG = id
	};
	
	var loggedIn = undefined;

	String.prototype.setArg = function (arg) {
		return this.replace(ARG, arg);
	};
	
	function logDebug(m) {Logger.log.debug("(Facebook) " + m)};

	var init = function (loggedInFunc, loggedOutFunc) {
		logDebug("init");
		window.fbAsyncInit = function() {
			FB.init({
				appId: '615726768439681', // App ID    
				status: true, // check login status
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true  // parse XFBML
			});
			
			function handleLoginStatus (response) {
				logDebug("handleLoginStatus: " + response.status);
				// Here we specify what we do with the response anytime this event occurs. 
				if (response.status === 'connected') {
					// The response object is returned with a status field that lets the app know the current
					// login status of the person. In this case, we're handling the situation where they 
					// have logged in to the app.
					if (loggedIn === undefined || !loggedIn) {
						logDebug("handle logged in");
						loggedInFunc();
						loggedIn = true;
					}
				} else {
					// In this case, the person is not logged into Facebook or the app.
					if (loggedIn === undefined || loggedIn) {
						logDebug("handle logged out");
						loggedOutFunc();
						loggedIn = false;
					}
				}
			}
			
			// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
			// for any authentication related change, such as login, logout or session refresh. This means that
			// whenever someone who was previously logged out tries to log in again, the correct case below 
			// will be handled. 
			FB.Event.subscribe('auth.authResponseChange', handleLoginStatus);
			
			// Initial handling of loginstatus.
			FB.getLoginStatus(handleLoginStatus);
		};

		// Load the SDK asynchronously
		(function(d){
			logDebug("load SDK");
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));
	};
	
	function fbCall (apiCall) {
		if (FB) {apiCall();}
		else {Logger.log.error("Tried to call the Facebook API before it was loaded.");}
	}
	
	var login = function () {
		logDebug("login");
		fbCall(function () { 
			FB.login(function(response) { 
			}, 
			{scope: "user_status,friends_status"});
		});
	};
	
	var logout = function () {
		logDebug("logout");
		fbCall(FB.logout);
	};

	function checkForError (response) {
		if (response.error) {
			var e = response.error;
			Logger.log.error("(" + e.code + ", " + e.type + "): " + e.message);
			return true;
		}

		return false;
	}

	function tryGetFromStore (key, callback) {
		var item = Store.get(key);
		if (item) {
			logDebug("from store");
			callback(item);
			return true;
		}

		return false;
	}

	function storeAndRun (key, value, callback) {
		Store.set(key, value); // TODO: Don't cache all responses
		callback(value);
	}
	
	function load(key, callback) {
		logDebug("load " + key);
		fbCall(function () {
			logDebug("from api");
			FB.api(key, function (response) {
				if (checkForError(response)) { 
					return;
				}
				else if (response.data) {
					logDebug("store response data");
					storeAndRun(key, response.data, callback);
				}
				else {
					logDebug("store response");
					storeAndRun(key, response, callback);

				}
			});
		});
	}

	
	function loadBatch(key, items, callback, batchCount) {
		logDebug("load batch " + key);
		fbCall(function() {
			logDebug("from api");
			FB.api("/", "POST", {batch:items}, function (response) {
				if (checkForError(response)) { 
					return;
				}
				else {
					logDebug("store response data");
					var newResponse = {
						data: response,
						batchCount: batchCount
					};
					storeAndRun(key, newResponse, callback);
				}
			});
		});
	}
	
	function batchItem (name, url, omit) {
		var item = {method: "GET", name: name, relative_url: url};
		if (omit !== undefined) { 
			$.extend(item, { omit_response_on_success: omit }); 
		}
		return item;
	}
	
	function loadContent(key) {
		return function(callback, id) { 
			if (!tryGetFromStore(key, callback)) {
				load(key, callback);
			}
		};
	}

	function loadContentWithId(key, id, callback) {
		var idKey = key.setArg(id);
		if (!tryGetFromStore(idKey, callback)) {
			load(idKey, callback);
		};
	}

	function loadBatchContent(key) {
		return function(callback) { 
			Facebook.load.friendsIds(function (ids) {
				var friendCount = ids.length,
					batchCount = Math.ceil(friendCount / BATCH_LIMIT),
					batchN = 0,
					i;
				while(batchN < batchCount) {
					var batchKey = key + batchN;
					if (!tryGetFromStore(batchKey, callback)) {
						
						var batchItems = [],
							start = batchN * BATCH_LIMIT,
							end = Math.min(start + BATCH_LIMIT, friendCount);

						for (i=start; i<end; i++) {
							var id = ids[i].id;
							var url = key.setArg(id);
							batchItems.push(batchItem(id, url));
						}

						loadBatch(batchKey, batchItems, callback, batchCount);
					} // End If
					batchN++;
				} // End While
			}); // End load ids
		};
	}
	
	return {
		init: init,
		login: login,
		logout: logout,
		load: {
			me: loadContent(KEYS.me),
			friends: loadContent(KEYS.friends),
			friendsIds: loadContent(KEYS.friendsIds),
			friendsInfo: loadContent(KEYS.friendsInfo),
			friendMessages: function(id, callback) { loadContentWithId(KEYS.messages, id, callback)},
			friendsMessages: loadBatchContent(KEYS.messages)
		}
	};
}());