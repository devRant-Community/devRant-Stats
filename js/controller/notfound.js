app.controller('NotFoundController', function ($scope, $location) {
	$scope.headerBackground = "d55161";

	angular.element(document).ready(function () {
		setTimeout(function (){
			$location.path("/");
			$scope.$apply()
		}, 1500);
	});
});