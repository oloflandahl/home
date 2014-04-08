// Progress is responsible for showing progress indication on the page.
var Progress = (function () {
	"use strict"
	
	var MAX = 100;
	
	var container,
		progressBar,
		label,
		running = false;
		
	var logDebug = function (m) { Logger.log.debug("(Progress) " + m); };
	
	var init = function (containerId) {
		logDebug("init");
		container = $(containerId);
		progressBar = container.children("progress").val(0).attr("max", MAX);
		label = container.children("p").text("");
	};
	
	var reset = function () {
		logDebug("reset");
		progressBar.val(0);
	};
	
	var setLabel = function (text) {
		logDebug("set label: " + text);
		label.text(text);
	};
	
	var set = function (val) {
		if (!running) {
			Logger.log.warning("Tried to set progress when not running.");
			return;
		}

		logDebug("set " + val);
		if (val > MAX) {
			logDebug("progress value exceeds max value: " + val);
			val = MAX;
		}
		
		logDebug("progress value = " + val);
		progressBar.val(val);
	};
	
	var add = function (delta) {
		logDebug("add " + delta);
		var val = progressBar.val();
		set(val + delta);
	};
	
	var update = function (val, labelText) {
		if (!running) {
			Logger.log.warning("Trying to update progress when not running. val = " + val + ", label = " + labelText);
		}
		
		if (labelText) {
			setLabel(labelText);
		}
		
		set(val);
	};
	
	var show = function () {
		logDebug("show");
		container.fadeIn(200);
	};
	
	var hide = function () {
		logDebug("hide");
		container.fadeOut(200, reset);
	};
	
	var start = function (labelText) {
		logDebug("start");
		running = true;
		setLabel(labelText);
		show();
	};
	
	var end = function () {
		logDebug("end");
		set(MAX);
		setTimeout(hide, 500);
		running = false;
	};
	
	var run = function (action, labelText) {
		start(labelText);
		action();
		end();
	};
	
	return {
		init: init,
		add: add,
		update: update,
		run: run,
		start: start,
		end: end,
		isRunning: function () {return running;}
	};
}());