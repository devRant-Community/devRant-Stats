// Create angular module
var app = angular.module('DevRantStats', ['ngRoute', 'chart.js']);

// Routing-Configuration
app.config(['$routeProvider', '$sceProvider', function ($routeProvider, $sceProvider) {
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
		.otherwise({
			redirectTo: '/'
		});

	$sceProvider.enabled(false);
}]);