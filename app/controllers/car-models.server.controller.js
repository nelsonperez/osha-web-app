'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	CarModel = mongoose.model('CarModel'),
	_ = require('lodash');

/**
 * Create a Car model
 */
exports.create = function(req, res) {
	var carModel = new CarModel(req.body);
	carModel.user = req.user;

	carModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carModel);
		}
	});
};

/**
 * Show the current Car model
 */
exports.read = function(req, res) {
	res.jsonp(req.carModel);
};

/**
 * Update a Car model
 */
exports.update = function(req, res) {
	var carModel = req.carModel ;

	carModel = _.extend(carModel , req.body);

	carModel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carModel);
		}
	});
};

/**
 * Delete an Car model
 */
exports.delete = function(req, res) {
	var carModel = req.carModel ;

	carModel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carModel);
		}
	});
};

/**
 * List of Car models
 */
exports.list = function(req, res) { 
	CarModel.find().sort('-created').populate('user', 'displayName').exec(function(err, carModels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(carModels);
		}
	});
};

/**
 * Car model middleware
 */
exports.carModelByID = function(req, res, next, id) { 
	CarModel.findById(id).populate('user', 'displayName').exec(function(err, carModel) {
		if (err) return next(err);
		if (! carModel) return next(new Error('Failed to load Car model ' + id));
		req.carModel = carModel ;
		next();
	});
};

/**
 * Car model authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.carModel.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
