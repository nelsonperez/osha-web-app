'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CarModel = mongoose.model('CarModel'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, carModel;

/**
 * Car model routes tests
 */
describe('Car model CRUD tests', function() {
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

		// Save a user to the test db and create new Car model
		user.save(function() {
			carModel = {
				name: 'Car model Name'
			};

			done();
		});
	});

	it('should be able to save Car model instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car model
				agent.post('/car-models')
					.send(carModel)
					.expect(200)
					.end(function(carModelSaveErr, carModelSaveRes) {
						// Handle Car model save error
						if (carModelSaveErr) done(carModelSaveErr);

						// Get a list of Car models
						agent.get('/car-models')
							.end(function(carModelsGetErr, carModelsGetRes) {
								// Handle Car model save error
								if (carModelsGetErr) done(carModelsGetErr);

								// Get Car models list
								var carModels = carModelsGetRes.body;

								// Set assertions
								(carModels[0].user._id).should.equal(userId);
								(carModels[0].name).should.match('Car model Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Car model instance if not logged in', function(done) {
		agent.post('/car-models')
			.send(carModel)
			.expect(401)
			.end(function(carModelSaveErr, carModelSaveRes) {
				// Call the assertion callback
				done(carModelSaveErr);
			});
	});

	it('should not be able to save Car model instance if no name is provided', function(done) {
		// Invalidate name field
		carModel.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car model
				agent.post('/car-models')
					.send(carModel)
					.expect(400)
					.end(function(carModelSaveErr, carModelSaveRes) {
						// Set message assertion
						(carModelSaveRes.body.message).should.match('Please fill Car model name');
						
						// Handle Car model save error
						done(carModelSaveErr);
					});
			});
	});

	it('should be able to update Car model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car model
				agent.post('/car-models')
					.send(carModel)
					.expect(200)
					.end(function(carModelSaveErr, carModelSaveRes) {
						// Handle Car model save error
						if (carModelSaveErr) done(carModelSaveErr);

						// Update Car model name
						carModel.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Car model
						agent.put('/car-models/' + carModelSaveRes.body._id)
							.send(carModel)
							.expect(200)
							.end(function(carModelUpdateErr, carModelUpdateRes) {
								// Handle Car model update error
								if (carModelUpdateErr) done(carModelUpdateErr);

								// Set assertions
								(carModelUpdateRes.body._id).should.equal(carModelSaveRes.body._id);
								(carModelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Car models if not signed in', function(done) {
		// Create new Car model model instance
		var carModelObj = new CarModel(carModel);

		// Save the Car model
		carModelObj.save(function() {
			// Request Car models
			request(app).get('/car-models')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Car model if not signed in', function(done) {
		// Create new Car model model instance
		var carModelObj = new CarModel(carModel);

		// Save the Car model
		carModelObj.save(function() {
			request(app).get('/car-models/' + carModelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', carModel.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Car model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car model
				agent.post('/car-models')
					.send(carModel)
					.expect(200)
					.end(function(carModelSaveErr, carModelSaveRes) {
						// Handle Car model save error
						if (carModelSaveErr) done(carModelSaveErr);

						// Delete existing Car model
						agent.delete('/car-models/' + carModelSaveRes.body._id)
							.send(carModel)
							.expect(200)
							.end(function(carModelDeleteErr, carModelDeleteRes) {
								// Handle Car model error error
								if (carModelDeleteErr) done(carModelDeleteErr);

								// Set assertions
								(carModelDeleteRes.body._id).should.equal(carModelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Car model instance if not signed in', function(done) {
		// Set Car model user 
		carModel.user = user;

		// Create new Car model model instance
		var carModelObj = new CarModel(carModel);

		// Save the Car model
		carModelObj.save(function() {
			// Try deleting Car model
			request(app).delete('/car-models/' + carModelObj._id)
			.expect(401)
			.end(function(carModelDeleteErr, carModelDeleteRes) {
				// Set message assertion
				(carModelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Car model error error
				done(carModelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CarModel.remove().exec();
		done();
	});
});