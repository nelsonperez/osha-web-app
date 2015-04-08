'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	VehicleModel = mongoose.model('VehicleModel'),
	_ = require('lodash');

/**
 * Create a Vehicle model
 */
exports.create = function(req, res) {
	var vehicleModel = new VehicleModel(req.body);
	vehicleModel.user = req.user;

	vehicleModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleModel);
		}
	});
};

/**
 * Show the current Vehicle model
 */
exports.read = function(req, res) {
	res.jsonp(req.vehicleModel);
};

/**
 * Update a Vehicle model
 */
exports.update = function(req, res) {
	var vehicleModel = req.vehicleModel ;

	vehicleModel = _.extend(vehicleModel , req.body);

	vehicleModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleModel);
		}
	});
};

/**
 * Delete an Vehicle model
 */
exports.delete = function(req, res) {
	var vehicleModel = req.vehicleModel ;

	vehicleModel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleModel);
		}
	});
};

/**
 * List of Vehicle models
 */
exports.list = function(req, res) { 
	VehicleModel.find().sort('-created').populate('user', 'displayName').exec(function(err, vehicleModels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vehicleModels);
		}
	});
};

/**
 * Vehicle model middleware
 */
exports.vehicleModelByID = function(req, res, next, id) { 
	VehicleModel.findById(id).populate('user', 'displayName').exec(function(err, vehicleModel) {
		if (err) return next(err);
		if (! vehicleModel) return next(new Error('Failed to load Vehicle model ' + id));
		req.vehicleModel = vehicleModel ;
		next();
	});
};

/**
 * Vehicle model authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vehicleModel.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
