var _ = require("../node_modules/underscore/underscore-min");

module.exports = function(){
	return {

		/**
		 * utility to remove fields form a doc
		 * 
		 * for example, the doc is
		 * 
		 * [{"_id":"54a4d108228799901cb889e5","name":"Kayak", "pwd":"aaa"},
		 * {"_id":"54a4d108228799901cb889e6","name":"Lifejacket", "pwd":"aaa"}]
		 * 
		 * to remove pwd field, call and get:
		 * 
		 * [{"name":"Kayak","_id":"54a4d108228799901cb889e5"},
		 * "name":"Lifejacket","_id":"54a4d108228799901cb889e6"}]
		 * 
		 * @param docs
		 */
		removeFields : function(docs, keys){
			return _.map(docs, function(item) {
				return _.omit(item, keys);
			});
		},
		pickFields : function(docs, keys){
			return _.map(docs, function(item) {
				return _.pick(item, keys);
			});
		}
	}
}