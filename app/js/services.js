'use strict';

var httpRoot = 'http://localhost:5006';

angular.module('appServices', [ ])

.factory('_', ['$window', function($window) {
	return $window._; // assumes underscore has already been loaded on the page
}])
.factory('Settings', function() {
	var settings = {'default_locale':'en'}; 
	return {		
		get: function(key){
			return settings[key];
		}
	}
})
.factory("LanguageService", ['$rootScope', function($rootScope) {
	return {
		set: function(lang) {
			$rootScope.currentLang = lang;
		},
		get: function(){
			/**
			 * default language is en
			 */
			if (!$rootScope.currentLang || !$rootScope.currentLang.trim()){
				$rootScope.currentLang = 'en';
			}
			return $rootScope.currentLang;
		}
	}
}])
.factory("PageService", ['$rootScope', function($rootScope) {
	return {
		set: function(slug) {
			$rootScope.currentPage = slug;
		},
		get: function(){
			if (!$rootScope.currentPage || !$rootScope.currentPage.trim()){
				$rootScope.currentPage = 'home';
			}
			return $rootScope.currentPage;
		}
	}
}])
.factory("FlashService", ['$rootScope', function($rootScope) {
	return {
		set: function(message) {
			$rootScope.flash = message;
		},
		clear: function() {
			$rootScope.flash = "";
		},
		get: function(){
			return $rootScope.flash;
		}
	}
}])
.factory('Content', function($http) {
	return {
		all: function(){
			return $http.get(httpRoot + '/api/contents');
		},
		query: function(slug) {
			return $http.get(httpRoot + '/api/page/' + slug);
		}
	}
})
.factory('Resource', function($resource) {
	return $resource('/api/t/resource/:id', {id: '@id'}, {
        update: {method:'PUT'}
    });
});
