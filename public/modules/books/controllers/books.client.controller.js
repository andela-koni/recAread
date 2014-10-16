'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Books', 'Reviews', 'Likes', '$timeout',
	function($scope, $stateParams, $location, Authentication, Books, Reviews, Likes, $timeout) {
		$scope.authentication = Authentication;
		$scope.liked = false;
		$scope.showReview = false;

		// BOOK

			// Upload a Bookcover Image
			$scope.fileUpload=function(){
				var fileInput = document.getElementById('fileInput');
		        var fileDisplayArea = document.getElementById('fileDisplayArea');
		    	
		    	fileInput.addEventListener('change', function(e) {
		        	var files = e.target.files;
		        	if(files && files[0] !== null) {

			       		var reader = new FileReader();
			        	reader.onload = function(e) {
			        		$scope.response = reader.result;
			    		};
			       		 reader.readAsDataURL(files[0]);  
			       		 
		       		}
					$timeout(function(){
						$scope.image = $scope.response;
					}, 1000);
		    	});	
			};

			// Create new Book
			$scope.create = function() {
				// Create new Book object
				var book = new Books ({
					title: this.title,
					author: this.author,
					genre: this.genre,
					publishedDate: this.publishedDate,
					description: this.description,
					image: $scope.image
				});

				// Redirect after save
				book.$save(function(response) {
					$location.path('books/' + response._id);

					// Clear form fields
					$scope.title = '';
					$scope.author = '';
					$scope.genre = '';
					$scope.publishedDate = '';
					$scope.description = '';

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};


			// Remove existing Book
			$scope.remove = function( book ) {
				if ( book ) { book.$remove();

					for (var i in $scope.books ) {
						if ($scope.books [i] === book ) {
							$scope.books.splice(i, 1);
						}
					}
				} else {
					$scope.book.$remove(function() {
						$location.path('books/create');
					});
				}
			};



			// Update existing Book
			$scope.update = function() {
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
				}, function(){
					$scope.likes = $scope.book.likes.length;
				}); 
								
			};

		// COMMENT	

			// Add a review/comment
			$scope.createReview = function() {
			
				var review = new Reviews ({
					bookId: $scope.book._id,
					reviewText: $scope.reviewText
				});
				// Redirect after save
				review.$save(function(response) {
					$scope.book = response;
					$scope.reviewText = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
				$scope.showReview = false;
			};

			// Delete a Review
			$scope.deleteReview = function( review ) {
				var rview = new Reviews ({
					bookId: $scope.book._id,
					_id: review._id,
					reviewer: review.reviewer
				});
				review.$remove(function(response){
					$scope.book = response;
				});
			};

		// LIKES

			// checks if user has already liked a book
	        $scope.checkLikes = function() {
	        	var likes = $scope.book.likes;
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
	            	bookId: $stateParams.bookId,
	                likes: 1
	            });

	            like.$save(function(response) {
	                $scope.book = response;
	                $scope.liked = true;
	                $scope.likes = $scope.book.likes.length;
	            }, function(errorResponse) {
	                $scope.likeError = errorResponse.data.message;
	            });
	   		};
		   	
	}
]); 