app.controller('UserController', function ($scope, $location, $routeParams, $http, $filter) {
	$scope.fullscreenScore = function() {
		$location.path($location.path() + "/fullscreenScore");
	};

	$scope.updateBanner = function() {
		$scope.devBanner.subtext = $scope.devBanner.subtextInput;
	};

	$scope.getTotalScore = function () {
		var startScore = $scope.dataTotal[0][0].y;
		var endScore = $scope.dataTotal[0][$scope.dataTotal[0].length-1].y;
		return endScore - startScore;
	};

	$scope.getTotalRants = function () {
		var startRants = $scope.dataTotal[1][0].y;
		var endRants = $scope.dataTotal[1][$scope.dataTotal[1].length-1].y;
		return endRants - startRants;
	};

	$scope.mostLikesInOneDay = function () {
		var likesData = [];
		for(var i = 0; i < $scope.dataDaily[0].length; i++) {
			likesData[i] = $scope.dataDaily[0][i].y;
		}

		return likesData.reduce(function(a, b) {
			return Math.max(a, b);
		});
	};

	$scope.mostRantsInOneDay = function () {
		var rantsData = [];
		for(var i = 0; i < $scope.dataDaily[1].length; i++) {
			rantsData[i] = $scope.dataDaily[1][i].y;
		}

		return rantsData.reduce(function(a, b) {
			return Math.max(a, b);
		});
	};

	$scope.getTotalDonation = function () {
		var monthDiff = function(d1, d2) {
			var months;
			months = (d2.getFullYear() - d1.getFullYear()) * 12;
			months -= d1.getMonth() + 1;
			months += d2.getMonth();
			return months <= 0 ? 0 : months;
		};

		var donationPerMonth = 2;
		var member_since = $scope.userinfo.start_time * 1000;

		return monthDiff(new Date(member_since), new Date()) * donationPerMonth;
	};

	$scope.userinfo = {
		devrant_id: 0,
		username: "Loading...",
		start_time: false,
		created_time: false,
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
				$location.path("/userNotFound/" + $routeParams.username);
			} else {
				$scope.userinfo = {
					devrant_id: 0,
					username: "Error",
					start_time: false,
					created_time: false,
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

	$scope.datasetOverride_total = [
		{
		},
		{
			hidden: true
		},
		{
			hidden: true
		},
		{
			hidden: true
		},
		{
			hidden: true
		},
		{
			hidden: true
		}
	];

	$scope.datasetOverride_daily = [
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
		{
			lineTension: 0.1,
			fill: false
		}
	];
});