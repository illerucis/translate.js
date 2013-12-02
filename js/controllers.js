var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope) {
    $scope.idText = {};

    $scope.previousHighlightLength = 0;

    $scope.matchStrings = function(fullText, highlightedText) {

	var matchObject = {};
	var i, j, start;
	i = j = start = 0;

	while ( i < fullText.length && j < highlightedText.length ) {
	    j = 0;
	    start = i;
	    while ( ( fullText.charAt(i) == highlightedText.charAt(j) ) && 
		    ( i < fullText.length && j < highlightedText.length ) ) {
		i++;
		j++;
	    }
	    if (j == highlightedText.length) break;
	    i++;
	}
	return { "start": start, "end": i };

    };

    $scope.startOk = function(fullText, matchObject) {
	return matchObject.start == 0 || fullText.charAt(matchObject.start - 1) == ' ';
    }

    $scope.endOk = function(fullText, matchObject) {
	return matchObject.end == fullText.length - 1 || 
	    fullText.charAt(matchObject.end + 1) == ' ';
    }

    $scope.parseTranslationElements = function(fullText, match) {

	while ( ( ! $scope.startOk(fullText, match) ) && match.start < match.end ) {
	    match.start++;
	}

	while ( ( ! $scope.endOk(fullText, match) ) && match.end > -1 ) {
	    match.end--;
	}

	return { 
	    "beginning": fullText.slice(0, match.start),
	    "middle"   : fullText.slice(match.start, match.end + 1),
	    "end"      : fullText.slice(match.end + 1, fullText.length)
	};

    }

    $scope.getReplacementText = function(translation) {
	
    }

    $scope.translateText = function(event) {

	// get the full text, highlighted text, containing element
	var fullText = event.target.textContent;
	var highlightedText = window.getSelection().toString();
	var elementId = event.target.id;

	if ( highlightedText.length > 0 && 
	     highlightedText.length != $scope.previousHighlightLength ) {

	    $scope.previousHighlightLength = highlightedText.length;
	    
	    // an object representing the start and end position of the highlighted text
	    var match = $scope.matchStrings(fullText, highlightedText);

	    // line up the highlighted text with the full text in a matchObject
	    var translation = $scope.parseTranslationElements(fullText, match);
	    console.log(translation);	    
	    // if a valid translation is possible, hit the API
	    if (translation.middle) {
		replacementText = $scope.getReplacementText(translation);
	    }

	}

    };
});
