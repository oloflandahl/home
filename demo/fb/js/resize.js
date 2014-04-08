// Resize is responsible for adjusting the size of a 
// specified element when the window is resized.
// Only works when margins are defined in pixels!
var Resize = (function () {
	"use strict"

	var resizeTimer, el, hMargin, vMargin;

	var init = function (element) {
		el = element;
		hMargin = margin(el, "left") + margin(el, "right");
		vMargin = margin(el, "top") + margin(el, "bottom");

		adjustSize();
		$(window).resize(function () {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout(adjustSize, 200);
		});
	};

	function margin (el, dir) {
		return parseInt(el.css("margin-" + dir));
	}

	function adjustSize () {
		el.width($(document.body).width() - hMargin);
		el.height($(document.body).height() - vMargin);
	}

	return {
		init: init
	};

}());

$(function () {
	var element = $(".adjust-size");
	Resize.init(element);
});