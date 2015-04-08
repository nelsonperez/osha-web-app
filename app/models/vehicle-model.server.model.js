'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vehicle model Schema
 */
var VehicleModelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vehicle model name',
		trim: true
	},
    tasks: [String],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('VehicleModel', VehicleModelSchema);