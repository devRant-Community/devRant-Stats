// Create angular module
var app = angular.module('DevRantStats', ['ngRoute', 'chart.js', 'ui.odometer']);

// Routing-Configuration
app.config(['$routeProvider', '$sceProvider', 'ChartJsProvider', '$locationProvider', function ($routeProvider, $sceProvider, ChartJsProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'HomeController'
		})
		.when('/user/:username', {
			templateUrl: 'pages/user.html',
			controller: 'UserController'
		})
		.when('/userNotFound', {
			templateUrl: 'pages/userNotFound.html',
			controller: 'NotFoundController'
		})
		.when('/user/:username/fullscreenScore', {
			templateUrl: 'pages/fullscreenScore.html',
			controller: 'FullscreenScoreController'
		})
		.otherwise({
			redirectTo: '/'
		});

	$sceProvider.enabled(false);

	ChartJsProvider.setOptions({
		chartColors: ['#A973A2', '#7BC8A4', '#F99A66', '#69c9cd', '#d55061', '#e6c653'],
		global: {
			defaultFontColor: '#fff',
			defaultFontFamily: "'Comfortaa', sans-serif"
		}
	})

	$locationProvider.html5Mode(true);
}]);