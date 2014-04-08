// App is responsible for handling interactions and events in the document.
var App = (function () {
	"use strict"

	if (!JSON) {
		Logger.log.error("JSON is not supported in this browser.");
	}

	var sel = {
		login: { 
			content: "#login_content",
			status: "#login_status",
			button: "#login_btn"},
		logout: {
			link: "#logout_link"},
		progress: "#progress_status",
		vis: {
			container: "#vis_content",
			item: ".content-item",
			link: ".content-item.link",
			enabled_link: ".content-item.link.enabled",
			active: ".content-item.active",
			back: ".content-item .nav .back-btn",
			cloud: {
				id: "#word_cloud",
				search: "#word_cloud .nav .search-btn",
				limit: "#word_cloud .nav input",
				limit_arrow: "#word_cloud .nav .step-btn"
			},
			bar: {
				id: "#bar_chart",
				date: "#bar_chart .nav #date p",
				date_arrow: "#bar_chart .nav .step-btn"
			},
			cards: {
				id: "#cards"
			},
			search: "#search"}
		};

	var DUR = 1000;
			
	function logDebug(m) {Logger.log.debug("(App) " + m)};
	
	var init = function () {
		Logger.init(false, true, true, true);
		logDebug("init");
		loadFacebookAPI();
		Progress.init(sel.progress);
		initEventHandlers();
	};
	
	function loadFacebookAPI() {
		// Load facebook API and init login/logout event handlers.
		Facebook.init(function() {
			// When logged in
			$(sel.login.content).fadeOut(DUR, function () {
				loadWords();
				$(sel.vis.container).fadeIn(DUR); // TODO Fade in when words have been loaded?
			});

			Facebook.load.me(function(data) {
				$(sel.login.status + " p").text("Logged in as " + data.name);
				slideDownStatus(function () {
					setTimeout(slideUpStatus, 5000);
				});
				$(sel.login.status).mouseenter(slideDownStatus);
				$(sel.login.status).mouseleave(slideUpStatus);
			});
		}, function() {
			// When logged out
			$(sel.login.status).animate({top: "-50px"}, DUR, function () {$(sel.login.status + " p").text("");});
			$(sel.vis.container).fadeOut(DUR, function () {$(sel.login.content).fadeIn(DUR);});

			$(sel.login.status).off("mouseenter", slideDownStatus);
			$(sel.login.status).off("mouseleave", slideUpStatus);
		});
	}

	function slideDownStatus(callback) {
		callback = callback && typeof callback === "function" ? 
			callback : function () {};
		$(sel.login.status).animate({top: 0}, DUR, callback);
	}

	function slideUpStatus() {
		var height = $(sel.login.status).height();
		$(sel.login.status).animate({top: "-40px"}, DUR);
	}

	function initEventHandlers() {
		// Init page event handlers.
		logDebug("init event handlers");
		$(sel.login.button).click(Facebook.login);
		$(sel.logout.link).click(Facebook.logout);
		
		$(sel.vis.back).click(resetVis);
	}

	function tryEnabledVis(count, totalCount, words) {
		if (Progress.isRunning() && count === totalCount) {
			Words.init(words);
			Progress.end();
			enableVis();
		}
	}

	function enableVis() {
		logDebug("enable visualisations");
		$(sel.vis.cloud.id).addClass("enabled");
		$(sel.vis.bar.id).addClass("enabled");
		$(sel.vis.cards.id).addClass("enabled");
		$(sel.vis.container).delegate(sel.vis.enabled_link, "click", function () {
			var vis = $(this);
			setTimeout(function () {
				vis.css({
					position: "absolute", 
					left: vis.position().left+"px", 
					top: vis.position().top+"px", 
					width: vis.width()+"px", 
					height: vis.height()+"px"
				});
			}, 190);

			$(sel.vis.item).not(vis).fadeOut(200, function () {
				if (vis.hasClass("done")) {
					return;
				}

				vis.addClass("done");
				vis.animate({
					left: 0,
					top: 0,
					width: "100%",
					height: "100%",
					margin: 0
				}, 2000, function () {
					vis.find(".image-container img").fadeOut(400, function () {
						vis.removeClass("link");
						vis.addClass("active");
						switch("#"+vis.attr("id")) {
							case sel.vis.cloud.id:
								WordCloud.init(sel.vis.cloud)
									.render();
								break;
							case sel.vis.bar.id:
								BarChart.init(sel.vis.bar)
									.render();
								break;
							case sel.vis.cards.id:
								Cards.init($(sel.vis.cards.id+" .content"));
								break;
						}
					});
				});
			});
		});
	}

	function resetVis () {
		$("svg").remove();
		var activeVis = $(sel.vis.active);

		switch("#"+activeVis.attr("id")) {
			case sel.vis.cloud.id:
				// WordCloud.unrender();
				break;
			case sel.vis.bar.id:
				// BarChart.unrender();
				break;
			case sel.vis.cards.id:
				Cards.unrender();
				break;
		}

		activeVis.removeClass("active");
		activeVis.addClass("link");
		activeVis.find(".image-container img").show();
		activeVis.removeAttr("style");
		activeVis.removeClass("done");
		$(sel.vis.item).fadeIn();
		$(sel.vis.container).undelegate(sel.vis.enabled_link, "click");
		enableVis();

		return false;
	}

	function loadWords() {
		var allWords = [];
		var count = 0;
		Progress.start("Fetching words...");
		Facebook.load.friendsMessages(function (friendMessages) {
			Progress.update(70 * count / friendMessages.batchCount);
			if (typeof Worker !== "undefined") {
				logDebug("Use Web Workers");
				var worker = new Worker('js/extractWords.js');
				worker.addEventListener('message', function(e) {
					if (e.data.result) {
						logDebug("Use worker result");
						allWords = allWords.concat(e.data.result);
						worker.terminate();
						count++;
						tryEnabledVis(count, friendMessages.batchCount, allWords);
					}
				}); // End worker event listener

				logDebug("Execute worker");
				worker.postMessage(friendMessages.data);
			}
			else {
				Logger.log.warning("Web Workers are not supported in this browser");
				if (typeof Worker_Synch !== "undefined") {
					var result = Worker_Synch.extractWords(friendMessages.data);
					allWords = allWords.concat(result);
					count++;
					tryEnabledVis(count, friendMessages.batchCount, allWords);
				} 
				else {
					$.getScript("js/extractWords.js")
						.done(function () {
							var result = Worker_Synch.extractWords(friendMessages.data);
							allWords = allWords.concat(result);
							count++;
							tryEnabledVis(count, friendMessages.batchCount, allWords);
						})
						.fail(function () {
							Logger.log.error("Failed to load script");
						});
				}
			}
		}); // End load messages
	}

	return {
		init: init
	};
}());

$(function () {
	App.init();
});