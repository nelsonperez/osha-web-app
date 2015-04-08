'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vehicleModels = require('../../app/controllers/vehicle-models.server.controller');

	// Vehicle models Routes
	app.route('/vehicle-models')
		.get(vehicleModels.list)
		.post(users.requiresLogin, vehicleModels.create);

	app.route('/vehicle-models/:vehicleModelId')
		.get(vehicleModels.read)
		.put(users.requiresLogin, vehicleModels.hasAuthorization, vehicleModels.update)
		.delete(users.requiresLogin, vehicleModels.hasAuthorization, vehicleModels.delete);

	// Finish by binding the Vehicle model middleware
	app.param('vehicleModelId', vehicleModels.vehicleModelByID);
};
