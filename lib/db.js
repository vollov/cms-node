var mysql = require('mysql');

module.exports = function(db_config){
	
	var pool = mysql.createPool({
		  host     : db_config.db_host,
		  user     : db_config.db_username,
		  password : db_config.db_password,
		  database : db_config.db_name,
		  connectionLimit : 10
	});
	
	return {
//		pool.getConnection(function(err, connection) {
//			  // Use the connection
//			  connection.query( 'SELECT something FROM sometable', function(err, rows) {
//			    // And done with the connection.
//			    connection.release();
//
//			    // Don't use the connection here, it has been returned to the pool.
//			  });
//			});
		// callback = function(err, connection) { ... }
		connect: function(callback){
			pool.getConnection(callback);
		}
	};
}
