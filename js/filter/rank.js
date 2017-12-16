app.filter('rank', function() {
	return function(input) {
		if(!isNaN(input)) {
			input = parseInt(input);

			if(input == 1) {
				return input + "st";
			} else if(input == 2) {
				return input + "nd";
			} else if(input == 3) {
				return input + "rd";
			} else {
				return input + "th";
			}
		} else {
			return input;
		}
	};
});