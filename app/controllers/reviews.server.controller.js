// 'use strict';

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
// Book = mongoose.model('Book'),
// 	_ = require('lodash');
// var books = require('../../app/controllers/books');


// // Add a Review

// exports.addReview = function(req, res) {
//     var book = req.book;
//     var review = req.body;
//     review.reviewer = req.user;
//     book.reviews.unshift(review);

//     book.save(function(err) {
//         if (err) {
//             return res.send(400, {
//                 message: books.getErrorMessage(err)
//             });
//         }   
//         else {
//             res.jsonp(book);
//         }
//     });
// };


