'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'osha';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('car-models');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('vehicle-models');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('vehicles');
'use strict';

// Configuring the Articles module
angular.module('car-models').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Car models', 'car-models', 'dropdown', '/car-models(/create)?');
		Menus.addSubMenuItem('topbar', 'car-models', 'List Car models', 'car-models');
		Menus.addSubMenuItem('topbar', 'car-models', 'New Car model', 'car-models/create');
	}
]);
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('vehicle-models').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vehicle models', 'vehicle-models', 'dropdown', '/vehicle-models(/create)?');
		Menus.addSubMenuItem('topbar', 'vehicle-models', 'List Vehicle models', 'vehicle-models');
		Menus.addSubMenuItem('topbar', 'vehicle-models', 'New Vehicle model', 'vehicle-models/create');
	}
]);
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
'use strict';

// Vehicle models controller
angular.module('vehicle-models').controller('VehicleModelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'VehicleModels',
	function($scope, $stateParams, $location, Authentication, VehicleModels) {
		$scope.authentication = Authentication;

		// Create new Vehicle model
		$scope.create = function() {
			// Create new Vehicle model object
			var vehicleModel = new VehicleModels ({
				name: this.name,
                tasks : this.tasks
			});

			// Redirect after save
			vehicleModel.$save(function(response) {
				$location.path('vehicle-models/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.tasks = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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
'use strict';

// Configuring the Articles module
angular.module('vehicles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vehicles', 'vehicles', 'dropdown', '/vehicles(/create)?');
		Menus.addSubMenuItem('topbar', 'vehicles', 'List Vehicles', 'vehicles');
		Menus.addSubMenuItem('topbar', 'vehicles', 'New Vehicle', 'vehicles/create');
	}
]);
'use strict';

//Setting up route
angular.module('vehicles').config(['$stateProvider',
	function($stateProvider) {
		// Vehicles state routing
		$stateProvider.
		state('listVehicles', {
			url: '/vehicles',
			templateUrl: 'modules/vehicles/views/list-vehicles.client.view.html'
		}).
		state('createVehicle', {
			url: '/vehicles/create',
			templateUrl: 'modules/vehicles/views/create-vehicle.client.view.html'
		}).
		state('viewVehicle', {
			url: '/vehicles/:vehicleId',
			templateUrl: 'modules/vehicles/views/view-vehicle.client.view.html'
		}).
		state('editVehicle', {
			url: '/vehicles/:vehicleId/edit',
			templateUrl: 'modules/vehicles/views/edit-vehicle.client.view.html'
		});
	}
]);
'use strict';

// Vehicles controller
angular.module('vehicles').controller('VehiclesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Vehicles',
	function($scope, $stateParams, $location, Authentication, Vehicles) {
		$scope.authentication = Authentication;

		// Create new Vehicle
		$scope.create = function() {
			// Create new Vehicle object
			var vehicle = new Vehicles ({
				name: this.name,
                vim: this.vim
			});

			// Redirect to vehicles list after save
			vehicle.$save(function(response) {
				$location.path('vehicles');

				// Clear form fields
				$scope.name = '';
                $scope.vim = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vehicle
		$scope.remove = function(vehicle) {
			if ( vehicle ) { 
				vehicle.$remove();

				for (var i in $scope.vehicles) {
					if ($scope.vehicles [i] === vehicle) {
						$scope.vehicles.splice(i, 1);
					}
				}
			} else {
				$scope.vehicle.$remove(function() {
					$location.path('vehicles');
				});
			}
		};

		// Update existing Vehicle
		$scope.update = function() {
			var vehicle = $scope.vehicle;

			vehicle.$update(function() {
				$location.path('vehicles/' + vehicle._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vehicles
		$scope.find = function() {
			$scope.vehicles = Vehicles.query();
		};

		// Find existing Vehicle
		$scope.findOne = function() {
			$scope.vehicle = Vehicles.get({ 
				vehicleId: $stateParams.vehicleId
			});
		};
	}
]);
'use strict';

//Vehicles service used to communicate Vehicles REST endpoints
angular.module('vehicles').factory('Vehicles', ['$resource',
	function($resource) {
		return $resource('vehicles/:vehicleId', { vehicleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);