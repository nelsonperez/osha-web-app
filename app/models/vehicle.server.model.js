'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vehicle Schema
 */
var VehicleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Vehicle name',
		trim: true
	},
    vim: {
        type: String,
        default: '',
        required: 'Please fill VIM',
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

mongoose.model('Vehicle', VehicleSchema);