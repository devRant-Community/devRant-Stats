app.controller('UserController', function ($scope, $location, $routeParams, $http) {
	$scope.userinfo = {
		devrant_id: 0,
		username: "Loading...",
		start_time: 0,
		avatar_url: "",
		avatar_bg: "d55161",
		score: "Loading...",
		rants: "Loading...",
		comments: "Loading...",
		favorites: "Loading...",
		upvoted: "Loading...",
		collabs: "Loading...",
		scoreRank: "Loading...",
		rantsRank: "Loading..."
	};

	$http.get('https://skayo.2ix.at/DevRantStats/api/getUserInfo.php?username=' + $routeParams.username).then(function(response) {
		if (response.data.success) {
			$scope.userinfo = response.data.userinfo;
			console.log(response);
		} else {
			if(response.data.reason == "User not found") {
				alert("User not found!");
				$location.path("/");
			} else {
				$scope.userinfo = {
					devrant_id: 0,
					username: "Error",
					start_time: 0,
					avatar_url: "",
					avatar_bg: "d55161",
					score: "Error",
					rants: "Error",
					comments: "Error",
					favorites: "Error",
					upvoted: "Error",
					collabs: "Error",
					scoreRank: "Error",
					rantsRank: "Error"
				};
			}
		}
	});
});