(function() {
	'use strict';

	// JQuery function for adding touch effects on mobile.
	$.fn.addTouchHandler = function() {
		var el = $(this);
		el.on('touchstart', function() { $(this).addClass('touching') });
		el.on('touchend', function() { $(this).removeClass('touching') });
	};

	$(document).ready(function() {

		$('.group li, .links li, .contact, .arrow, .close-btn').addTouchHandler();

		var activeGroup = (function() {

			var	offset,
				index = 0, 
				win = $(window),
				body = $('body'),
				menu = $('#menu'),
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
				var pos = groups.eq(index).offset().top + 1;
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
				menu: '#menu',
				links: '.links',
				navLink: '.nav-link'
			};

			var FADE_DUR = 400;

			var doc = $(document),
				win = $(window),
				menu = $(SEL.menu),
				links = menu.find(SEL.links),
				linksList = links.find('ul');

			var cachedIndex =  linksList.find(SEL.navLink).filter('.active').index(),
				cancelScroll = false;

			menu.on('click', SEL.navLink, function() { 
				var index = $(this).index();
				cachedIndex = index;
				activeGroup.moveTo(index);
			});

			menu.on('mouseenter', SEL.navLink, function() {
				var thisLink = $(this);
				activeGroup.moveTo(thisLink.index());
				cancelScroll = true;
				thisLink.addClass('pulse');
			});

			menu.on('mouseleave', SEL.navLink, function(e) {
				cancelScroll = false;
				setTimeout(function() { 
					if (!cancelScroll) {
						activeGroup.moveTo(cachedIndex);
					}
				}, 100);
				$(this).removeClass('pulse');
			});

			menu.on('click', SEL.links, function(e) {
				if (this !== e.target) {
					return true;
				}

				if (!linksList.is(':visible')) {
					links.addClass('on');
					linksList.fadeIn(FADE_DUR);
				}
				else if(links.is('.on')) {
					links.removeClass('on');
					linksList.fadeOut(FADE_DUR);
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
					linksList.fadeOut(FADE_DUR);
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

			var cachedTheme = themes.find(SEL.theme).filter('.active').data('theme');

			var setTheme = function(target, activate, cache) {
				var theme = $(target),
					newTheme;
				if (activate) {
					newTheme = theme.data('theme');
					themes.find('.active').removeClass('active');
					theme.addClass('active');
				} else {
					newTheme = cachedTheme;
					theme.removeClass('active');
					themes.find('[data-theme='+cachedTheme+']').addClass('active');
				}

				if (cache) { cachedTheme = newTheme }
				body.removeClass().addClass(newTheme);
			};

			themes.on('click', SEL.theme, function() { setTheme(this, true, true) });
			themes.on('mouseenter', SEL.theme, function() { 
				setTheme(this, true, false);
				$(this).addClass('pulse');
			});
			themes.on('mouseleave', SEL.theme, function() { 
				setTheme(this, false, false); 
				$(this).removeClass('pulse');
			});

		}());

		var overlay = (function () {

			var FADE_DUR = 400;
			
			var SEL =  {
				overlay: '#overlay',
				content: '.content',
				close: '.close-btn'
			};

			var overlay = $(SEL.overlay),
				content = overlay.find(SEL.content),
				closeButton = overlay.find(SEL.close);

			var show = function(markup) {
				content.html('');
				$.when( $(SEL.overlay).fadeIn(FADE_DUR) )
					.then(function() {
						content.html(markup);
					});
			};

			var hide = function() {
				$(SEL.overlay).fadeOut(FADE_DUR);
			};

			closeButton.click(hide);

			return {
				show: show,
				hide: hide
			};

		}());

		var content = (function() {

			var BASE_PATH = 'js/content';
			
			var SEL = {
				container: '#container',
				group: '.group',
				groupItem: '.group li'
			};

			var TEMPLATE = {
				text: "<h2><%= title %></h2><p><%= description %></p>"
			};

			var container = $(SEL.container);

			container.on('click', SEL.groupItem, function() {
				var item = $(this),
					itemId = item.attr('id'),
					groupId = item.closest(SEL.group).attr('id'),
					url = [BASE_PATH, groupId, itemId].join('/')+'.js';

				$.getJSON(url, function(data) {
					overlay.show(_.template(TEMPLATE.text, data));
				});
			});

		}());

	});

}());