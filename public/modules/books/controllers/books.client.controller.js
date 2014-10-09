'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Books', , 'Reviews', 'Likes',
	function($scope, $stateParams, $location, Authentication, Books ) {
		$scope.authentication = Authentication;
		$scope.liked = false;


		// BOOK

			// Create new Book
			$scope.createBook = function() {
				// Create new Book object
				var book = new Books ({
					title: this.title,
					author: this.author,
					category: this.category,
					publishedDate: this.publishedDate,
					description: this.description
				});

				// Redirect after save
				book.$save(function(response) {
					$location.path('books/' + response._id);

					// Clear form fields
					$scope.title = '';
					$scope.author = '';
					$scope.category = '';
					$scope.publishedDate = '';
					$scope.description = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};


			// Remove existing Book
			$scope.removeBook = function( book ) {
				if ( book ) { book.$remove();

					for (var i in $scope.books ) {
						if ($scope.books [i] === book ) {
							$scope.books.splice(i, 1);
						}
					}
				} else {
					$scope.book.$remove(function() {
						$location.path('books');
					});
				}
			};



			// Update existing Book
			$scope.updateBook = function() {
				var book = $scope.book ;

				book.$update(function() {
					$location.path('books/' + book._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			// Find a list of Books
			$scope.find = function() {
				$scope.books = Books.query();
			};

			// Find existing Book
			$scope.findOne = function() {
				$scope.book = Books.get({ 
					bookId: $stateParams.bookId
				});
			};

		// COMMENT	

			// Add a review/comment
			$scope.createReview = function() {
				// add a new review/comment
				var review = new Review ({
					bookId: $scope.book._id,
					reviewText: $scope.reviewText
				});

				// Redirect after save
				review.$save(function(response) {
					$scope.book = response;
					// Clear form fields
					$scope.reviewText = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			// Delete a Review
			$scope.deleteReview = function( review ) {
				var review = new reviews ({
					bookId: $scope.book._id,
					_id: review._id,
					reviewer: review.reviewer
				});
				review.$remove(function(response){
					$scope.book = response;
				});
			};

		// LIKES

			//checks if user has already liked a book
	        $scope.checkLikes = function(likes) {
	           for (var i in likes) {
	                if (likes[i].user === $scope.authentication.user._id) {
	                    $scope.liked = true;
	                    return true;
	                }
	            } 
	            return false; 
	        };
        
	        //remove error message associated with liking a book
	        $scope.removeError = function() {
	            $scope.likeError = null;
	        };
	        
	        //like a book
	        $scope.likeBook = function() {
	            var like = new Likes ({
	                bookId: $scope.book._id,
	                dest: 'like'
	            });

	            like.$save(function(response) {
	                $scope.book = response;
	                $scope.liked = true;
	            }, function(errorResponse) {
	                $scope.likeError = errorResponse.data.message;
	            });
	   		};
	   	//
	}
]); 