
module.exports = {
	/**
	 * Add Access-Control-Allow-Headers in HTTP response
	 */
	header : function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		//res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		// Set custom headers for CORS
		res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
		if (req.method == 'OPTIONS') {
			res.status(200).end();
		} else {
			next();
		}
	}
}
