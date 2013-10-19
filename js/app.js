$(document).ready(function() {

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
			$('body').animate({scrollTop:pos-offset}, 600, 'swing');
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
			var i = 0;
			groups.each(function() {
				var groupPos = $(this).offset().top,
					scrollPos = win.scrollTop();
				if (groupPos + offset > scrollPos) { return false }
				else { i++ }
			});
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

		var doc = $(document),
			win = $(window),
			menu = $('.menu'),
			links = menu.find('.links'),
			linksList = links.find('ul'); 

		menu.on('click', '.nav-link', function() { activeGroup.moveTo($(this).index()) });

		menu.on('click', '.links', function(e) {
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

			var clickedLink = $(e.target).filter('.nav-link')
				.add($(e.target).closest('.nav-link'));

			if (clickedLink.length === 0) {
				linksList.removeClass('on');
				linksList.fadeOut(400);
			}
		});

		var toggleLinks = function() {
			if (links.css('cursor') !== 'pointer') {
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

});