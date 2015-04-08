'use strict';

// Vehicle models controller
angular.module('vehicle-models').controller('VehicleModelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'VehicleModels',
	function($scope, $stateParams, $location, Authentication, VehicleModels) {
		$scope.authentication = Authentication;
        $scope.tasks = []

		// Create new Vehicle model
		$scope.create = function() {
			// Create new Vehicle model object
			var vehicleModel = new VehicleModels ({
				name: this.name,
                tasks : this.tasks
			});
           console.log(vehicleModel);
			// Redirect after save
			vehicleModel.$save(function(response) {
                console.log(response);
				//$location.path('vehicle-models/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.tasks = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.addTask = function(){
            if(!$scope.tasks) $scope.tasks = [];
            $scope.tasks.push($scope.newTask);
            $scope.newTask = "";

        }


		// Remove existing Vehicle model
		$scope.remove = function(vehicleModel) {
			if ( vehicleModel ) { 
				vehicleModel.$remove();

				for (var i in $scope.vehicleModels) {
					if ($scope.vehicleModels [i] === vehicleModel) {
						$scope.vehicleModels.splice(i, 1);
					}
				}
			} else {
				$scope.vehicleModel.$remove(function() {
					$location.path('vehicle-models');
				});
			}
		};

		// Update existing Vehicle model
		$scope.update = function() {
			var vehicleModel = $scope.vehicleModel;

			vehicleModel.$update(function() {
				$location.path('vehicle-models/' + vehicleModel._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vehicle models
		$scope.find = function() {
			$scope.vehicleModels = VehicleModels.query();
		};

		// Find existing Vehicle model
		$scope.findOne = function() {
			$scope.vehicleModel = VehicleModels.get({ 
				vehicleModelId: $stateParams.vehicleModelId
			});
		};
	}
]);