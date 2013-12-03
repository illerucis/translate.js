var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope) {

    $scope.previousTranslations = {}

    $scope.originalText = "translate.";
    $scope.translatedText = "";
    $scope.leftOverText = $scope.originalText;

    $scope.previousHighlightLength = 0;

    $scope.stubbedOutTranslator = {
	"translate."     : "oversett."
    };

    $scope.startOk = function(start) {
	return start == 0 || 
	    $scope.originalText.charAt(start - 1) == ' ';
    }

    $scope.endOk = function(end) {
	return end == $scope.originalText.length - 1 || 
	    $scope.originalText.charAt(end + 1) == ' ';
    }

    $scope.findMatchIndexes = function(highlightedText) {

	var start = $scope.originalText.indexOf(highlightedText);
	var end = start + highlightedText.length - 1;

	while ( ( ! $scope.startOk(start) ) && start < end )
	    start++;

	while ( ( ! $scope.endOk(end) ) && end > 0 )
	    end--;

	return { "start": start, "end": end };

    }

    $scope.setTranslation = function(matchIndexes) {
	
	// recover the previous words
	var previousWords = "";
	
	if ( $scope.previousTranslations.hasOwnProperty($scope.translatedText) ) {
	    previousWords = $scope.previousTranslations[$scope.translatedText];
	}
	
	var newWords = $scope.originalText.slice(matchIndexes.start, matchIndexes.end + 1);

	var sendToTranslator = previousWords + newWords;

	var translation = $scope.stubbedOutTranslator[sendToTranslator];

	$scope.previousTranslations[translation] = sendToTranslator;

	$scope.translatedText = translation;
	$scope.leftOverText = $scope.originalText.slice(matchIndexes.end + 1);
	
    }

    $scope.translateText = function() {

	// get the full text, highlighted text, containing element
	var highlightedText = window.getSelection().toString();

	if ( highlightedText.length > 0 && 
	     highlightedText.length > $scope.previousHighlightLength ) {
	    
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
	}

	$scope.previousHighlightLength = highlightedText.length;

    };
});

// the new idea is to store three variables - the original text, the translated text
// due to highligthing a word, and the left over text (original - translated)
// always display translated + leftover. when there's no highlighted text, 
// 
