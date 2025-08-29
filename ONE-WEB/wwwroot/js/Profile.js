app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.ChangePassword = function () {
        if (!$scope.FormChangePassword.$valid)
            return;
        var input =
        {
            OldPassword: $scope.CurrentPassword, NewPassword: $scope.NewPassword, VerifyPassword: $scope.VerifyPassword
        };

        $.ajax({
            type: 'POST',
            url: '/Account/ChangePassword',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    Notification.success(data.Message);
                    $scope.CancelChangePassword();
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.CancelChangePassword = function () {
        $scope.CurrentPassword = '';
        $scope.NewPassword = '';
        $scope.VerifyPassword = '';
    };

    $scope.ChangeAvatar = function () {
        var input_data = new FormData();

        var files = $('#fileAvatar').get(0).files;
        var fileSize = 0;
        if (files.length > 0) {
            if (window.FormData !== undefined) {

                input_data.append("file", files[0]);
                fileSize += files[0].size;
            }

            $.ajax({
                type: 'POST',
                url: '/Account/ChangeAvatar',
                contentType: false,
                processData: false,
                async: true,
                data: input_data,
                dataType: 'json',
                success: function (data) {
                    if (data.Result > 0) {
                        Notification.success(data.Message);
                    }
                    else {
                        Notification.error(data.Message);
                    }
                    $scope.submitted = false;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $scope.submitted = false;
                    Notification.error(msgError);
                }
            });
        }

    };

    $scope.UpdateProfile = function () {
        if (!$scope.FormPersonalInfo.$valid)
            return;
        var input =
        {
            FullName: $scope.FullName, MobileNumber: $scope.MobileNumber, Interests: $scope.Interests
            , Occupation: $scope.Occupation, About: $scope.About
        };

        $.ajax({
            type: 'POST',
            url: '/Profile/UpdateProfile',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetProfileByUser = function () {

        $http(
            {
                method: 'POST',
                url: '/Profile/GetProfileByUser',
                data: {},
            }).then(function (response) {
                $scope.FullName = response.data.FullName;
                $scope.MobileNumber = response.data.MobileNumber;
                $scope.Interests = response.data.Interests;
                $scope.Occupation = response.data.Occupation;
                $scope.About = response.data.About;
            }, function (error) {
                
            });
    };

    $scope.GetProfileByUser();
});