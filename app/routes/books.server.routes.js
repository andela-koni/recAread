'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users'),
		books = require('../../app/controllers/books');
	//	reviews = require('../../app/controllers/reviews');

	// Books Routes
	app.route('/books')
		.get(books.list)
		.post(users.requiresLogin, books.create);

	app.route('/books/:bookId')
		.get(books.read)
		.put(users.requiresLogin, books.hasAuthorization, books.update)
		.delete(users.requiresLogin, books.hasAuthorization, books.delete);

	// Search  Route
	app.route('/:searchByAuthor')
		.get(books.searchbook);
		
	// Reviews Routes
	app.route('/books/:bookId/reviews')
		// .get(books.reviewsList)
        .post(users.requiresLogin, books.addReview);

    app.route('/books/:bookId/reviews/:reviewId')
        .delete(users.requiresLogin, books.hasAuthorization, books.deleteReview);

    // Likes Route
    app.route('/books/:bookId/like')
        .post(users.requiresLogin, books.likePost);

	// Finish by binding the Book middleware
	app.param('bookId', books.bookByID);

	// Finish by binding the Review middleware
	app.param('reviewId', books.reviewByID);

	app.param('searchByAuthor', books.searchByA);

};