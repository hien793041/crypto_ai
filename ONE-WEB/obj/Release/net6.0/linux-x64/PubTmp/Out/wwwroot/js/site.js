function CleanWordFormatting(input) {
	// 1. Remove line breaks / Mso classes
	var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
	var output = input.replace(stringStripper, ' ');

	// 2. Strip Word generated HTML comments
	var commentSripper = new RegExp('<!--(.*?)-->', 'g');
	var output = output.replace(commentSripper, '');
	var tagStripper = new RegExp('<(/)*(meta|link|\\?xml:|st1:|o:|font)(.*?)>', 'gi');

	// 3. Remove tags leave content if any
	output = output.replace(tagStripper, '');

	// 4. Remove everything in between and including tags '<style(.)style(.)>'
	var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
	for (var i = 0; i < badTags.length; i++) {
		tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
		output = output.replace(tagStripper, '');
	}

	// 5. Remove any unwanted styling
	// NOTE: Add your own list of 'blacklisted' css attributes here
	var badStyling = ['margin-top:', 'margin-bottom:', 'line-height:', 'mso-fareast-font-family:&quot;', 'font-weight:', 'margin:'];
	for (var i = 0; i < badStyling.length; i++) {
		attrStripper = new RegExp('(' + badStyling[i] + ')([^;]*)+[^]', 'gm');
		output = output.replace(attrStripper, '');
	}

	// 6. Remove any unwanted attributes
	var badAttributes = ['start'];
	for (var i = 0; i < badAttributes.length; i++) {
		var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
		output = output.replace(attributeStripper, '');
	}

	return output;
}

async function writeClipboard(input) {
	await navigator.clipboard.writeText(input);
}

function format_two_digits(n) {
	return n < 10 ? '0' + n : n;
}