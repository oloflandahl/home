var BarChart = (function () {
  "use strict"

  var sel, chart, x, y, barUnit,
    c = -1,
    speed = 0,
    isUpdating = false,
    leftMargin = 120,
    rightMargin = 50,
    classes = {
      count: "count",
      word: "word",
      active: "active"
    };

  var logDebug = function (m) { Logger.log.debug("(Bars) " + m); };

  var init = function (selectors) {

    sel = selectors;

    chart = d3.select(sel.id + " .content").append("svg")
        .attr("class", "chart")
        .attr("width", "100%")
        .attr("height", "100%");

    x = d3.scale.linear(),
    y = d3.scale.ordinal();

    $(sel.date_arrow).click(function () {
      $(sel.date_arrow).filter("."+classes.active).removeClass(classes.active);
      var btn = $(this);
      if (btn.hasClass("play")) { btn.addClass(classes.active); play(); }
      else if (btn.hasClass("ff")) { btn.addClass(classes.active); ff(); }
      else if (btn.hasClass("pause")) { btn.addClass(classes.active); pause(); }
      else if (btn.hasClass("stop")) { stop() }
    });

    return this;
  };

  var render = function () {
    update(1, true);
  }

  var reset = function () {
    stop();
  };

  function update(jump, first) {

    logDebug("Start updating");

    if (isUpdating || jump === 0) {
      logDebug("Abort update");
      return;
    }

    var resetBars = false;
    if (speed < 0) {
      jump = 1;
      speed = 0;
      resetBars = true;
    }

    isUpdating = true;

    var content = $(sel.id + " .content"),
        width = content.width(),
        height = content.height(), 
        delay = 0;

    // Update view size
    chart.attr("viewBox", "0 0 "+width+" "+height);

    // Help methods
    function getTextY() { return y.rangeBand() / 2 }
    function getWord(d) { 
      return d.word 
    }
    function getWordX() { return -10 }
    function getCount(d) { return d.count }
    function getCountX(d) { return Math.max(7, getBarWidth(d) - 5) }
    function getBarWidth(d) { return Math.max(30, barUnit * d.count) }
    function getBarHeight() { return y.rangeBand() }
    function translateBar(d, i) { return "translate(" + leftMargin + "," + y(i) + ")" }
    function incrDelay(d, i) {  
      delay += 50*durRate; 
      return delay; 
    }

    // Update data
    var dateData = getData(jump),
      data = dateData.words,
      barUnit = (width - leftMargin - rightMargin) / data[0].count;

    // Update date
    var date = getDateString(new Date(dateData.date));
    $(sel.date).html(date);

    // Update sort map
    var sortMap = d3.range(data.length),
      map = d3.range(data.length);
    sortMap.sort(function(i, j) { return data[j].count - data[i].count; });

    x.range([0, width])
      .domain([0, d3.max(data, getCount)]);

    y.rangeRoundBands([0, height], .1)
      .domain(sortMap);

    var bars = chart.selectAll(".bar")
        .data(data, getWord); // Set data + key binding

    var durRate = 1/jump;

    // Remove expired bars
    var durExpWidth = first ? 0 : 1000*durRate;
    var expBars = bars.exit();
    expBars.select("rect").transition()
          .duration(durExpWidth)
          .attr("width", "0px");
    
    setTimeout(function() { expBars.remove() }, durExpWidth);

    delay += durExpWidth;

    // Update width of existing bars
    var durExistWidth = first ? 0 : 1000*durRate;
    bars.select("rect")
      .attr("class", resetBars ? "new" : "old")
      .transition()
        .delay(delay)
        .duration(durExistWidth)
        .attr("width", getBarWidth);

    bars.select("text.count")
      .transition()
        .delay(delay)
        .duration(durExistWidth)
        .attr("x", getCountX)
        .text(getCount);

    delay += durExistWidth;

    // Update vertical position and height of existing bars
    var durExistY = first ? 0 : 1000*durRate;
    bars.transition()
        .duration(durExistY)
        .delay(incrDelay)
        .attr("transform", translateBar);

    bars.select("rect").transition()
      .duration(durExistY)
      .delay(delay)
      .attr("height", getBarHeight);

    bars.selectAll("text").transition()
      .duration(durExistY)
      .delay(delay)
      .attr("y", getTextY);

    delay += durExistY;

    // Add new bars and update width and texts
    var newBars = bars.enter().append("g")
        .attr("class", "bar")
        .attr("transform", translateBar);

    delay -= 100*durRate;
    var durNew = 1000*durRate;
    newBars.append("rect")
            .attr("class", "new")
            .attr("width", 0)
            .attr("height", getBarHeight)
            .transition()
              .duration(durNew)
              .delay(delay)
              .attr("width", getBarWidth);

    newBars.append("text")
        .attr("class", "word")
        .attr("x", getWordX)
        .transition()
          .delay(delay)
          .text(getWord);

    delay += durNew;

    newBars.append("text")
        .attr("class", "count")
        .attr("x", getCountX)
        .transition()
          .delay(delay)
          .text(getCount);

    newBars.selectAll("text")
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .attr("y", getTextY);

    setTimeout(function () {
      isUpdating = false;
      logDebug("Finished updating");
      setTimeout(function () {update(speed)}, 1000*durRate);
    }, delay);
  };

  function play() {
    speed = 1;
    update(speed);
  }

  function ff() {
    speed = 5;
    update(speed);
  }

  function pause() {
    speed = 0;
  }

  function stop() {
    chart.empty();
    speed = -1;
    c = -1;
    update(speed);
  }

  var getData = function (jump) {
    var allData = Store.get("WORDDATES");
    c += jump;
    c = Math.min(allData.length - 1, c);
    c = Math.max(0, c);

    return allData[c];
  };

  function leadingZero(n) {
    return n < 10 ? "0"+n : ""+n;
  }

  function getDateString(d) {
    var month = leadingZero(d.getMonth() + 1);
    var date = leadingZero(d.getDate());
    return d.getFullYear() + "<br>" + date + "/" + month;
  }

  return {
    init: init,
    render: render,
    reset: reset
  };

}());