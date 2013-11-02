(function() {
	'use strict';

	var addTouchHandler = function(el) {
		el.on('touchstart', function() { $(this).addClass('touching') });
		el.on('touchend', function() { $(this).removeClass('touching') });
	};

	$(document).ready(function() {

		// TODO Create jquery function instead
		addTouchHandler($('.group li'));
		addTouchHandler($('.links li'));
		addTouchHandler($('.contact'));
		addTouchHandler($('.arrow'));

		var activeGroup = (function() {

			var	offset,
				index = 0, 
				win = $(window),
				body = $('body'),
				menu = $('.menu'),
				groups = $('.group'),
				arrow = $('.arrow'),
				arrowUp = arrow.filter('.up'),
				arrowDown = arrow.filter('.down'),
				bounds = { min: 0, max: groups.length-1 };

			setOffset();

			function setOffset() {
				offset = menu.outerHeight();
			};

			var scrollToActiveGroup = function() {
				var pos = groups.eq(index).offset().top;
				$('body, html').animate({scrollTop: (pos - offset) }, 600, 'swing');			
			};

			var setActiveLink = function() {
				menu.find('.nav-link.active').removeClass('active');
				menu.find('.nav-link').eq(index).addClass('active');
			};

			var updateArrows = function() {
				if (index === bounds.min) {
					arrowUp.addClass('hide');
					arrowDown.removeClass('hide');
				}
				else if (index === bounds.max) {
					arrowDown.addClass('hide');
					arrowUp.removeClass('hide');
				}
				else {
					arrow.removeClass('hide');
				}
			};

			var setIndex = function(newIndex, scroll) {

				if (newIndex < bounds.min || newIndex > bounds.max) {
					console.error('Invalid index ' + newIndex);
					return;
				}

				if (index !== newIndex) {
					index = newIndex;
					setActiveLink();
					updateArrows();

					if (scroll) {
						scrollToActiveGroup();
					}
				}
			};

			var updateActive = function() {
				var i = -1;
				groups.each(function() {
					var groupPos = $(this).offset().top,
						scrollPos = win.scrollTop();
					if (groupPos > scrollPos + offset) { return false }
					else { i++ }
				});
				i = Math.max(i, 0);
				setIndex(i, false);
			};

			arrowUp.click(function() { activeGroup.moveUp() });
			arrowDown.click(function() { activeGroup.moveDown() });

			var scrolling;
			win.scroll(function() {
				if (scrolling) {
					clearTimeout(scrolling);
				}
				scrolling = setTimeout(updateActive, 200);
			});

			var resizing;
			win.resize(function() {
				if (resizing) {
					clearTimeout(resizing);
				}
				resizing = setTimeout(setOffset, 200);
			});

			return {
				moveDown: function() { setIndex(index+1, true) },
				moveUp: function() { setIndex(index-1, true) },
				moveTo: function(newIndex) { setIndex(newIndex, true) }
			};

		}());

		var linksMenu = (function() {

			var SEL = {
				menu: '.menu',
				links: '.links',
				navLink: '.nav-link'
			};

			var doc = $(document),
				win = $(window),
				menu = $(SEL.menu),
				links = menu.find(SEL.links),
				linksList = links.find('ul'); 

			menu.on('click', SEL.navLink, function() { activeGroup.moveTo($(this).index()) });

			menu.on('click', SEL.links, function(e) {
				if (this !== e.target) {
					return true;
				}

				if (linksList.is(':hidden')) {
					links.addClass('on');
					linksList.fadeIn(400);
				}
				else if(links.is('.on')) {
					links.removeClass('on');
					linksList.fadeOut(400);
				}

				return false;
			});

			doc.click(function(e) {

				if (!links.is('.on')) {
					return true;
				}

				var clickedLink = $(e.target).filter(SEL.navLink)
					.add($(e.target).closest(SEL.navLink));

				if (clickedLink.length === 0) {
					linksList.removeClass('on');
					linksList.fadeOut(400);
				}
			});

			var toggleLinks = function() {
				if (links.css('cursor') !== 'pointer') {
					// Narrow screen.
					linksList.show();
					links.removeClass('on');
				}
				else if (!links.is('.on')) {
					linksList.hide();
				}
			};

			links.hover(function(e) {
				if (e.target === this) {
					$(this).addClass('hover');
				}
			}, function(e) {
				$(this).removeClass('hover');
			});

			var resizing;
			win.resize(function() {
				if (resizing) {
					clearTimeout(resizing);
				}
				resizing = setTimeout(toggleLinks, 200);
			});
		}());

		var themeMenu = (function() {

			var SEL = {
				themes: '.theme-selector',
				theme: '.theme'
			};

			var body = $('body'),
				themes = $(SEL.themes); 

			themes.on('click', SEL.theme, function() {
				var theme = $(this);
				themes.find(SEL.theme).filter('.active').removeClass('active');
				theme.addClass('active');
				body.removeClass().addClass(theme.data('theme'));
			});
		}());

	});

}());
