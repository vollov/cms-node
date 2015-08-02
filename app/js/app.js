'use strict';

angular.module('labApps', [ 'ngRoute','ngResource', 'appControllers','pascalprecht.translate','ngSanitize' ])

	.config(function($translateProvider) {
		$translateProvider.translations('en', {
			HOME_TITLE : 'Home',
			ABOUT_TITLE : 'About',
			
			PAGE_TITLE : 'Welcome to ISDA | isda.ca',
			
			TITLE_WELCOME : 'Welcome!',
			TITLE_ABOUT_ISDA : 'About Association',
			TITLE_SERVICES : 'Services',
			
			MENU_HOME 		: 'Home',
			MENU_ABOUT		: 'About',
			MENU_SERVICES	: 'Services',
			
			MENU_EDUCATION		: 'Education',
			MENU_INVESTMENT		: 'Investment oppotunities',
			MENU_IMMIGRATION	: 'Immigration programs',
			
			MENU_ADVANTAGE	: 'Our Advantage',
			MENU_CONTACTS	: 'Contact Us',
			MENU_EVENTS		: 'Events',
			MENU_ACTIVITIES	: 'Activities'
			
		});
		$translateProvider.translations('zh', {
			HOME_TITLE : '首页',
			ABOUT_TITLE : '关于',
			
			PAGE_TITLE : 'ISDA 欢迎你 | isda.ca',
			
			TITLE_WELCOME : '欢迎你!',
			TITLE_ABOUT_ISDA : '协会介绍',
			TITLE_SERVICES : '服务简介',
			
			MENU_HOME 		: '首页',
			MENU_ABOUT		: '关于我们',
			MENU_SERVICES	: '协会服务项目',
			MENU_EDUCATION	: '安省教育介绍',
			MENU_INVESTMENT		: '投资机会',
			MENU_IMMIGRATION	: '移民项目',
			
			MENU_ADVANTAGE	: '我们的优势',
			MENU_CONTACTS	: '联系我们',
			MENU_EVENTS		: '协会动态',
			MENU_ACTIVITIES	: '协会活动'
		});
		$translateProvider.preferredLanguage('en');
		$translateProvider.useSanitizeValueStrategy('sanitize');
	})
	.config(function($routeProvider) {
		$routeProvider.when('/page/:slug', {
			controller : 'PageCtrl',
			templateUrl : function(params){ return '/views/' + params.slug + '.html'; }
		})
		.when('/block/:slug', {
			controller : 'BlockCtrl',
			templateUrl : '/views/home.html'
		})
		.when('/resource/:id', {
			controller : 'ResourceEditCtrl',
			templateUrl : '/views/resource/detail.html'
		})
		.when('/resource/add', {
			controller : 'ResourceAddCtrl',
			templateUrl : '/views/resource/detail.html'
		})
		.when('/resources', {
			controller : 'ResourceListCtrl',
			templateUrl : '/views/resource/list.html'
		})
		.otherwise({
			redirectTo : '/block/home'
		});
	});