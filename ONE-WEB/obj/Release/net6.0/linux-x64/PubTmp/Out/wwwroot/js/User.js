var Page = 1;

function ChangePage(page) {
    Page = page;
    angular.element(document.getElementById('kt_content')).scope().GetUsers(Page);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.PageSize = 10;

    $scope.Search = function () {
        
        $scope.GetUsers(1);
    };

    $scope.GetUsers = function (page) {
        Page = page;

        if ($scope.Search_Status == undefined || $scope.Search_Status == null)
            $scope.Search_Status = -1;

        var input =
        {
            Page: page, PageSize: $scope.PageSize, Status: $scope.Search_Status, FullName: $scope.Search_FullName, UserName: $scope.Search_UserName
            , Email: $scope.Search_Email
        };

        $.ajax({
            type: 'POST',
            url: '/User/GetUsers',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Users = data;
                if ($scope.Users != null && $scope.Users.length > 0) {
                    GetPageList('pager', Math.ceil(data[0].TotalRow / $scope.PageSize), page);
                    $scope.TotalRow = $scope.Users[0].TotalRow;
                    $scope.FromRow = $scope.Users[0].Row;
                    $scope.ToRow = $scope.Users[$scope.Users.length - 1].Row;
                }
                else {
                    $scope.TotalRow = 0;
                    $scope.FromRow = 0;
                    $scope.ToRow = 0;
                    $('#pager').html('');
                }
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Users = [];
                $scope.TotalRow = 0;
                $scope.FromRow = 0;
                $scope.ToRow = 0;
                $('#pager').html('');
            }
        });

    };

    $scope.UpdateUserStatus = function (id, status) {
        
        var input =
        {
            Id: id, Status: status
        };
        $.ajax({
            type: 'POST',
            url: '/User/UpdateUserStatus',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result <= 0) {
                    Notification.error(data.Message);
                }
                else {
                    $scope.GetUsers(Page);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Notification.error(msgError);
            }
        });
    };

    $scope.ChangeStatus = function (id, status) {
        $scope.UpdateUserStatus(id, status);
    };

    $scope.GetListStatus = function (type) {
        var input =
        {
            Type: type
        };

        $.ajax({
            type: 'POST',
            url: '/Home/GetStatus',
            async: false,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.ListStatus = data;
                //$scope.ListStatus = [{ "Id": -1, "Name": "All" }].concat($scope.ListStatus);
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.ListStatus = [];
            }
        });

    };

    $scope.ViewProfile = function (id) {
        $("#detail-" + id).toggle();
        
        if ($("#detail-" + id).is(':visible')) {
            document.getElementById("btdetail-" + id).innerHTML = msgHide;  
        }
        else
            document.getElementById("btdetail-" + id).innerHTML = msgView;
    };

    $scope.GetListStatus(1);
    $scope.GetUsers(Page);
});
