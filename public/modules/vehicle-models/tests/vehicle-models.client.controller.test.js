'use strict';

(function() {
	// Vehicle models Controller Spec
	describe('Vehicle models Controller Tests', function() {
		// Initialize global variables
		var VehicleModelsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Vehicle models controller.
			VehicleModelsController = $controller('VehicleModelsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vehicle model object fetched from XHR', inject(function(VehicleModels) {
			// Create sample Vehicle model using the Vehicle models service
			var sampleVehicleModel = new VehicleModels({
				name: 'New Vehicle model'
			});

			// Create a sample Vehicle models array that includes the new Vehicle model
			var sampleVehicleModels = [sampleVehicleModel];

			// Set GET response
			$httpBackend.expectGET('vehicle-models').respond(sampleVehicleModels);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleModels).toEqualData(sampleVehicleModels);
		}));

		it('$scope.findOne() should create an array with one Vehicle model object fetched from XHR using a vehicleModelId URL parameter', inject(function(VehicleModels) {
			// Define a sample Vehicle model object
			var sampleVehicleModel = new VehicleModels({
				name: 'New Vehicle model'
			});

			// Set the URL parameter
			$stateParams.vehicleModelId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vehicle-models\/([0-9a-fA-F]{24})$/).respond(sampleVehicleModel);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleModel).toEqualData(sampleVehicleModel);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(VehicleModels) {
			// Create a sample Vehicle model object
			var sampleVehicleModelPostData = new VehicleModels({
				name: 'New Vehicle model'
			});

			// Create a sample Vehicle model response
			var sampleVehicleModelResponse = new VehicleModels({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle model'
			});

			// Fixture mock form input values
			scope.name = 'New Vehicle model';

			// Set POST response
			$httpBackend.expectPOST('vehicle-models', sampleVehicleModelPostData).respond(sampleVehicleModelResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vehicle model was created
			expect($location.path()).toBe('/vehicle-models/' + sampleVehicleModelResponse._id);
		}));

		it('$scope.update() should update a valid Vehicle model', inject(function(VehicleModels) {
			// Define a sample Vehicle model put data
			var sampleVehicleModelPutData = new VehicleModels({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle model'
			});

			// Mock Vehicle model in scope
			scope.vehicleModel = sampleVehicleModelPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vehicle-models\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vehicle-models/' + sampleVehicleModelPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vehicleModelId and remove the Vehicle model from the scope', inject(function(VehicleModels) {
			// Create new Vehicle model object
			var sampleVehicleModel = new VehicleModels({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vehicle models array and include the Vehicle model
			scope.vehicleModels = [sampleVehicleModel];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vehicle-models\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVehicleModel);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vehicleModels.length).toBe(0);
		}));
	});
}());