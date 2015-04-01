'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var carModels = require('../../app/controllers/car-models.server.controller');

	// Car models Routes
	app.route('/car-models')
		.get(carModels.list)
		.post(users.requiresLogin, carModels.create);

	app.route('/car-models/:carModelId')
		.get(carModels.read)
		.put(users.requiresLogin, carModels.hasAuthorization, carModels.update)
		.delete(users.requiresLogin, carModels.hasAuthorization, carModels.delete);

	// Finish by binding the Car model middleware
	app.param('carModelId', carModels.carModelByID);
};
