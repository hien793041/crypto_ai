var app = angular.module('myApp', ['ui-notification']).config(function (NotificationProvider) {
	NotificationProvider.setOptions({
		delay: 3000,
		startTop: 60,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'right',
		positionY: 'top'
	});
});

angular.module('myApp').filter('Date', function () {
	'use strict';
	return function (input) {
		if (input) {
			var dateString = input.substr(6);
			if (parseInt(dateString) < 0) {
				var currentTime = new Date(parseInt(dateString));
				if (currentTime.getFullYear() == 1)
					return;
			}

			return parseInt(dateString);
		}
		else {
			return;
		}
	};
});

app.filter("trust", ['$sce', function ($sce) {
	return function (htmlCode) {
		return $sce.trustAsHtml(htmlCode);
	}
}]);

function getData(url, data, type = 'POST', async = false) {
	//var result = [];
	//var defer = $.Deferred(); 
	$.ajax({
		type: type,
		async: async,
		url: url,
		data: data,
		success: function (response) {
			//defer.resolve(response) 
			return response;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//defer.reject(err); 
		}
	});
	//return defer.promise();

	//return $.ajax({
	//	type: type,
	//	async: async,
	//	url: url,
	//	data: data
	//});
}