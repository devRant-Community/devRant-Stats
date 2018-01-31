app.controller('UserController', function ($scope, $location, $routeParams, $http, $filter) {
	$scope.fullscreenScore = function() {
		$location.path($location.path() + "/fullscreenScore");
	};

	$scope.updateBanner = function() {
		$scope.devBanner.subtext = $scope.devBanner.subtextInput;
	};

	$scope.userinfo = {
		devrant_id: 0,
		username: "Loading...",
		start_time: false,
		avatar_url: "",
		avatar_big_url: "",
		avatar_bg: "d55161",
		scoreRank: "Loading...",
		rantsRank: "Loading...",
		latest_rant: "",
		latest_rant_error: ""
	};

	$scope.liveData = {
		score: "Loading...",
		rants: "Loading...",
		comments: "Loading...",
		favorites: "Loading...",
		upvoted: "Loading...",
		collabs: "Loading..."
	};
	
	$scope.dataTotal = false;
	$scope.dataDaily = false;
	$scope.dataFuture = false;
	$scope.dataError = "Loading...";

	$scope.devBanner = {
		username: "",
		subtext: "",
		subtextInput: ""
	};
	
	$http.get('https://skayo.2ix.de/api/getUserInfo.php?username=' + $routeParams.username).then(function(response) {
		if (response.data.success) {
			$scope.userinfo = response.data.userinfo;

			$scope.devBanner.username = response.data.userinfo.username;
			$scope.devBanner.subtext = "Score:  " + response.data.userinfo.score;

			if (typeof (EventSource) !== 'undefined') {
				var source = new EventSource("https://skayo.2ix.de/api/liveData.php?userid=" + $scope.userinfo.devrant_id);
				source.onmessage = function (event) {
					$scope.$apply(function () {
						$scope.liveData = JSON.parse(event.data);
					});
				};
			} else {
				$scope.liveData = {
					score: response.data.userinfo.score, // Score gets sent with other API call, so use it.
					rants: response.data.userinfo.rants, // Rants too.
					comments: "Live Events not supported.", // Use a better fucking browser, asshole.
					favorites: "Live Events not supported.", 
					upvoted: "Live Events not supported.", 
					collabs: "Live Events not supported."
				};
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

			$http.get('https://skayo.2ix.de/api/getUserStats.php?id=' + $scope.userinfo.devrant_id).then(function(response) {
				if(response.data.success) {
					$scope.dataTotal = response.data.stats.total;
					$scope.dataDaily = response.data.stats.daily;
					$scope.dataFuture = response.data.stats.future;
					$scope.dataError = "";

					if(typeof($scope.dataFuture) == "string") {
						$scope.dataError = angular.copy($scope.dataFuture);
						$scope.dataFuture = false;
					}
				} else {
					$scope.dataError = "No data";
					$scope.dataTotal = false;
					$scope.dataDaily = false;
					$scope.dataFuture = false;
				}
			});
		} else {
			if(response.data.reason == "User not found") {
				$location.path("/userNotFound");
			} else {
				$scope.userinfo = {
					devrant_id: 0,
					username: "Error",
					start_time: false,
					avatar_url: "",
					avatar_big_url: "",
					avatar_bg: "d55161",
					scoreRank: "Error",
					rantsRank: "Error",
					latest_rant: "",
					latest_rant_error: ""
				};
			}
		}
	});
	

	$scope.chartSeries = ['Score', 'Rants', 'Comments', 'Favorites', 'Upvoted', 'Collabs'];
	$scope.chartOptions = {
		legend: {
			display: true,
			labels: {
				fontSize: 14,
				fontColor: '#fff',
				fontFamily: "'Comfortaa', sans-serif"
			}
		},
		layout: {
			padding: {
				top: 10
			}
		},
		scales: {
			xAxes: [{
				type: 'time',
				distribution: 'series',
				bounds: 'data',
				time: {
					unit: 'day'
				}
			}]
		},
		tooltips: {
			mode: 'index',
			intersect: false,
			callbacks: {
				label: function(tooltipItem, data) {
					var name = data.datasets[tooltipItem.datasetIndex].label + ': ';
					return name + '+' + $filter('number')(tooltipItem.yLabel);
				}
			}
		}
	};
	
	$scope.chartOptions_daily = angular.copy($scope.chartOptions);
	$scope.chartOptions_daily.tooltips.callbacks = {
		labelTextColor: function (tooltipItem, chart) {
			if(tooltipItem.yLabel < 0) {
				return '#F00';
			} else if(tooltipItem.yLabel > 0) {
				return '#0F0';
			}

			return '#FFF';
		},
		label: function(tooltipItem, data) {
			var name = data.datasets[tooltipItem.datasetIndex].label + ': ';
			if(tooltipItem.yLabel > 0) {
				return name + '+' + $filter('number')(tooltipItem.yLabel);
			}

			return name + tooltipItem.yLabel;
		}
	};

	$scope.datasetOverride = [
		{
			lineTension: 0.1,
			fill: false
		},
		{
			lineTension: 0.1,
			fill: false
		},
		{
			lineTension: 0.1,
			fill: false
		},
		{
			lineTension: 0.1,
			fill: false
		},
		{
			lineTension: 0.1,
			fill: false
		},
	]
});