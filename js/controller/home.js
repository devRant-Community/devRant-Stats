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
	};

	$scope.usernames = [];
	$scope.usernameAutocomplete = {post: "", pre: "", full: ""};
	$scope.autocompleteHidden = true;

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

	$http.get('https://skayo.2ix.de/api/getAllUsernames.php').then(function (response) {
		$scope.usernames = response.data.usernames;
	});

	$scope.startSearch = function() {
		$location.path('/user/' + $scope.search);
	};

	$scope.startSearchAutocomplete = function() {
		$location.path('/user/' + $scope.search + $scope.usernameAutocomplete.post);
	};

	$scope.searchUsername = function() {
		if($scope.search === '') return;

		var result = $scope.usernames.find(function(username) {
			return username.toLowerCase().startsWith($scope.search.toLowerCase());
		});

		if(result !== undefined) {
			$scope.usernameAutocomplete.full = result;
			$scope.usernameAutocomplete.pre = $scope.search;
			$scope.usernameAutocomplete.post = result.replace(new RegExp('^(' + $scope.search + ')', 'gi'), '');
			$scope.autocompleteHidden = false;
		} else {
			$scope.autocompleteHidden = true;
		}
	};
});