'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	VehicleModel = mongoose.model('VehicleModel'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vehicleModel;

/**
 * Vehicle model routes tests
 */
describe('Vehicle model CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Vehicle model
		user.save(function() {
			vehicleModel = {
				name: 'Vehicle model Name'
			};

			done();
		});
	});

	it('should be able to save Vehicle model instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle model
				agent.post('/vehicle-models')
					.send(vehicleModel)
					.expect(200)
					.end(function(vehicleModelSaveErr, vehicleModelSaveRes) {
						// Handle Vehicle model save error
						if (vehicleModelSaveErr) done(vehicleModelSaveErr);

						// Get a list of Vehicle models
						agent.get('/vehicle-models')
							.end(function(vehicleModelsGetErr, vehicleModelsGetRes) {
								// Handle Vehicle model save error
								if (vehicleModelsGetErr) done(vehicleModelsGetErr);

								// Get Vehicle models list
								var vehicleModels = vehicleModelsGetRes.body;

								// Set assertions
								(vehicleModels[0].user._id).should.equal(userId);
								(vehicleModels[0].name).should.match('Vehicle model Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vehicle model instance if not logged in', function(done) {
		agent.post('/vehicle-models')
			.send(vehicleModel)
			.expect(401)
			.end(function(vehicleModelSaveErr, vehicleModelSaveRes) {
				// Call the assertion callback
				done(vehicleModelSaveErr);
			});
	});

	it('should not be able to save Vehicle model instance if no name is provided', function(done) {
		// Invalidate name field
		vehicleModel.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle model
				agent.post('/vehicle-models')
					.send(vehicleModel)
					.expect(400)
					.end(function(vehicleModelSaveErr, vehicleModelSaveRes) {
						// Set message assertion
						(vehicleModelSaveRes.body.message).should.match('Please fill Vehicle model name');
						
						// Handle Vehicle model save error
						done(vehicleModelSaveErr);
					});
			});
	});

	it('should be able to update Vehicle model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle model
				agent.post('/vehicle-models')
					.send(vehicleModel)
					.expect(200)
					.end(function(vehicleModelSaveErr, vehicleModelSaveRes) {
						// Handle Vehicle model save error
						if (vehicleModelSaveErr) done(vehicleModelSaveErr);

						// Update Vehicle model name
						vehicleModel.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vehicle model
						agent.put('/vehicle-models/' + vehicleModelSaveRes.body._id)
							.send(vehicleModel)
							.expect(200)
							.end(function(vehicleModelUpdateErr, vehicleModelUpdateRes) {
								// Handle Vehicle model update error
								if (vehicleModelUpdateErr) done(vehicleModelUpdateErr);

								// Set assertions
								(vehicleModelUpdateRes.body._id).should.equal(vehicleModelSaveRes.body._id);
								(vehicleModelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vehicle models if not signed in', function(done) {
		// Create new Vehicle model model instance
		var vehicleModelObj = new VehicleModel(vehicleModel);

		// Save the Vehicle model
		vehicleModelObj.save(function() {
			// Request Vehicle models
			request(app).get('/vehicle-models')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vehicle model if not signed in', function(done) {
		// Create new Vehicle model model instance
		var vehicleModelObj = new VehicleModel(vehicleModel);

		// Save the Vehicle model
		vehicleModelObj.save(function() {
			request(app).get('/vehicle-models/' + vehicleModelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vehicleModel.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vehicle model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle model
				agent.post('/vehicle-models')
					.send(vehicleModel)
					.expect(200)
					.end(function(vehicleModelSaveErr, vehicleModelSaveRes) {
						// Handle Vehicle model save error
						if (vehicleModelSaveErr) done(vehicleModelSaveErr);

						// Delete existing Vehicle model
						agent.delete('/vehicle-models/' + vehicleModelSaveRes.body._id)
							.send(vehicleModel)
							.expect(200)
							.end(function(vehicleModelDeleteErr, vehicleModelDeleteRes) {
								// Handle Vehicle model error error
								if (vehicleModelDeleteErr) done(vehicleModelDeleteErr);

								// Set assertions
								(vehicleModelDeleteRes.body._id).should.equal(vehicleModelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vehicle model instance if not signed in', function(done) {
		// Set Vehicle model user 
		vehicleModel.user = user;

		// Create new Vehicle model model instance
		var vehicleModelObj = new VehicleModel(vehicleModel);

		// Save the Vehicle model
		vehicleModelObj.save(function() {
			// Try deleting Vehicle model
			request(app).delete('/vehicle-models/' + vehicleModelObj._id)
			.expect(401)
			.end(function(vehicleModelDeleteErr, vehicleModelDeleteRes) {
				// Set message assertion
				(vehicleModelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vehicle model error error
				done(vehicleModelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		VehicleModel.remove().exec();
		done();
	});
});