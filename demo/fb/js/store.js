// Store is responsible for caching data, 
// in the session storage if available, 
// or otherwise in an alternative storage object.
var Store = (function() {
	"use strict"

	var LIMIT = 2*1024*1024, // 2 MB
		DONTREMOVE = ["WORDCOUNT", "WORDDATES"];

	var s, altStorage;
		
	function storage() {return s?sessionStorage:altStorage};
	function logDebug(m) {Logger.log.debug("(Store) " + m)};
		
	var init = function() {
		logDebug("init");
		s = typeof(Storage)!=="undefined";
		if (!s) {
			Logger.log.warning("Session Storage is not supported in this browser");
		}
		altStorage = {};
	};

	var checkSize = function() {
		var content = JSON.stringify(storage());
		var size = content.length;
		logDebug("Checking storage size: "+size);
		if (size > LIMIT) {
			logDebug("Clear cache.");
			var keysToRemove = [];
			for (var i=0;i<sessionStorage.length;i++) {
				var key = sessionStorage.key(i);
				if (DONTREMOVE.indexOf(key) < 0) {
					keysToRemove.push(key);
				}
			}
			$(keysToRemove).each(function() {
				sessionStorage.removeItem(this);
			});
		}
	};
	
	var get = function(key) {
		logDebug("get " + key);
		var val = storage()[key];
		if (val && val.match(/^(\{|\[).+/)) {
			logDebug("parse json");
			val = $.parseJSON(val);
		}
		return val;
	};
	
	var set = function(key, val) {
		logDebug("set " + key);
		checkSize();
		if (typeof val === "object") {
			logDebug("create json string");
			val = JSON.stringify(val);
		}
		storage()[key] = val;
	};
	
	var contains = function(key) {
		return storage()[key] != null;
	};

	var clear = function () {
		if (s) {
			sessionStorage.clear();
		} else {
			altStorage = {};
		}
		
	}
	
	return {
		init: init,
		get: get,
		set: set,
		contains: contains,
		clear: clear
	};
}());

(function () {
	Store.init();
}());