'use strict';

//Vehicle models service used to communicate Vehicle models REST endpoints
angular.module('vehicle-models').factory('VehicleModels', ['$resource',
	function($resource) {
		return $resource('vehicle-models/:vehicleModelId', { vehicleModelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);