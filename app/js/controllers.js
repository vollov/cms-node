'use strict';

angular.module('appControllers', ['appServices' ])
.controller('SettingCtrl',function ($scope, $rootScope, $location, LanguageService, $translate) {
	
	$scope.changeLanguage = function (lang) {
		// set the language in service
		LanguageService.set(lang);
		
		$scope.language = lang;
		$rootScope.$broadcast('changeLang', lang);
		//console.log('called SettingCtrl.changeLanguage() with key=' + lang);
	    $translate.use(lang);

	};
})
.controller('PageCtrl', function ($scope, $rootScope, $routeParams, Content, _, LanguageService, $translate){
	
	$scope.slug = $routeParams.slug;
	/**
	 * Load default contents by page slug
	 */
	Content.query($scope.slug).success(function(response,status){
		$scope.contents = response;
		//console.log('PageCtrl initialize : querying page with language =' + LanguageService.get());
		//console.log('PageCtrl initialize : load('+ $scope.slug + ') $scope.contents = %j', $scope.contents); 
		// load $scope.contents with default language
		$scope.load(LanguageService.get()); 
	});
	
	$rootScope.$on('changeLang', function(event, lang) { 
		$scope.load(lang);
	});
	
	$scope.load = function(lang) {
		var result = _.where($scope.contents, {'language':lang});
		
		// return an array of objects
		var page = _.indexBy(result, 'slug');
		//console.log('PageCtrl.load('+ $scope.slug + ') page = %j', page); 
		
		//&& page.length > 0
		if(!_.isEmpty(page) && _.has(page, $scope.slug) ){
			$scope.pageContent = page[$scope.slug].text; 
		} else {
			$scope.pageContent = ''; 
		}
		
		
	};
})
/**
 * Block controller to control a page block with multiple contents
 */
.controller('BlockCtrl', function ($scope, $rootScope, $routeParams, Content, _, LanguageService, $translate){
	/**
	 * Load default contents by page slug
	 */
	Content.query($routeParams.slug).success(function(response,status){
		$scope.contents = response;
		//console.log('BlockCtrl initialize : querying page with language =' + LanguageService.get());
		var result = _.where($scope.contents, 
				{'language':LanguageService.get()}
		);
		
		$scope.page = _.indexBy(result, 'slug');
		//console.log('BlockCtrl initialize with slug:('+ $routeParams.slug + ').page = %j', $scope.page); 
	});
	
	$rootScope.$on('changeLang', function(event, lang) { 
		//console.log('recevied events in ' + $routeParams.slug +' and language =' + lang); 
		$scope.load(lang);
	});
	
	$scope.load = function(lang) {
		//console.log('Calling PageCtrl.load()'); 
		var result = _.where($scope.contents, {'language':lang});
		$scope.page = _.indexBy(result, 'slug');
		//console.log('PageCtrl.load('+ $routeParams.slug + ').result = %j', result); 
	};
})
.controller('ResourceListCtrl', function ($scope, Resource) {
	$scope.resources = Resource.query();

	$scope.selectResource = function(row) {
		$scope.selectedRow = row;
	};
	
	$scope.deleteResource = function(Resource, index) {
		Resource.$delete();
		$scope.resources.splice(index, 1)
	}
})
.controller('ResourceAddCtrl', function($scope, $location, Resource) {
	
	$scope.saveResource = function() {
//		var current_time = new Date();
//		$scope.Resource.Resource_date = current_time.getTime();
//		
		Resource.save($scope.Resource, function() {
			$location.path('/resources');
		});
	};
})
.controller('ResourceEditCtrl', function($scope, $location, $routeParams,
		Resource) {
	$scope.resource = Resource.get({
		id : $routeParams.id
	});
	
	$scope.saveResource = function() {
		$scope.resource.$update();
		$location.path('/resources')
	}
})
;