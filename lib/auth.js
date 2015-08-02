var jwt = require('jwt-simple');
var DB = require('./db.js')

module.exports = function(app) {

	var db = DB(app.config);
	

	
	return{
		/**
		 * fetch user object from database by email and password.
		 * @param {Number} email
		 * @param {Number} password
		 * @return {Object} userObject {name, email, role}
		 */ 
		validateUser: function(email, password){
			db.connect(function(callback, err, connection){
				connection.query('SELECT name, email, role FROM user WHERE email=? and password=?',[email, password], function(err, docs) {
					connection.release();
					
					if (!err) {
						user = _.first(docs);
						// result = _.pick(user, ['name', 'email', 'role']);
						callback(null, result);
					} else {
						console.log("error: db error auth->validateUser()");
						callback(err);
					}
				})
			});
		}
	}
}

