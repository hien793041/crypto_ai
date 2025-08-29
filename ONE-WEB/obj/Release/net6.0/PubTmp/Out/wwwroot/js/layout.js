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

app.run(function ($rootScope) {
	$rootScope.ListPageSize = [
        { Id: 5, Text: '5' },
        { Id: 10, Text: '10' },
        { Id: 20, Text: '20' },
        { Id: 30, Text: '30' },
        { Id: 50, Text: '50' },
        { Id: 100, Text: '100' }
	];

	$rootScope.stringIsNumber = function (s) {
		var x = +s; // made cast obvious for demonstration
		return x.toString() == s;
	};
});

//angular.module('myApp').filter('Date', function () {
//	'use strict';
//	return function (input) {
//		if (input) {
//			var dateString = input.substr(6);
//			if (parseInt(dateString) < 0) {
//				var currentTime = new Date(parseInt(dateString));
//				if (currentTime.getFullYear() == 1)
//					return;
//			}

//			return parseInt(dateString);
//		}
//		else {
//			return;
//		}
//	};
//});

app.filter("trust", ['$sce', function ($sce) {
	return function (htmlCode) {
		return $sce.trustAsHtml(htmlCode);
	}
}]);


app.filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start; //parse to int
			return input.slice(start);
		}
		return [];
	}
});

app.filter('TimingAgo', function () {
	return function (input) {
		
		var startDate = new Date(input);
		var endDate = new Date();
		var diff = endDate.getTime() - startDate.getTime();
		var days = Math.floor(diff / (60 * 60 * 24 * 1000));
		var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
		var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
		var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
		if (days > 0)
			return days + ' days';
		else if (hours > 0)
			return hours + ' hours';

		return minutes + ' minutes';
	}
});

app.directive("compareTo", function () {
	return {
		require: "ngModel",
		scope:
		{
			confirmPassword: "=compareTo"
		},
		link: function (scope, element, attributes, modelVal) {
			modelVal.$validators.compareTo = function (val) {
				return val == scope.confirmPassword;
			};
			scope.$watch("confirmPassword", function () {
				modelVal.$validate();
			});
		}
	};
});

angular.module('myApp').filter('Date', function () {
	'use strict';
	return function (input) {
		if (input) {
			if (String(input).indexOf('T') > 0 || String(input).length < 6)
				return;

			var dateString = input.substr(6);
			if (parseInt(dateString) < 0) {
				var currentTime = new Date(parseInt(dateString));
				if (currentTime.getFullYear() <= 1)
					return;
			}

			return parseInt(dateString);
		}
		else {
			return;
		}
	};
});

app.filter('formatNumber', function () {
	return function (input, locale = '') {
		if (input == undefined)
			return null;

		var ret = input;

		if (locale == 'vi-VN') {
			ret = ret.replace(".", "|"); 
			ret = ret != null ? ret.replace(/,/g, ".") : '';
			ret = ret.replace("|", ","); 
		}
		else
			ret = input != null ? input.replace(/,/g, ",") : '';

		return ret;
	};
});

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
