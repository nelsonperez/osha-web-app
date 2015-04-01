'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Car model Schema
 */
var CarModelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Car model name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('CarModel', CarModelSchema);