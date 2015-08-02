module.exports = function() {
		
	var test_db = {
		db_host: 'localhost',
		db_username: 'root',
		db_password: 'justdoit',
		db_name: 'cms_test'
	};
	
	var prod_db = {
			db_host: 'localhost',
			db_username: 'root',
			db_password: 'justdoit',
			db_name: 'cms'
	};
		
	return {
		getProdConfig: function(){
			return prod_db;
		},
		getTestConfig: function(){
			return test_db;
		},
		secret: function(){
			return 'ozd*)605#4rk%1y&#$gaxn)b-5=#)jd%7(&)zzo^85k=+evbc+';
		}
	}
}