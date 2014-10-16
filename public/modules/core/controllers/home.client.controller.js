'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$timeout',
	function($scope, Authentication, $timeout) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		$scope.quoteInterval = 7000;
		$scope.myInterval = 5000;

		$scope.quotes = [
			'"So many books, so little time"', 
			'"A reader lives a thousand lives before he dies, said Jojen. The man who never reads lives only one"',
			'"If you can make a woman laugh, you can make her do anything"',
			'"All extremes of feelings are allied with madness"',
			'"It does not do to dwell on dreams and forget to live"',
			'"I am not afraid of death, I just want to be there when it happens"',
			// 'If I offer you a glass of water and I bring back a glass of ice, I\'m trying to teach you patience. And also that sometimes you get ice with no water, and later you\'ll get water with no ice. Ah, but that\'s life, no? ''If I offer you a glass of water and I bring back a glass of ice, I\'m trying to teach you patience. And also that sometimes you get ice with no water, and later you\'ll get water with no ice. Ah, but that\'s life, no? '

		];

		$scope.slides = [
			'modules/core/img/brand/backImage.jpg',
			'modules/core/img/brand/backImage2.jpg'
		];

		// initial image index
		$scope._Index = 0;
		// initial quote index
		$scope._qIndex = 0;
		
		// if a current image is the same as requested image
		$scope.isActive = function (index) {
			return $scope._Index === index;
		};
		// for quote
		$scope.isActiveQ = function (index) {
			return $scope._qIndex === index;
		};
		
		// show prev image
		$scope.showPrev = function () {
			$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.slides.length - 1;
		};
		// show prev quote
		$scope.showPrevQ = function () {
			$scope._qIndex = ($scope._qIndex > 0) ? --$scope._qIndex : $scope.slides.length - 1;
		};

		// show next image
		$scope.showNext = function () {
			$scope._Index = ($scope._Index < $scope.slides.length - 1) ? ++$scope._Index : 0;
			$timeout($scope.showNext, $scope.myInterval);
		};
		// show next quote
		$scope.showNextQuote = function () {
			$scope._qIndex = ($scope._qIndex < $scope.quotes.length - 1) ? ++$scope._qIndex : 0;
			$timeout($scope.showNextQuote, $scope.quoteInterval);
		};
		
		$scope.loadSlides = function(){
			$timeout($scope.showNext, $scope.myInterval);
		};
		$scope.loadQuotes = function(){
			$timeout($scope.showNextQuote, $scope.quoteInterval);
		};
		
		$scope.loadSlides();
		$scope.loadQuotes();
	}
]);