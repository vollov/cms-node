var DB = require('../lib/db.js');
var Utils = require("../lib/utils");

/**
 * Read only API for i18n pages
 * 
 *  1) load page contents by language and slug:  /api/<lang>/page/<slug>
 *  2) load all page contents by language
 *  3) load all page titles /api/pages
 *  4) load all page contents /api/contents
 */
module.exports = function(app) {
	
	var db = DB(app.config);
	var util = Utils();
	
	app.get('/api/pages', function(req, res) {
		var id = req.params.id;
		
		db.connect(function(err, connection){
			connection.query('SELECT p.slug, pt.title, pt.language FROM page_page p, ' + 
					'page_tpage pt where pt.page_id = p.id and p.active=true', function(err, docs) {
				connection.release();
				
				if (!err) {
					//pages = util.pickFields(docs, ['slug','title','language']);
					pages = docs;
					return res.status(200).send(pages);
				} else {
					return res.status(500).send({ message : err });
				}
			})
		});
	});
	
	app.get('/api/contents', function(req, res) {
		var id = req.params.id;
		
		db.connect(function(err, connection){
			connection.query('SELECT c.page_id, c.code, tc.language,tc.text FROM page_content c, page_tcontent tc where tc.content_id = c.id and c.active=true', function(err, docs) {
				connection.release();
				
				if (!err) {
					//pages = util.pickFields(docs, ['slug','title','language']);
					pages = docs;
					return res.status(200).send(pages);
				} else {
					return res.status(500).send({ message : err });
				}
			})
		});
	});
	
	app.get('/api/page/:slug', function(req, res) {
		var slug = req.params.slug;
		
		db.connect(function(err, connection){
			connection.query('SELECT c.slug, tc.language,tc.text FROM page_page p, page_content c, page_tcontent tc'
					+ ' where tc.content_id = c.id and p.id = c.page_id and p.slug = "' + slug + '" and c.active=true', function(err, docs) {
				connection.release();
				
				if (!err) {
					//pages = util.pickFields(docs, ['slug','title','language']);
					pages = docs;
					return res.status(200).json(pages);
				} else {
					return res.status(500).json({ message : err });
				}
			})
		});
	});
};