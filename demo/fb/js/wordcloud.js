var WordCloud = (function () {
	"use strict"

	var sel;

	var init = function (selectors) {
		if (!sel) {
			sel = selectors;
			sel.searchfield = "#search_field";
			sel.tooltip = "#tooltip";

			$(sel.limit_arrow).click(onArrowClick);
			$(sel.limit).change(createWordCloud);
			$(sel.limit).keyup(function (e) { if (e.which === 13) $(this).blur(); }); //Enter
			$(sel.search).click(toggleSearchField);
			$(sel.id).on("mouseenter", "text", showTooltip);
			$(sel.id).on("mouseleave", "content, text", hideTooltip);
		}

		return this;
	};

	var render = function () {
		createWordCloud();

		return this;
	};

	var onArrowClick = function () {
		var val = $(sel.limit).val();
		val = parseInt(val);
		if ($(this).hasClass("up")) {
			val+=10;
		} else if ($(this).hasClass("down")) {
			val-=10;
		}
		$(sel.limit).val(val).change();
	};

	function createWordCloud() {
		Progress.start("Creating visualisation...");
		Progress.update(20);
		setTimeout(create, 100);

		var w, h;

		function create() {
			$("svg").remove();

			var vis = $(sel.id),
				n = parseInt($(sel.limit).val()),
				topWords = Words.getTopN(n),
				maxSize = topWords[0].count;

			w = vis.width();
		  	h = vis.height();

		  	Progress.update(40);

			d3.layout.cloud().size([w, h])
		      .words(topWords.map(function(d) {
		      	return {text: d.word, count: d.count}
		      }))
		      .padding(5)
		      .rotate(function() { 
		      	return ~~(Math.random() * 2) * 90; 
		      })
		      .font("Impact")
		      .fontSize(function(d) { 
		      	return ~~(60*d.count / maxSize) + 15; // min 15, max 75 
		      })
		      .on("end", draw)
		      .start();
		}

		function draw(words) {
			Progress.update(60, "Drawing visualisation...");

			setTimeout(drawCloud, 100);

			function drawCloud() {
			    d3.select(sel.id + " .content").append("svg")
			        .attr("width", "100%")
			        .attr("height", "100%")
			        .attr("viewBox", "0 0 "+w+" "+h)
			      .append("g")
			        .attr("transform", "translate("+w/2+","+h/2+")")
			        .attr("class", "word-cloud")
			      .selectAll("text")
			        .data(words)
			      .enter().append("text")
			        .style("font-size", function(d) { 
			        	return d.size + "px"; 
			        })
			        .attr("count", function (d) {
			        	return d.count;
			        })
			        .attr("text-anchor", "middle")
			        .attr("transform", function(d) {
			          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			        })
			        .text(function(d) { 
			        	return d.text; 
			        });

			        highlight();
			        Progress.end();
			    }
		}
	}

	function highlight() {
		var searchField = $(sel.searchfield),
    		searchText = searchField.length === 0 ? "" : searchField.val();
    	$(sel.id + " .content svg text").each(function () {
    		var on = searchText.length > 0 && $(this).text().match(searchText) !== null;
    		var cl = on ? "highlight" : "";
    		$(this).attr("class", cl);
    	});
	}

	function createSearchField() {
		return $("<input id='search_field' class='search-field' type='text' max='20' />")
			.appendTo($(sel.id))
			.keyup(searchTextChanged);
	}

	function searchTextChanged(e) {
		if (e.which === 27) {
				// Esc
				$(this).val("").change().blur();
				toggleSearchField();
				highlight();
				return false;
			}

			highlight();
	}

	function toggleSearchField() {
		var searchField = $(sel.searchfield);
		if (searchField.length === 0) {
			searchField = createSearchField();
		}

		var searchIcon = $(sel.search);
		if (searchField.is(":hidden")) {
			var searchOffset = searchIcon.offset(),
				parentOffset = $(sel.id).offset(),
				left = searchOffset.left - parentOffset.left + searchIcon.width(),
				top = searchOffset.top - parentOffset.top;
			searchIcon.attr("title", "Hide search field");
			searchField.css({
					left: left+"px",
					top: top+"px"})
				.show()
				.focus()
				.animate({width: "150px"}, 400);
		} 
		else {
			searchIcon.attr("title", "Search for words");
			searchField.animate({width: "0px"}, 400, function () {$(this).hide()});
		}
	}

	function createTooltip() {
		return $("<div id='tooltip' class='tooltip'></div>")
			.appendTo($(sel.id))
			.mouseleave(hideTooltip);
	}

	function showTooltip(e) {
		var tooltip = $(sel.tooltip);
		if (tooltip.length === 0) {
			tooltip = createTooltip();
		}

		var textObj = $(this),
			text = textObj.attr("count"),
			parentOffset = $(sel.id).offset(),
			textOffset = textObj.offset(),
			left = Math.max(0, textOffset.left-tooltip.width()-parentOffset.left-5),
			top = Math.max(0, textOffset.top-tooltip.height()-parentOffset.top-5);

		tooltip.text(text)
			.css({
				"left": left+"px",
				"top": top+"px"
			})
			.show();
	}

	function hideTooltip(e) {
		if (!e.toElement || e.toElement.id !== "tooltip") {
			$(sel.tooltip).hide();
		}
	}

	return {
		init: init,
		render: render
	};
	
}());