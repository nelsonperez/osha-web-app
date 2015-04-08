'use strict';

//Setting up route
angular.module('vehicle-models').config(['$stateProvider',
	function($stateProvider) {
		// Vehicle models state routing
		$stateProvider.
		state('listVehicleModels', {
			url: '/vehicle-models',
			templateUrl: 'modules/vehicle-models/views/list-vehicle-models.client.view.html'
		}).
		state('createVehicleModel', {
			url: '/vehicle-models/create',
			templateUrl: 'modules/vehicle-models/views/create-vehicle-model.client.view.html'
		}).
		state('viewVehicleModel', {
			url: '/vehicle-models/:vehicleModelId',
			templateUrl: 'modules/vehicle-models/views/view-vehicle-model.client.view.html'
		}).
		state('editVehicleModel', {
			url: '/vehicle-models/:vehicleModelId/edit',
			templateUrl: 'modules/vehicle-models/views/edit-vehicle-model.client.view.html'
		});
	}
]);