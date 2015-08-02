var Auth = require('../lib/auth.js')
	, jwt = require('jwt-simple');
var DB = require('../lib/db.js');

module.exports = function(app) {
	
	//var auth = Auth(app);
	var db = DB(app.config);
	
	var validateUser = function(email, password){
		db.connect(function(err, connection){
			connection.query('SELECT name, email, role FROM user WHERE email=? and password=?',[email, password], function(err, docs) {
				connection.release();
				
				if (!err) {
					user = _.first(docs);
					result = _.pick(user, ['name', 'email', 'role']);
					return result;
				} else {
					console.log("error: db error auth->validateUser()");
					return new Error("Invalid credentials");
				}
			})
		});
	}
	
	/**
	 * login function
	 */
	app.get('/api/login', function(req, res) {
		 var email = req.body.email || '';
		 var password = req.body.password || '';
		  
		 if (email == '' || password == '') {
		      return res.status(401).json({
		        "message": "Invalid credentials"
		      });
		 }
		 
		 var dbUserObj = validateUser(validate, email, password);
		 
		 if (!dbUserObj || dbUserObj instanceof Error) { // If authentication fails, we send a 401 back
			 return res.status(401).json({
				 "message": "Invalid credentials"
			 });
		 }else{
			 return res.status(200).send(dbUserObj);
		 }
	});
}

/**
 * private method
 */ 
function genToken(user) {
	var expires = expiresIn(7); // 7 days
	
	var token = jwt.encode({
		exp : expires
	}, app.config.secret());

	return {
		token : token,
		expires : expires,
		user : user
	};
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}