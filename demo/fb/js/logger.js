// Logger is responsible for logging on levels Debug, Timer, Warning and Error.
var Logger = (function () {
	"use strict"
	
	var pref = {
		DEBUG: "DEBUG",
		WARNING: "WARNING",
		ERROR: "ERROR",
		TIMER: "TIMER"
	};
	
	var toggleLookup = {},
		timers = {};
		
	var init = function (debug, timer, warning, error) {
		toggleLookup[pref.DEBUG] = debug;
		toggleLookup[pref.TIMER] = timer;
		toggleLookup[pref.WARNING] = warning;
		toggleLookup[pref.ERROR] = error;
	};
	
	function toggle(prefix, on) {
		if (toggleLookup[prefix] !== undefined) {
			if (on === undefined) {
				toggleLookup[prefix] = !toggleLookup[prefix];
			}
			else {
				toggleLookup[prefix] = on;
			}
			return toggleLookup[prefix];
		}
		return false;
	}
	
	function log (prefix, message) {
		if (toggleLookup[prefix])
		{
			switch(prefix) {
				case pref.DEBUG:
					console.log(message);
					break;
				case pref.WARNING:
					console.warn(message);
					break;
				case pref.ERROR:
					console.error(message);
					break;
				case pref.TIMER:
					console.log(pref.TIMER + ": " + message);
					break;
				default:
					console.log(message);
					break;
			}
		}
	}
	
	var startTimer = function(key) {
		if (toggleLookup[pref.TIMER])
		{
			timers[key] = new Date();
		}
	};
	
	var endTimer = function(key) {
		if (toggleLookup[pref.TIMER])
		{
			var timer = timers[key];
			if (timer)
			{
				var timeElapsed = (new Date() - timer);
				log(pref.TIMER, key + " " + timeElapsed + " ms");
				delete timers[key];
			}
			else {
				Logger.log.error("Tried to end a timer that wasn't started.");
			}
		}
	};
	
	var getToggleFunc = function (prefix) {
		return function (on) { toggle(prefix, on); };
	}
	
	var getLogFunc = function (prefix) {
		return function (message) { log(prefix, message); };
	}
	
	return {
		init: init,
		toggle: {
			debug: getToggleFunc(pref.DEBUG),
			timer: getToggleFunc(pref.TIMER),
			warning: getToggleFunc(pref.WARNING),
			error: getToggleFunc(pref.ERROR)
		},
		log: {
			debug: getLogFunc(pref.DEBUG),
			warning: getLogFunc(pref.WARNING),
			error: getLogFunc(pref.ERROR)
		},
		timer: {
			start: startTimer,
			end: endTimer
		}
	};
	
}());

$(function () {
	Logger.init(false, true, true, true);
}());