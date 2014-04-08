// Words is responsible for handling and storing words.
var Words = (function() {
	"use strict"

	var keys = {
		WORDS: "WORDS",
		WORD_COUNT: "WORDCOUNT",
		WORD_DATES: "WORDDATES"
	};

	function logDebug(m) {Logger.log.debug("(Words) " + m)};
		
	var init = function(words) {
		if (words.length === 0) {
			Logger.log.error("No words found");
		}
		
		logDebug("init, with " + words.length + " words");
		// Store.set(keys.WORDS, words);
		sortWordsByCount(words);
		sortWordsByDate(words);
	};

	function objToArray(obj) {
		var arr = [],
			key;
		for (key in obj) {
			arr.push({word: key, count: obj[key]});
		}
		return arr;
	}

	function sortWordsByCount (words) {
		logDebug("sort words by count");
		if (!Store.contains(keys.WORD_COUNT)) {
			var wordCount_unsorted = {};

			logDebug(" count words");
			$(words).each(function () {
				if (!wordCount_unsorted[this.word]) {
					wordCount_unsorted[this.word] = 1;
				}
				else {
					wordCount_unsorted[this.word] += 1;
				}
			});

			logDebug(" put into array");
			var wordCount = objToArray(wordCount_unsorted);

			logDebug(" and sort");
			wordCount.sort(function (w1, w2) {
				return w2.count - w1.count;
			});

			Store.set(keys.WORD_COUNT, wordCount);
		}
	};

	function sortWordsByDate (words) {
		logDebug("sort words by date");
		if (!Store.contains(keys.WORD_DATES)) {

			logDebug(" sort by date");
			words.sort(function (w1, w2) {
				return w1.date - w2.date;
			});

			logDebug(" create nested array by date");
			var cd, 
				week_ms = 1000 * 60 * 60 * 24 * 7,
				wordCount = {},
				wordDates_nested = [];
			$(words).each(function (i, el) {
				var d = this.date,
					w = this.word,
					startNewWeek = d - cd >= week_ms;
				if (!cd || startNewWeek) {
					if (startNewWeek) {
						var wordCount_sorted = objToArray(wordCount);
						wordCount_sorted.sort(function (w1, w2) {
							return w2.count - w1.count;
						});
						var max = Math.min(20, wordCount_sorted.length), // TODO Is 20 good? Set in bar chart?
							date_formatted = cd.getFullYear()+"-"+leadingZero(cd.getMonth()+1)+"-"+leadingZero(cd.getDate());
						wordDates_nested.push({date: date_formatted, words: wordCount_sorted.slice(0, max)});
					}
					cd = d; // Start new week
				}

				if (!wordCount[w]) {
					wordCount[w] = 1;
				}
				else {
					wordCount[w] += 1;
				}
			});

			Store.set(keys.WORD_DATES, wordDates_nested);
		}
	};

	var getTopN = function (n) {
		var words = Store.get(keys.WORD_COUNT);
		if (!words) {
			Logger.log.error("Can't get top " + n + " words when Words have not been initialised.");
		}

		return words.slice(0, n);
	};

	function leadingZero(n) {
		return n < 10 ? "0"+n : ""+n;
	}

	return {
		init: init,
		getTopN: getTopN
	};
}());