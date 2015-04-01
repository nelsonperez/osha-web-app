'use strict';

// Car models controller
angular.module('car-models').controller('CarModelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CarModels',
	function($scope, $stateParams, $location, Authentication, CarModels) {
		$scope.authentication = Authentication;

		// Create new Car model
		$scope.create = function() {
			// Create new Car model object
			var carModel = new CarModels ({
				name: this.name
			});

			// Redirect after save
			carModel.$save(function(response) {
				$location.path('car-models/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Car model
		$scope.remove = function(carModel) {
			if ( carModel ) { 
				carModel.$remove();

				for (var i in $scope.carModels) {
					if ($scope.carModels [i] === carModel) {
						$scope.carModels.splice(i, 1);
					}
				}
			} else {
				$scope.carModel.$remove(function() {
					$location.path('car-models');
				});
			}
		};

		// Update existing Car model
		$scope.update = function() {
			var carModel = $scope.carModel;

			carModel.$update(function() {
				$location.path('car-models/' + carModel._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Car models
		$scope.find = function() {
			$scope.carModels = CarModels.query();
		};

		// Find existing Car model
		$scope.findOne = function() {
			$scope.carModel = CarModels.get({ 
				carModelId: $stateParams.carModelId
			});
		};
	}
]);