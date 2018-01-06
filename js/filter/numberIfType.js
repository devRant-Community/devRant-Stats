// applys number filter only if value is a number

app.filter('numberIfType', function ($filter) {
	return function (input) {
		if (typeof(input) == "number") {
			return $filter('number')(input);
		} else {
			return input;
		}
	};
});