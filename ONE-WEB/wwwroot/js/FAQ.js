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

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.GetPublicArticles = function () {
        var input =
        {
            CategoryId: $scope.TopicId, Page: 1, PageSize: 100
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetPublicArticles',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Articles = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Articles = [];
            }
        });

    };

    $scope.GetTopicBy = function () {

        $scope.TopicId = queryParameters().topicid;

        var input =
        {
            Id: $scope.TopicId
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Article/GetTopicBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.TopicName = data.Name;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.GetTopicBy();
    $scope.GetPublicArticles();
});

app.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);