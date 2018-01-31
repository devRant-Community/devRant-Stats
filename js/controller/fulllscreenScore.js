app.controller('FullscreenScoreController', function ($scope, $location, $routeParams, $http) {
	$scope.goBack = function() {
		$location.path($location.path().replace("fullscreenScore", ""));
	};

	$scope.username = $routeParams.username;

	$scope.liveData = {
		score: "..."
	};

	angular.element(document).find('body').css('background-color', '#40415A');

	$http.get('https://skayo.2ix.de/DevRantStats/api/getUserInfo.php?username=' + $routeParams.username).then(function(response) {
		if (response.data.success) {
			$scope.username = response.data.userinfo.username;

			if (typeof (EventSource) !== 'undefined') {
				var source = new EventSource("https://skayo.2ix.de/DevRantStats/api/liveData.php?userid=" + response.data.userinfo.devrant_id);
				source.onmessage = function (event) {
					$scope.$apply(function () {
						$scope.liveData = JSON.parse(event.data);
					});
				};
			} else {
				alert('Live Events not supported!');
				$scope.goBack();
			}
		} else {
			if (response.data.reason == "User not found") {
				$location.path("/userNotFound");
			} else {
				$scope.liveData = {
					score: "Error"
				}
			}
		}
	});

	$scope.$on('$locationChangeStart', function() {
		angular.element(document).find('body').css('background-color', '#54556E');
	});

	$scope.odometerOptions = {
		theme: 'minimal',
		duration: 1000
	};
});