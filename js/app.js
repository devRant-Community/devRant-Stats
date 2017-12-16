// Create angular module
var app = angular.module('DevRantStats', ['ngRoute']);

// Routing-Configuration
app.config(['$routeProvider', function ($routeProvider) {
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
}]);