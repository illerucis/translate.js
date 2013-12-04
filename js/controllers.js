var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope, $http) {

    $scope.originalText = "";
    $scope.element = null;
    $scope.previousMatch = { "start": -1, "end": -1, "padding": 0 };
    $scope.prevHighlightLength = 0;

    $scope.seenPhrases = {}
    $scope.accessToken = null;

    $scope.setTranslation = function(match) {
	
	var wordsToTranslate = $scope.originalText.slice(match.start, match.end + 1);

	var translation = stubbedOutTranslator[wordsToTranslate];
	var padding = translation.length - wordsToTranslate.length;

	// create a copy with the translation inserted
	var translatedText = $scope.originalText.slice(0, match.start) + 
	    translation + $scope.originalText.slice(match.end + 1);

	$scope.prevHighlightLength = translation.length;
	$scope.element.textContent = translatedText;

	$scope.previousMatch["start"] = match.start;
	$scope.previousMatch["end"] = match.end;
	$scope.previousMatch["padding"] = padding;

    }

    $scope.startOk = function(start) {
	return start == 0 || 
	    $scope.originalText.charAt(start - 1) == ' ';
    }

    $scope.endOk = function(end) {
	return end == $scope.originalText.length - 1 || 
	    $scope.originalText.charAt(end + 1) == ' ';
    }


    $scope.findMatch = function(hlStart, hlEnd) {

	var start = hlStart;
	var end = hlEnd - $scope.previousMatch.padding;

	while ( ( ! $scope.startOk(start) ) && start < end )
	    start++;
	while ( ( ! $scope.endOk(end) ) && end > 0 )
	    end--;

	return { "start": start, "end": end};

    }

    $scope.setAccessToken = function() {

	var accessTokenParams = getAccessTokenParams();

	$http.post({"url": accessTokenParams.url, "params": accessTokenParams.request}).
	    success(function(data) { 
		alert("data", data); 
		$scope.accessToken = "bob";
	    }).
	    error(function(data, status, headers, config) {
		console.log("Fail", status, data, headers, config);
		$scope.accessToken = "bobob";
	    });
    }


    $scope.translateText = function() {
	
	
	var selection = window.getSelection();
	console.log($scope.accessToken);
	if (selection.anchorNode) {

	    // save the original text only once
	    if ( $scope.originalText == "") {

		$scope.originalText = selection.anchorNode.parentElement.textContent;
		$scope.element = selection.anchorNode.parentElement;

		if ( $scope.accessToken == null ) {
		    $scope.setAccessToken();
		}

	    }

	    // // get the full text, highlighted text, containing element
	    // var hlStart = selection.getRangeAt(0).startOffset;
	    // var hlEnd = selection.getRangeAt(0).endOffset - 1;
	    // var hlLength = hlEnd - hlStart + 1;

	    // if ( hlLength > 0 && hlLength > $scope.prevHighlightLength ) {

	    // 	// an object representing the adjusted match indexes of the highlighted text
	    // 	var match = $scope.findMatch(hlStart, hlEnd);
		
	    // 	// given the adjusted indexes (if valid), set the translation
	    // 	if (match.start < match.end) 
	    // 	    $scope.setTranslation(match);
	    // }
	}
    }
    
    $scope.clearText = function() {
	$scope.previousMatch = { "start": -1, "end": -1, "padding": 0 };
	$scope.prevHighlightLength = 0;
	$scope.element.textContent = $scope.originalText;
    }
});
