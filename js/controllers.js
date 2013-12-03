var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope) {

    $scope.originalText = "translate me.";
    $scope.translatedText = "";
    $scope.leftOverText = $scope.originalText;

    $scope.previousMatch = { "start": -1, "end": -1, "padding": 0 };

    $scope.previousHighlightLength = 0;

    $scope.stubbedOutTranslator = {
	"translate"     : "oversett",
	"translate "    : "oversett ",
	"translate me." : "oversett meg."
    };

    $scope.startOk = function(start) {
	return start == 0 || 
	    $scope.originalText.charAt(start - 1) == ' ';
    }

    $scope.endOk = function(end) {
	return end == $scope.originalText.length - 1 || 
	    $scope.originalText.charAt(end + 1) == ' ';
    }

    $scope.updateMatchIndexes = function(newEnd) {
	$scope.previousMatch["end"] = newEnd;
    }

    $scope.getPreviousWords = function() {
	if ($scope.previousMatch) {
	    return $scope.originalText.slice($scope.previousMatch["start"], 
					     $scope.previousMatch["end"]);
	}
	else { return ""; }
    }

    $scope.getNewWords = function(matchIndexes) {
	if ($scope.previousMatch) {
	    return $scope.originalText.slice($scope.previousMatch["end"], 
					     matchIndexes["end"]);
	}
	else {
	    return $scope.originalText.slice(matchIndexes["start"], matchIndexes["end"]);
	}
    }

    
    $scope.getWordsToTranslate = function(matchIndexes) {
	return $scope.originalText.slice(matchIndexes.start, matchIndexes.end + 1);
    }

    $scope.saveIndexesAndPadding = function(matchIndexes, padding) {
	$scope.previousMatch["start"] = matchIndexes.start;
	$scope.previousMatch["end"] = matchIndexes.end;
	$scope.previousMatch["padding"] = padding;
    }

    $scope.setTranslation = function(matchIndexes) {
	
	var wordsToTranslate = $scope.getWordsToTranslate(matchIndexes);
	var translation = $scope.stubbedOutTranslator[wordsToTranslate];
	var padding = translation.length - wordsToTranslate.length;

	$scope.translatedText = translation;
	$scope.leftOverText = $scope.originalText.slice(matchIndexes["end"] + 1);
	
	$scope.saveIndexesAndPadding(matchIndexes, padding);

    }

    $scope.findMatchIndexes = function(highlightedText) {

	var start;

	if ($scope.previousMatch["start"] > 0) 
	    start = $scope.previousMatch.start; 
	else 
	    start = $scope.originalText.indexOf(highlightedText); 

	var end = start + highlightedText.length - 1 - $scope.previousMatch.padding;

	while ( ( ! $scope.startOk(start) ) && start < end )
	    start++;

	while ( ( ! $scope.endOk(end) ) && end > 0 )
	    end--;

	return { "start": start, "end": end };

    }


    $scope.translateText = function() {

	// get the full text, highlighted text, containing element
	var highlightedText = window.getSelection().toString();

	if ( highlightedText.length > 0 && 
	     highlightedText.length > $scope.previousHighlightLength ) {

	    $scope.previousHighlightLength = highlightedText.length;	    

	    // an object representing the adjusted match indexes of the highlighted text
	    var matchIndexes = $scope.findMatchIndexes(highlightedText);

	    // given the adjusted indexes (if valid), set the translation
	    if (matchIndexes.start < matchIndexes.end) {
	    	$scope.setTranslation(matchIndexes);
	    }

	}
	else if (highlightedText == "") {
	    $scope.translatedText = "";
	    $scope.leftOverText = $scope.originalText;
	    $scope.previousMatch = { "start": -1, "end": -1, "padding": 0 };
	}



    };
});

// the new idea is to store three variables - the original text, the translated text
// due to highligthing a word, and the left over text (original - translated)
// always display translated + leftover. when there's no highlighted text, 
// 
