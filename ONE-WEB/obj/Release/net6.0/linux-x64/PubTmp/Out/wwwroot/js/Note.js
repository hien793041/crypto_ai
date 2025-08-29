app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.TopicId = 'c06b8273-0b8c-430c-bb4e-26fa2fc88191';
    
    $scope.AddArticle = function () {
        //if (!$scope.FormAddTopic.$valid)
        //    return;

        var sHTML = $('#Note_AddTopic').code(); 
        if (sHTML.length === 0) {
            return;
        }

        var input =
        {
            IsUpdate: false, Ordinal: 1, Name: '', Content: sHTML, CategoryId: $scope.TopicId
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
                    $scope.HideAddArticle();
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
            CategoryId: $scope.TopicId, Page: 1, PageSize: 1000
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
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Articles = [];
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

    $scope.ShowAddArticle = function () {
        /*$('#Popup_AddTopic').modal('show');*/
        $('#Note_AddTopic').code('');
        $('#add-note').show();
    };

    $scope.HideAddArticle = function () {
        $('#add-note').hide();
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

    $scope.NotesDone = function () {
        $('[data-toggle="confirmation"]').confirmation({
            // Optional configuration options
            rootSelector: '[data-toggle="confirmation"]', // Ensures correct targeting for dynamic content
            container: 'body', // Appends confirmation to the body for better positioning
            //title: 'Bạn muốn xóa?',
            btnOkLabel: 'Có',
            btnCancelLabel: 'Không',
            onConfirm: function (event, element) {
                // Code to execute if 'Yes' is clicked
                $scope.DeleteArticleBy($scope.ArticleId);
            },
            onCancel: function (event, element) {
                
            }
        });
    };

    $scope.ChooseArticle = function (id) {
        $scope.ArticleId = id;
    };

    $scope.DeleteArticleBy = function (id) {
        
        //$('#note_' + id).confirmation('show');

        //return;

        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            url: '/Article/DeleteArticleBy',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    //Notification.success(data.Message);
                    $('#note_' + id).remove();
                    $scope.NotesSort();
                }
                else {
                    Notification.error(data.Message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Notification.error(msgError);
            }
        });
    };

    $scope.NotesSort = function () {
        var result = [];
        $('#sortable_portlets > .column').each(function (i, obj) {
            var $parent = $(obj); // Cache the current parent element

            var chils = [];
            $parent.children().each(function () {
                var id = $(this).attr('data-val');
                if (id != undefined) {
                    var element = { id: id };
                    chils.push(element);
                }
                
            });

            result.push(chils);

        });

        var myMemo = JSON.stringify(result);

        var input =
        {
            IsUpdate: false, Content: myMemo, CategoryId: $scope.TopicId
        };

        $.ajax({
            type: 'POST',
            url: '/Article/UpdateMemo',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data.Result > 0) {
                    
                }
                else {
                    Notification.error(data.Message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Notification.error(msgError);
            }
        });
    };

    $scope.GetMemoBy = function () {
        $scope.Memo = [];

        var input =
        {
            CategoryId: $scope.TopicId
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetMemoBy',
            async: false,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if(data != null)
                    $scope.Memo = JSON.parse(data.Content);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Memo = [];
            }
        });

    };

    $scope.GetNoteBy = function (id) {
        if ($scope.Articles != undefined) {
            var result = $scope.Articles.find(obj => obj.Id === id);
            return result;
        }
        return null;
    };

    $scope.CheckPosition = function (i, id) {
        if (i === 0) {
            var flagExist = false;
            for (var k = 0; k < $scope.Memo.length; k++) {
                var _index = $scope.Memo[k].findIndex(obj => obj.id === id);
                if (_index >= 0)
                    flagExist = true;
            }

            if (!flagExist)
                return true;
        }

        return false;
    };

    $scope.GetMemoBy();
    $scope.GetArticles();

});
