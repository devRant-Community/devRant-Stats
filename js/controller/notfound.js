app.controller('NotFoundController', function ($scope, $location, $http, $routeParams) {
	$scope.headerBackground = "d55161";

	angular.element(document).ready(function () {
		setTimeout(function (){
			var addUser = confirm("Do you want to send a request for the user to be added?");

			if(addUser) {
				$http.get('https://skayo.2ix.de/api/requestAddUser.php?username=' + $routeParams.username).then(function() {
					$location.path("/");
				});
			} else {
				$location.path("/");
				$scope.$apply();
			}
		}, 1500);
	});
});