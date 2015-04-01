'use strict';

//Setting up route
angular.module('car-models').config(['$stateProvider',
	function($stateProvider) {
		// Car models state routing
		$stateProvider.
		state('listCarModels', {
			url: '/car-models',
			templateUrl: 'modules/car-models/views/list-car-models.client.view.html'
		}).
		state('createCarModel', {
			url: '/car-models/create',
			templateUrl: 'modules/car-models/views/create-car-model.client.view.html'
		}).
		state('viewCarModel', {
			url: '/car-models/:carModelId',
			templateUrl: 'modules/car-models/views/view-car-model.client.view.html'
		}).
		state('editCarModel', {
			url: '/car-models/:carModelId/edit',
			templateUrl: 'modules/car-models/views/edit-car-model.client.view.html'
		});
	}
]);