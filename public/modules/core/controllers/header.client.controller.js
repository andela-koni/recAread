'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location',
	function($scope, Authentication, Menus, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.load_search_book = function(){
			$location.path('/search_page/' + $scope.searchauthor);
			$scope.searchauthor = '';				
		};
	}
]).run(['$rootScope', function($rootScope) {
		$rootScope.$on('$stateChangeSuccess',function() {
		$('html, body').animate({ scrollTop: 0 }, 200);
	});
}]);
