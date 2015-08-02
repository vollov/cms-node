'use strict';

var assert = require('assert')
  , should = require('should')
  , _ = require('../../lib/underscore/underscore');

var contents = [{code: 'home', 'language':'en', 'title' : 'home page'},{code: 'about', 'language':'en', 'title' : 'about page'},{code: 'home', 'language':'zh', 'title' : 'about page'}];
console.log('return contents = ' + contents + ' .');
var c =  _.filter(contents, function(item){
	console.log('return item.code= ' + item.code + ' .');
	return (item.language == 'en');
});

console.log('return title= ' + c.length + ' .');
var d =  _.where(contents, {'code' : 'home'});

console.log('return title= ' + d.length + ' .');


//describe('Test mongojs wrapper -- db module', function() {
//	
//	var email = 'insert@gmail.ca';
//
//	describe('Test underscore filter function', function() {
//		
//		var contents = [{code: 'home', 'language':'en', 'title' : 'home page'},{code: 'about', 'language':'en', 'title' : 'about page'}];
//		
//		it('should find 5 users in test db', function(done) {
//			
//			var c =  _.filter(contents, function(item){
//				if(item.code == 'home'){
//					return item;
//				}
//			});
//			console.log('return title= ' + c.title + ' .');
//			done();
////			$scope.homeText = _.filter($scope.contents, function(item){
////				if(item.code == 'Why Work with this Book?' && itme.language == Settings.get('default_locale')) {
////					return item;
////				}
////			});
////			
////			
////			
////			db.find('user', {}, {'email' : 1,  'role':1},{}, 10, function(err, users) {
////				should.not.exist(err);
////				console.log('return ' + users.length + ' users.');
////				users.should.have.lengthOf(5);
////				done();
////			});
//		});
//	});
//	
//});