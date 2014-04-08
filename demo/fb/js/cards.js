var Cards = (function () {
 	"use strict"

 	var containerView;

 	var init = function(container) {

 		if (containerView) {
			containerView.render();
			return;
		}

		// MODELS //

		var Card = Backbone.Model.extend();
		var Cards = Backbone.Collection.extend({ model: Card });
		var Info = Backbone.Model.extend();
		var CardsContainer = Backbone.Model.extend();

		// VIEWS //
		
		var CardView = Backbone.View.extend({
			tagName: "li",
			id: function() { return this.model.id },
			template: _.template("\
				<p><%= name %></p>\
				<img src='<%= img_url %>'>\
				"),
			initialize: function() {
				_.bindAll(this, "render", "onClick", "flipBegin", "flipEnd", "updateInfo");
			},
			render: function() {
				var card = this.model;
				this.$el.html(this.template(card.attributes));
				return this;
			},
			appendTo: function(parent) {
				this.$el.appendTo(parent);
				return this;
			},
			place: function(i, totalCount, totalWidth, callback) {
				var card = this.$el,
					duration = Math.min(100, 10000 / totalCount),
					deltaX = (totalWidth - card.width()) / totalCount,
					left = (totalCount-i)*deltaX;

				card.animate({"left": left+"px"}, 
					duration, 
					function () { callback(i+1) });
			},
			updateInfo: function() {
				var self = this;
				Facebook.load.friendMessages(
					self.model.id,
					function (statuses) {
						var i = Math.floor(Math.random()*statuses.length),
							status = statuses.length>0 ? statuses[i] : {updated_time: "", message: "I don't share my status updates."};
						self.options.info.set({name:self.model.get("name"), date:status.updated_time.substr(0,10), message:status.message});
				});
			},
			flipEnd: function() {
				var card = this.$el.addClass("active");
				card.animate({
						width: this.width,
						left: this.left
					}, 
					100, 
					this.updateInfo);
			},
			flipBegin: function() {
				var card = this.$el.addClass("front");
				this.left = card.position().left;
				this.width = card.width();
				card.animate({
						width: 0,
						left: this.left + this.width/2
					}, 
					100, 
					this.flipEnd);
			},
			onClick: function() {
				this.flipBegin();
			}
		});

		var CardCollectionView = Backbone.View.extend({
			el: function() { return $(this.options.parent).find("ul") },
			initialize: function() {
				_.bindAll(this, "render", "reset", "renderCard", "hide", "getCard", "removeActive", "onClickCard");
				this.model.bind("change", this.render);
			},
			events: {
				"click li": "onClickCard"
			},
			render: function() {
				this.reset();
				this.stop = false;
				this.renderCard(0);
			},
			reset: function() {
				this.stop = true;
				this.cardList = this.$el.empty();
				this.cardViews = {};
			},
			renderCard: function (i) {
				if (i === this.model.length || this.stop) { return; }
				var card = this.model.models[i],
					cardView = new CardView({ model: card, info: this.options.info });
				this.cardViews[card.id] = cardView;
				cardView.render()
					.appendTo(this.cardList)
					.place(i, this.model.length, this.cardList.width() - 100, this.renderCard);
			},
			hide: function() {
				$(this.el).hide();
			},
			getCard: function(cardEl) {
				return this.cardViews[cardEl.attr("id")];
			},
			removeActive: function () {
				this.$el.find("li.active").removeClass("active").removeClass("front");
			},
			onClickCard: function (e) {
				this.removeActive();
				var clickedEl = $(e.target); 
				this.getCard(clickedEl.is("li") ? clickedEl : clickedEl.closest("li")).onClick();
				return false;
			}
		});

		var InfoView = Backbone.View.extend({
			el: function() { return $(this.options.parent).find(".info") },
			initialize: function() {
				_.bindAll(this, "render", "show", "hide", "typeText", "clear");
				this.model.bind('change', this.render);
			},
			render: function() {
				this.clear().message = this.model.get("message");
				var dur = this.$el.is(":visible") ? 400 : 0;
				this.hide(dur, this.show);
			},
			typeText: function(i) {
				i = i || 1;
				if (i > this.message.length) {
					return;
				}
				var message = this.$el.find(".message"),
					text = this.message;
				var type = setTimeout(function () {
					message.text(text.substr(0, i));
				}, i*50);
				this.typing.push(type);
				
				this.typeText(i+1);
			},
			show: function (callback) {
				var infoEl = this.$el,
					container = $(this.options.parent);
				infoEl.find(".name").text(this.model.get("name"));
				infoEl.find(".date").text(this.model.get("date"));
				infoEl.css("width", Math.max(50, container.width() - 60) + "px")
					.slideDown(500, this.typeText);
			},
			hide: function(dur, callback) {
				dur = dur || 200;
				this.$el.slideUp(dur, callback);
			},
			clear: function() {
				this.cancel().$el.find(".message").text("");
				return this;
			},
			cancel: function() { 
				$(this.typing).each(function() {
					clearTimeout(this);
				});
				this.typing = [];
				
				return this; 
			}
		});

		var ContainerView = Backbone.View.extend({
			initialize: function () {
				_.bindAll(this, "render", "onClick");
				this.model.bind('change', this.render);
				this.infoView = new InfoView({ model: this.model.get("info"), parent: this.el });
				this.cardsView = new CardCollectionView({ model: this.model.get("cards"), parent: this.el, info: this.model.get("info") });
			},
			events: {
				"click": "onClick"
			},
			render: function() {
				this.cardsView.render();
			},
			unrender: function() {
				this.infoView.clear().hide(0);
				this.cardsView.reset();
			},
			onClick: function() {
				this.infoView.clear().hide();
				this.cardsView.removeActive();
			}
		});

		Facebook.load.friendsInfo(function(friends){
			// Create models
			var allCards = [];
			$(friends).each(function() {
				var friend = {
					id: this.id,
					name: this.name,
					img_url: this.picture.data.url
				};
				allCards.push(new Card(friend));
			});

			var info = new Info({name:"",date:"",message:""}),
				cards = new Cards(allCards),
				cardsContainer = new CardsContainer({ info: info, cards: cards });

			// Create root view and render.
			containerView = new ContainerView({ model: cardsContainer, el: container });
			containerView.render();
		});

		return this;
	};

	var render = function() {
		containerView.render();
	};

	var unrender = function() {
		containerView.unrender();
	};

	return {
		init: init,
		render: render,
		unrender: unrender
	};

}());