app.controller('NotFoundController', function ($scope, $location, $http, $routeParams) {
	$scope.headerBackground = "d55161";

	angular.element(document).ready(function () {
		setTimeout(function () {
			var addUser = confirm("Do you want to send a request for the user to be added?");

			if (addUser && $routeParams.username !== undefined) {
				$http.get('https://devrant.com/api/get-user-id?app=3&username=' + $routeParams.username).then(function(response) {
					if(response.data.success) {
						$http.get('https://skayo.2ix.de/api/requestAddUser.php?username=' + $routeParams.username).then(function () {
							$location.path("/");
						}, function() {
							$location.path("/");
						});
					} else {
						$location.path("/");
					}
				}, function() {
					$location.path("/");
				});
			} else {
				$location.path("/");
				$scope.$apply();
			}
		}, 1500);
	});
});