app.controller('UserController', function ($scope, $location, $routeParams, $http) {

	$scope.userinfo = {
		devrant_id: 0,
		username: "Loading...",
		start_time: 0,
		avatar_url: "",
		avatar_big_url: "",
		avatar_bg: "d55161",
		score: "Loading...",
		rants: "Loading...",
		comments: "Loading...",
		favorites: "Loading...",
		upvoted: "Loading...",
		collabs: "Loading...",
		scoreRank: "Loading...",
		rantsRank: "Loading...",
		latest_rant: "",
		latest_rant_error: ""
	};

	$scope.liveScore = "Please Wait...";

	$http.get('https://skayo.2ix.at/DevRantStats/api/getUserInfo.php?username=' + $routeParams.username).then(function(response) {
		if (response.data.success) {
			$scope.userinfo = response.data.userinfo;

			if (typeof (EventSource) !== 'undefined') {
				var source = new EventSource("https://skayo.2ix.at/DevRantStats/api/liveScore.php?userid=" + $scope.userinfo.devrant_id);
				source.onmessage = function (event) {
					$scope.$apply(function () {
						$scope.liveScore = event.data;
					});
				};
			} else {
				$scope.liveScore = "Not supported";
			}

			$http.get('https://devrant.com/api/users/' + $scope.userinfo.devrant_id + '?app=3').then(function(response){				
				if(response.data.success) {
					if(response.data.profile.content.content.rants.length == 0) {
						$scope.userinfo.latest_rant = false;
						$scope.userinfo.latest_rant_error = "No latest rant";
					} else {
						$scope.userinfo.latest_rant = "https://devrant.com/rants/" + response.data.profile.content.content.rants[0].id + "/";
						$scope.userinfo.latest_rant_error = "";
					}
				} else {
					$scope.userinfo.latest_rant = false;
					$scope.userinfo.latest_rant_error = "Error";
				}
			});
		} else {
			if(response.data.reason == "User not found") {
				$location.path("/userNotFound");
			} else {
				$scope.userinfo = {
					devrant_id: 0,
					username: "Error",
					start_time: 0,
					avatar_url: "",
					avatar_big_url: "",
					avatar_bg: "d55161",
					score: "Error",
					rants: "Error",
					comments: "Error",
					favorites: "Error",
					upvoted: "Error",
					collabs: "Error",
					scoreRank: "Error",
					rantsRank: "Error",
					latest_rant: "",
					latest_rant_error: ""
				};
			}
		}
	});
});