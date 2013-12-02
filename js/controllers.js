var translateApp = angular.module('translateApp', []);

translateApp.controller('translateCtrl', function ($scope) {
    $scope.idText = {};

    $scope.translateText = function(event) {

	// get the full text, highlighted text, containing element
	var fullText = event.target.textContent;
	var highlightedText = window.getSelection().toString();
	var elementId = event.target.id;
	
	// line up the highlighted text with the full text. then send the valid
	// highlighted portion to translate API. combine and reset
	

    };
});
