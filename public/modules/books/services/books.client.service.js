'use strict';

//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', ['$resource',
	function($resource) {
		return $resource('books/:bookId', { bookId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('books').factory('Reviews', ['$resource',
	function($resource) {
		return $resource('books/:bookId/reviews/:reviewId', { bookId: '@bookId', reviewId: '@_id'
		}, {
			update: {
				method: 'POST'
			}
		});
	}
]);

angular.module('books').factory('Likes', ['$resource',
	function($resource) {
		return $resource('books/:bookId/like', { 
			bookId: '@bookId'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
