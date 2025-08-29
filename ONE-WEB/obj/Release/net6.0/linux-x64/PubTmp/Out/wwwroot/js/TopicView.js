app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    
    $scope.AddArticle = function () {
        if (!$scope.FormAddTopic.$valid)
            return;

        var sHTML = $('#Note_AddTopic').code(); 
        var input =
        {
            IsUpdate: false, Ordinal: 1, Name: $scope.Name, Content: sHTML, CategoryId: $scope.TopicId
        };
        $.ajax({
            type: 'POST',
            url: '/Article/UpdateArticle',
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
                $scope.GetArticles();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetArticles = function () {
        var input =
        {
            CategoryId: $scope.TopicId, Page: 1, PageSize: 100
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetArticles',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Articles = data;
                if ($scope.Articles.length > 0)
                    $scope.GetArticleBy($scope.Articles[0].Id);
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

    $scope.GetArticleBy = function (id) {

        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Article/GetArticleBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Article = data;
                
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    };

    $scope.ShowEditArticle = function () {

        $scope.Name_Edit = $scope.Article.Title;
        $('#Note_EditTopic').code($scope.Article.Content);
    };

    $scope.UpdateArticle = function () {
        if (!$scope.FormEditTopic.$valid)
            return;

        var sHTML = $('#Note_EditTopic').code();
        var input =
        {
            Id: $scope.Article.Id, IsUpdate: true, Ordinal: 1, Name: $scope.Name_Edit, Content: sHTML, CategoryId: $scope.TopicId
        };
        $.ajax({
            type: 'POST',
            url: '/Article/UpdateArticle',
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
                $scope.GetArticleBy($scope.Article.Id);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetTopicBy();
    $scope.GetArticles();
});
