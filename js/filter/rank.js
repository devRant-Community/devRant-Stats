app.filter('rank', function() {
	return function(input) {
		if(!isNaN(input)) {
			input = parseInt(input);
			var lastDigit = input % 10;
			
			if(lastDigit == 1) {
				return input + "st";
			} else if (lastDigit == 2) {
				return input + "nd";
			} else if (lastDigit == 3) {
				return input + "rd";
			} else {
				return input + "th";
			}
		} else {
			return input;
		}
	};
});