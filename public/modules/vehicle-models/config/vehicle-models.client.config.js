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