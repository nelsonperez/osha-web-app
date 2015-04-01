'use strict';

(function() {
	// Car models Controller Spec
	describe('Car models Controller Tests', function() {
		// Initialize global variables
		var CarModelsController,
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

			// Initialize the Car models controller.
			CarModelsController = $controller('CarModelsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Car model object fetched from XHR', inject(function(CarModels) {
			// Create sample Car model using the Car models service
			var sampleCarModel = new CarModels({
				name: 'New Car model'
			});

			// Create a sample Car models array that includes the new Car model
			var sampleCarModels = [sampleCarModel];

			// Set GET response
			$httpBackend.expectGET('car-models').respond(sampleCarModels);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carModels).toEqualData(sampleCarModels);
		}));

		it('$scope.findOne() should create an array with one Car model object fetched from XHR using a carModelId URL parameter', inject(function(CarModels) {
			// Define a sample Car model object
			var sampleCarModel = new CarModels({
				name: 'New Car model'
			});

			// Set the URL parameter
			$stateParams.carModelId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/car-models\/([0-9a-fA-F]{24})$/).respond(sampleCarModel);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.carModel).toEqualData(sampleCarModel);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CarModels) {
			// Create a sample Car model object
			var sampleCarModelPostData = new CarModels({
				name: 'New Car model'
			});

			// Create a sample Car model response
			var sampleCarModelResponse = new CarModels({
				_id: '525cf20451979dea2c000001',
				name: 'New Car model'
			});

			// Fixture mock form input values
			scope.name = 'New Car model';

			// Set POST response
			$httpBackend.expectPOST('car-models', sampleCarModelPostData).respond(sampleCarModelResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Car model was created
			expect($location.path()).toBe('/car-models/' + sampleCarModelResponse._id);
		}));

		it('$scope.update() should update a valid Car model', inject(function(CarModels) {
			// Define a sample Car model put data
			var sampleCarModelPutData = new CarModels({
				_id: '525cf20451979dea2c000001',
				name: 'New Car model'
			});

			// Mock Car model in scope
			scope.carModel = sampleCarModelPutData;

			// Set PUT response
			$httpBackend.expectPUT(/car-models\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/car-models/' + sampleCarModelPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid carModelId and remove the Car model from the scope', inject(function(CarModels) {
			// Create new Car model object
			var sampleCarModel = new CarModels({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Car models array and include the Car model
			scope.carModels = [sampleCarModel];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/car-models\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCarModel);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.carModels.length).toBe(0);
		}));
	});
}());