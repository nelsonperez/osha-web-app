'use strict';

//Car models service used to communicate Car models REST endpoints
angular.module('car-models').factory('CarModels', ['$resource',
	function($resource) {
		return $resource('car-models/:carModelId', { carModelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);