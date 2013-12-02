var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope) {

    $scope.previousTranslations = []

    $scope.originalText = "translate me.";
    $scope.translatedText = "";
    $scope.leftOverText = $scope.originalText;

    $scope.previousHighlightLength = 0;

    $scope.stubbedOutTranslator = {
	"translate"     : "oversette",
	"me."           : "meg",
	"translate me." : "oversette meg.",
    };

    $scope.matchStrings = function(fullText, highlightedText) {
	return 
    };

    $scope.startOk = function(fullText, matchObject) {
	return matchObject.start == 0 || fullText.charAt(matchObject.start - 1) == ' ';
    }

    $scope.endOk = function(fullText, matchObject) {
	return matchObject.end == fullText.length - 1 || 
	    fullText.charAt(matchObject.end + 1) == ' ';
    }

    $scope.parseTranslationElements = function(fullText, highlightedText) {

	var start = fullText.indexOf(highlightedText);
	var end = start + highlightedText.length;

	while ( ( ! $scope.startOk(fullText, match) ) && match.start < match.end )
	    match.start++;

	while ( ( ! $scope.endOk(fullText, match) ) && match.end > -1 )
	    match.end--;

	return { 
	    "beginning": fullText.slice(0, match.start),
	    "middle"   : fullText.slice(match.start, match.end + 1),
	    "end"      : fullText.slice(match.end + 1, fullText.length)
	};

    }
    $scope.findPreviousTranslation = function(translation) {
	for (var i = 0; i < $scope.previousTranslations.length; i++) {
	    var t = $scope.previousTranslations[i];
	    if (t.translatedText == translation) {
		return i;
	    }
	}
	return -1;
    }

    $scope.translateText = function() {

	// get the full text, highlighted text, containing element
	var highlightedText = window.getSelection().toString();

	if ( highlightedText.length > 0 && 
	     highlightedText.length > $scope.previousHighlightLength ) {

	    $scope.previousHighlightLength = highlightedText.length;
	    
	    // an object representing the start and end position of the highlighted text
	    var translation = $scope.parseTranslationElements(fullText, highlightedText);

	    // if a valid translation is possible, hit the API
	    if (translation.middle) {
		replacementText = $scope.getReplacementText(translation);
		event.target.textContent = replacementText;
	    }
	}
	else {
	    $scope.translatedText = "";
	    $scope.leftOverText = $scope.originalText;
	}
    };
});

// the new idea is to store three variables - the original text, the translated text
// due to highligthing a word, and the left over text (original - translated)
// always display translated + leftover. when there's no highlighted text, 
// 
