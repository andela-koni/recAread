'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


// Review Schema
var reviewsSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	reviewer: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	reviewText: {
		type: String,
		required: 'Add a comment ',
		trim: true
	}
});

	// Like Schema
var LikeSchema = new Schema({
	likes: {
		type: Number,
		default:''
	},
	
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


 // Book Schema

 
var BookSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Book Title',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	author: {
		type: String,
		required: 'Please fill Book Author',
		trim: true
	},
	category: {
		type: String,
		required: 'Please fill Book Category',
		trim: true
	},
	publishedDate: {
		type: String,
		required: 'Please fill Book Published Date',
		trim: true
	},
	description: {
		type: String,
		required: 'Please fill Book Description',
		trim: true
	},
	reviews:[reviewsSchema],
	likes: [LikeSchema]
}); 


mongoose.model('Book', BookSchema);