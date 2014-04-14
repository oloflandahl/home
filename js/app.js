/*! jQuery Mobile v1.4.0 | Copyright 2010, 2013 jQuery Foundation, Inc. | jquery.org/license */
(function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,n,r){function T(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function N(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=T(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function C(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function k(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function L(){g=!1}function A(){g=!0}function O(){E=0,v.length=0,m=!1,A()}function M(){L()}function _(){D(),c=setTimeout(function(){c=0,O()},e.vmouse.resetTimerDuration)}function D(){c&&(clearTimeout(c),c=0)}function P(t,n,r){var i;if(r&&r[t]||!r&&k(n.target,t))i=N(n,t),e(n.target).trigger(i);return i}function H(t){var n=e.data(t.target,s),r;!m&&(!E||E!==n)&&(r=P("v"+t.type,t),r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation()))}function B(t){var n=T(t).touches,r,i,o;n&&n.length===1&&(r=t.target,i=C(r),i.hasVirtualBinding&&(E=w++,e.data(r,s,E),D(),M(),d=!1,o=T(t).touches[0],h=o.pageX,p=o.pageY,P("vmouseover",t,i),P("vmousedown",t,i)))}function j(e){if(g)return;d||P("vmousecancel",e,C(e.target)),d=!0,_()}function F(t){if(g)return;var n=T(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=C(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&P("vmousecancel",t,s),P("vmousemove",t,s),_()}function I(e){if(g)return;A();var t=C(e.target),n,r;P("vmouseup",e,t),d||(n=P("vclick",e,t),n&&n.isDefaultPrevented()&&(r=T(e).changedTouches[0],v.push({touchID:E,x:r.clientX,y:r.clientY}),m=!0)),P("vmouseout",e,t),d=!1,_()}function q(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function R(){}function U(t){var n=t.substr(1);return{setup:function(){q(this)||e.data(this,i,{});var r=e.data(this,i);r[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,H),e(this).bind(n,R),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",B).bind("touchend",I).bind("touchmove",F).bind("scroll",j))},teardown:function(){--l[t],l[t]||b.unbind(n,H),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",B).unbind("touchmove",F).unbind("touchend",I).unbind("scroll",j));var r=e(this),s=e.data(this,i);s&&(s[t]=!1),r.unbind(n,R),q(this)||r.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S,x;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(x=0;x<o.length;x++)e.event.special[o[x]]=U(o[x]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)})(e,t,n),function(e){e.mobile={}}(e),function(e,t){var r={touch:"ontouchend"in n};e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,t,r){function l(t,n,r){var i=r.type;r.type=n,e.event.dispatch.call(t,r),r.type=i}var i=e(n),s=e.mobile.support.touch,o="touchmove scroll",u=s?"touchstart":"mousedown",a=s?"touchend":"mouseup",f=s?"touchmove":"mousemove";e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)}),e.event.special.scrollstart={enabled:!0,setup:function(){function s(e,n){r=n,l(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(o,function(t){if(!e.event.special.scrollstart.enabled)return;r||s(t,!0),clearTimeout(i),i=setTimeout(function(){s(t,!1)},50)})},teardown:function(){e(this).unbind(o)}},e.event.special.tap={tapholdThreshold:750,emitTapOnTaphold:!0,setup:function(){var t=this,n=e(t),r=!1;n.bind("vmousedown",function(s){function a(){clearTimeout(u)}function f(){a(),n.unbind("vclick",c).unbind("vmouseup",a),i.unbind("vmousecancel",f)}function c(e){f(),!r&&o===e.target?l(t,"tap",e):r&&e.stopPropagation()}r=!1;if(s.which&&s.which!==1)return!1;var o=s.target,u;n.bind("vmouseup",a).bind("vclick",c),i.bind("vmousecancel",f),u=setTimeout(function(){e.event.special.tap.emitTapOnTaphold||(r=!0),l(t,"taphold",e.Event("taphold",{target:o}))},e.event.special.tap.tapholdThreshold)})},teardown:function(){e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),i.unbind("vmousecancel")}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,start:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t;return{time:(new Date).getTime(),coords:[n.pageX,n.pageY],origin:e(t.target)}},stop:function(e){var t=e.originalEvent.touches?e.originalEvent.touches[0]:e;return{time:(new Date).getTime(),coords:[t.pageX,t.pageY]}},handleSwipe:function(t,n,r,i){if(n.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-n.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-n.coords[1])<e.event.special.swipe.verticalDistanceThreshold){var s=t.coords[0]>n.coords[0]?"swipeleft":"swiperight";return l(r,"swipe",e.Event("swipe",{target:i,swipestart:t,swipestop:n})),l(r,s,e.Event(s,{target:i,swipestart:t,swipestop:n})),!0}return!1},setup:function(){var t=this,n=e(t);n.bind(u,function(r){function l(n){if(!s)return;i=e.event.special.swipe.stop(n),u||(u=e.event.special.swipe.handleSwipe(s,i,t,o)),Math.abs(s.coords[0]-i.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&n.preventDefault()}var i,s=e.event.special.swipe.start(r),o=r.target,u=!1;n.bind(f,l).one(a,function(){u=!0,n.unbind(f,l)})})},teardown:function(){e(this).unbind(u).unbind(f).unbind(a)}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)},teardown:function(){e(this).unbind(n)}}})}(e,this)});

// App
(function() {
	'use strict';

	// JQuery function for adding touch effects on mobile.
	$.fn.addTouchHandler = function() {
		var el = $(this);
		el.on('touchstart', function() { $(this).addClass('touching') });
		el.on('touchend', function() { $(this).removeClass('touching') });
	};

	$(document).ready(function() {

		// Lazy load images when all content has loaded
		$(window).load(function() {
			setTimeout(function() {
			$('img:not("[src]")').each(function() {
				var image = $(this);
				image.hide()
					.attr('src', image.data('src'))
					.fadeIn(400);
			})}, 1000);
		});

		$('.group li, .links li, .contact, .arrow, .close-btn').addTouchHandler();
		$('.group').on('swiperight', 'li', function() { $(this).removeClass('swiped') });
		$('.group').on('swipeleft', 'li', function() { $(this).addClass('swiped') });

		var activeGroup = (function() {

			var	offset,
				index = 0, 
				win = $(window),
				doc = $(document),
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
				var scrollPos = win.scrollTop(),
					offsetScrollPos = scrollPos + offset,
					bottomScroll = doc.height() - win.height(),
					middleScroll = offsetScrollPos + (win.height() - offset) / 2;

				var newIndex = -1;
				if (scrollPos > bottomScroll - 10) {
					newIndex = bounds.max;
				} 
				else {
					groups.each(function(i) {
						var groupPos = $(this).offset().top;
						if (Math.abs(groupPos - offsetScrollPos) < 50) { newIndex++; return false; }
						else if (groupPos > offsetScrollPos && groupPos - middleScroll > 0) { return false }
						else { newIndex++ }
					});
					newIndex = Math.max(newIndex, 0);
				}
				
				setIndex(newIndex, false);
			};

			arrowUp.click(function() { activeGroup.moveUp() });
			arrowDown.click(function() { activeGroup.moveDown() });

			var scrolling;
			win.scroll(function() {
				if (scrolling) {
					clearTimeout(scrolling);
				}
				scrolling = setTimeout(updateActive, 100);
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
				navLinks = menu.find(SEL.navLink),
				linksList = links.find('ul');

			var cachedIndex =  linksList.find(SEL.navLink).filter('.active').index(),
				cancelScroll = false;

			menu.on('click', SEL.navLink, function() { 
				var index = $(this).index();
				cachedIndex = index;
				activeGroup.moveTo(index);
			});

			menu.on('click', SEL.links, function(e) {
				if (!linksList.is(':visible')) {
					links.addClass('on');
					linksList.fadeIn(FADE_DUR);
				}
				else if(links.is('.on')) {
					var delay = this !== e.target ? FADE_DUR + 200 : 0;
					setTimeout(function() {
						links.removeClass('on');
						linksList.fadeOut(FADE_DUR);
					}, delay);
					
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

			themes.on('click', SEL.theme, function() { 
				setTheme(this, true, true);
				$(this).removeClass('pulse');
			});
			themes.on('mouseenter', SEL.theme, function() { 
				if ($(this).hasClass('active')) {
					return;
				}
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

			var body = $('body'),
				overlay = $(SEL.overlay),
				loadingClass = 'loading',
				lockClass = 'scroll-lock',
				oContent = overlay.find(SEL.content),
				closeButton = overlay.find(SEL.close);

			var show = function() {
				body.addClass(lockClass);
				oContent.html('').addClass(loadingClass);
				$(SEL.overlay).fadeIn(FADE_DUR);
			};

			var update = function(markup) {
				oContent.html(markup).removeClass(loadingClass);
			};

			var hide = function() {
				body.removeClass(lockClass);
				$(SEL.overlay).fadeOut(FADE_DUR);
			};

			closeButton.click(hide);

			$(document).keyup(function(e) {
				if (e.which === 27) {
					hide();
				}
			});

			return {
				show: show,
				update: update,
				hide: hide
			};

		}());

		var content = (function() {

			var BASE_PATH = 'js/content';
			
			var SEL = {
				container: '#container',
				group: '.group',
				linksGroup: '#links',
				groupItem: '.group li',
				icon: '.icon'
			};

			var PARTIAL_TEMPLATES = {
				top: function(type) {
					var coursePre = type === 'course' ? 'Course: ' : '';
					return '<div class="top">'+
						'<div class="<%= iconClass %>"></div>'+
						'<div class="header">'+
							'<h2><%= title %></h2>'+
							'<ul>'+
								'<li>'+coursePre+'<%= project.'+type+' %></li>'+
								'<li><%= project.tech.join(", ") %></li>'+
								'<li><%= project.date %></li>'+
							'</ul>'+
						'</div>'+
					'</div>'
				},
				description:
					'<p><%= project.description %></p>',
				links: 
					'<ul>'+
						'<% $(project.links).each(function() { %>'+
							'<li><a href="<%= this.url %>" target="_BLANK"><%= this.text %></a> <%= this.description %></li>'+
						'<% }) %>'+
					'</ul>'
			};

			var TEMPLATES = {
				project:
					PARTIAL_TEMPLATES.top('type')+
					PARTIAL_TEMPLATES.description+
					'<% var unsuppText = ""; if (project.unsupported.browsers.length > 0) { %>'+
						'<% unsuppText = " (Not supported: "+project.unsupported.browsers.join(\", \")+")"; %>'+
					'<% } %>'+
					'<% if (project.unsupported.mobile) { %>'+
						'<p class="is-mobile-hidden"><a href="<%= project.demoUrl %>">RUN DEMO</a> <%= unsuppText %></p>'+
						'<p class="alert is-desktop-hidden">Unfortunately, this app does not support mobile displays</p>'+						
					'<% } else { %>'+
						'<p><a href="<%= project.demoUrl %>" target="_BLANK">RUN DEMO</a> <%= unsuppText %></p>'+
					'<% } %>'+
					PARTIAL_TEMPLATES.links,
				course:
					PARTIAL_TEMPLATES.top('course')+
					PARTIAL_TEMPLATES.description+
					PARTIAL_TEMPLATES.links,
				employment:
					PARTIAL_TEMPLATES.top('type')+
					PARTIAL_TEMPLATES.description+
					PARTIAL_TEMPLATES.links,
				picasa:
					// '<div class="top-over"><h2><%= title %></h2></div>'+
					'<embed type="application/x-shockwave-flash"'+
						'bgcolor="#000000"'+
						'src="https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf"'+
						'width="100%" height="100%"'+
						'flashvars="host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F113241056971667725100%2Falbumid%2F<%= album.id %>%3Falt%3Drss%26kind%3Dphoto%26authkey%<%= album.key %>%26hl%3Den_US"'+
						'pluginspage="http://www.macromedia.com/go/getflashplayer">'+
						// '<p>Flash is not installed. Click <a href="https://plus.google.com/photos/113241056971667725100/albums/<%= album.id %>?authkey=<%= album.key %>">here</a> to see the album.'+
					'</embed>',
				music:
					'<div class="top">'+
						'<div class="icon <%= iconClass %>"></div>'+
						'<div class="header">'+
							'<h2><%= title %></h2>'+
							'<ul>'+
								'<% $(members).each(function() { %>'+
									'<li><%= this %></li>'+
								'<% }) %>'+
							'</ul>'+
						'</div>'+
					'</div>'+
					'<p><%= description %></p>'+
					'<a href="<%= url %>" target="_BLANK">Listen</a> (external link)',
				cv:
					'<object class="pdf-container" data="<%= url %>#toolbar=1&amp;navpanes=0&amp;scrollbar=1&amp;page=1&amp;pagemode=thumbs&amp;view=Fit" type="application/pdf" width="100%" height="100%">'+
						'<p>Unfortunately you do not have a PDF plugin for this browser. To view the CV, click <a href="<%= url %>">here</a>.</p>'+
					'</object>'
			};

			var container = $(SEL.container);

			container.on('click', SEL.groupItem, function(e) {
				if ($(this).closest(SEL.linksGroup).length > 0) {
					return;
				}

				e.preventDefault();

				var item = $(this),
					itemId = item.attr('id'),
					groupId = item.closest(SEL.group).attr('id'),
					url = [BASE_PATH, groupId, itemId].join('/')+'.json',
					icon = item.find(SEL.icon).get(0),
					iconClass = icon ? (icon.classList ? icon.classList[0] + ' ' + icon.classList[1] : icon.className) : null;

				overlay.show();
				$.getJSON(url, function(data) {
					data.iconClass = data.iconClass || iconClass;

					var template = TEMPLATES[data.type];
					overlay.update(_.template(template, data));
				});
			});

		}());

	});

}());