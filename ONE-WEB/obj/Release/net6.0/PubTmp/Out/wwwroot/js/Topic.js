var Page = 1;

function ChangePage(page) {
    Page = page;
    angular.element(document.getElementById('kt_content')).scope().GetTopics(Page);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.PageSize = 10;

    $scope.AddTopic = function () {
        if (!$scope.FormAddTopic.$valid)
            return;

        var sHTML = $('#Note_AddTopic').code(); 
        var input =
        {
            IsUpdate: false, Ordinal: 1, Name: $scope.Name, Description: sHTML
        };
        $.ajax({
            type: 'POST',
            url: '/Article/UpdateTopic',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_AddTopic').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetTopics(1);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetTopics = function (page) {
        Page = page;

        var input =
        {
            Page: page, PageSize: $scope.PageSize
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetTopics',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Topics = data;
                if ($scope.Topics != null && $scope.Topics.length > 0) {
                    GetPageList('pager', Math.ceil(data[0].TotalRow / $scope.PageSize), page);
                    $scope.TotalRow = $scope.Topics[0].TotalRow;
                    $scope.FromRow = $scope.Topics[0].Row;
                    $scope.ToRow = $scope.Topics[$scope.Topics.length - 1].Row;
                }
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Topics = [];
            }
        });

        //var post = $http({
        //    method: "POST",
        //    url: '/Article/GetTopics',
        //    dataType: 'json',
        //    params: { data: JSON.stringify(input) },
        //    headers: { "Content-Type": "application/json" }
        //});

        //post.success(function (data, status) {
        //    $scope.Topics = data;
        //    if ($scope.Topics != null && $scope.Topics.length > 0) {
        //        GetPageList('pager', Math.ceil(data[0].TotalRow / $scope.PageSize), page);
        //        $scope.TotalRow = $scope.Topics[0].TotalRow;
        //        $scope.FromRow = $scope.Topics[0].Row;
        //        $scope.ToRow = $scope.Topics[$scope.Topics.length - 1].Row;
        //    }
        //});

        //post.error(function (data, status) {
        //    $scope.Topics = [];
        //});

        //$http(
        //    {
        //        method: 'POST',
        //        url: '/Article/GetTopics',
        //        params: { data: JSON.stringify(input) },
        //    }).then(function (response) {
        //        $scope.Topics = response.data;
        //        if ($scope.Topics != null && $scope.Topics.length > 0) {
        //            GetPageList('pager', Math.ceil(response.data[0].TotalRow / $scope.PageSize), page);
        //            $scope.TotalRow = $scope.Topics[0].TotalRow;
        //            $scope.FromRow = $scope.Topics[0].Row;
        //            $scope.ToRow = $scope.Topics[$scope.Topics.length - 1].Row;
        //        }
        //    }, function (error) {
        //        $scope.Topics = [];
        //    });
    };

    $scope.GetTopicBy = function (id) {
        $scope.Id = id;

        var input =
        {
            Id: id
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
                //var data = JSON.parse(response);
                $scope.Name_Edit = data.Name;
                $('#Note_EditTopic').code(data.Description);
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.UpdateTopic = function () {
        if (!$scope.FormEditTopic.$valid)
            return;

        var sHTML = $('#Note_EditTopic').code();
        var input =
        {
            Id: $scope.Id, IsUpdate: true, Ordinal: 1, Name: $scope.Name_Edit, Description: sHTML
        };
        $.ajax({
            type: 'POST',
            url: '/Article/UpdateTopic',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_EditTopic').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetTopics(Page);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetTopics(Page);
});

app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});