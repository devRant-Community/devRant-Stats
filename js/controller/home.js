app.controller('HomeController', function ($scope, $location, $http) {
	$scope.headerBackground = "d55161";

	$scope.search = "";

	$scope.stats = {
		members: "Loading...",
		newest: "Loading...",
		incomeMonth: "Loading...",
		incomeYear: "Loading...",
		scoreSum: "Loading...",
		rantsSum: "Loading..."
	}

	$http.get('https://skayo.2ix.de/api/getHomepageStats.php').then(function (response) {
		if(response.data.success) {
			$scope.stats = response.data.stats;
		} else {
			$scope.stats = {
				members: "Error",
				newest: "Error",
				incomeMonth: "Error",
				incomeYear: "Error",
				scoreSum: "Error",
				rantsSum: "Error"
			}
		}
	});

	$scope.startSearch = function() {
		$location.path('/user/' + $scope.search);
	};

	$scope.onSearchEnter = function(event) {
		if(event.which === 13) {
			$scope.startSearch();
		}
	}
});