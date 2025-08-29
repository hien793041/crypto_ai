var Page = 1;

function ChangePage(page) {
    Page = page;
    angular.element(document.getElementById('kt_content')).scope().GetTopics(Page);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.isAuthenticated = isAuthenticated;
    $scope.submitted = false;
    $scope.PageSize = 50;
    $scope.IsPractice = false;
    $scope.IsCheckPractice = false;
    $scope.ParentId = 'f725aed0-2c4e-4123-a0cf-c2606a8e4cec';
    $scope.IsTranslate = false;

    $scope.RepeatAudioEnglish = function () {
        var audioElement = document.getElementById('audioEnglish');

        if (audioElement == null)
            return;

        if ($('#chbRepeatEnglish').is(":checked")) {
            audioElement.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        else {
            audioElement.addEventListener('ended', function () {
                this.currentTime = 0;
                this.pause();
            }, false);
        }
    };

    $scope.TranslateEnglish = function () {
        
        if ($('#chbTranslate').is(":checked")) {
            $scope.IsTranslate = true;
        }
        else {
            $scope.IsTranslate = false;
        }
    };

    $scope.AddTopic = function () {
        if (!$scope.FormAddTopic.$valid)
            return;

        var sHTML = $('#Note_AddTopic').code(); 
        var input =
        {
            IsUpdate: false, Ordinal: $scope.OrdinalTopic, Name: $scope.Name, ParentId: $scope.ParentId
        };
        $.ajax({
            type: 'POST',
            url: '/English/UpdateTopic',
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

    $scope.GetEnglishTopics = function (page) {
        Page = page;

        var input =
        {
            Page: page, PageSize: $scope.PageSize, Type: 3
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetPublicTopics',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.EnglishTopics = data;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.EnglishTopics = [];
            }
        });
    };

    $scope.GetEnglishArticles = function (page, parentid) {
        Page = page;

        var input =
        {
            Page: page, PageSize: $scope.PageSize, Type: 3, ParentId: parentid
        };

        $.ajax({
            type: 'POST',
            url: '/Article/GetPublicTopics',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.EnglishArticles = data;
                if (!$scope.$$phase) { $scope.$apply(); }
                document.getElementById("tab2").click();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.EnglishArticles = [];
            }
        });
    };

    $scope.ChooseTopic = function (id, name) {
        $scope.TopicName = name;
        $scope.GetEnglishArticles(1, id);
    };

    $scope.GetTopics = function (page) {
        Page = page;

        var input =
        {
            Page: page, PageSize: $scope.PageSize, Type: 3, ParentId: $scope.ParentId
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

    $scope.ShowAddArticle = function (catid) {

        $scope.UpdateCategoryId = catid;
        $('#Note_AddTopic').code('');
        $('#Note_AddTopic_VN').code('');
        $scope.Name = '';
        $('#project_btRemoveAvatar').click();
    };

    $scope.AddArticle = function () {
        if (!$scope.FormAddTopic.$valid)
            return;

        var input_data = new FormData();

        var files = $('#fileAudio_Add').get(0).files;
        var fileSize = 0;
        if (files.length > 0) {
            if (window.FormData !== undefined) {

                input_data.append("file", files[0]);
                fileSize += files[0].size;
            }
        }

        var sHTML = $('#Note_AddTopic').code();
        var input =
        {
            IsUpdate: false, Ordinal: $scope.OrdinalArticle, Name: $scope.Name, Content: sHTML, CategoryId: $scope.UpdateCategoryId
            , ContentVN: $('#Note_AddTopic_VN').code()
        };

        input_data.append("data", JSON.stringify(input));

        $.ajax({
            type: 'POST',
            url: '/English/UpdateArticle',
            contentType: false,
            processData: false,
            async: true,
            data: input_data,
            dataType: 'json',
            success: function (data) {
                if (data.Result > 0) {
                    $('#Popup_AddArticle').modal('toggle');
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

    $scope.GetArticleBy = function (index, id) {
        $("#articleid-" + $scope.ActiveArticleId).css("color", "");
        $scope.ActiveArticleId = id;
        $scope.IsPractice = false;
        $scope.ArticleIndex = index;
        $("#articleid-" + id).css("color", "red");

        $scope.ConversationsVN = [];

        var input =
        {
            Id: id
        };

        $.ajax({
            type: 'POST',
            async: true,
            url: '/Article/GetPublicArticleBy',
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.Article = data;

                $scope.Conversations = [];

                var parser = new DOMParser();
                var doc = parser.parseFromString($scope.Article.Content, "text/html");
                var docVN = parser.parseFromString($scope.Article.Translate, "text/html");

                var bodyChildren = doc.querySelectorAll('p');
                var bodyChildrenVN = docVN.querySelectorAll('p');

                for (var i = 0; i < bodyChildren.length; i++) {
                    $scope.Conversations.push(bodyChildren[i].innerText);
                    $scope.ConversationsVN.push(bodyChildrenVN[i].innerText);
                }

                if (!$scope.$$phase) { $scope.$apply(); }


                $scope.RepeatAudioEnglish();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Conversations = [];
            }
        });
    };

    $scope.Practice = function () {
        $scope.IsPractice = !$scope.IsPractice;
        $scope.IsCheckPractice = false;

        $scope.Conversations = [];
        $scope.ConversationsPractice = [];

        var parser = new DOMParser();
        var html = '';

        if ($scope.IsPractice)
            html = $scope.Article.Translate;
        else
            html = $scope.Article.Content;

        var doc = parser.parseFromString(html, "text/html");

        var bodyChildren = doc.querySelectorAll('p');
        for (var i = 0; i < bodyChildren.length; i++) {
            $scope.Conversations.push(bodyChildren[i].innerText);
            $scope.ConversationsPractice.push(bodyChildren[i].innerText);
        }

        if (!$scope.$$phase) { $scope.$apply(); }
    };

    $scope.CheckPractice = function () {
        $scope.IsCheckPractice = true;

        $scope.Conversations = [];
        var parser = new DOMParser();
        var html = '';

        html = $scope.Article.Content;

        var doc = parser.parseFromString(html, "text/html");

        var bodyChildren = doc.querySelectorAll('p');
        $scope.CheckResult = '';
        var countSame = 0;

        for (var i = 0; i < bodyChildren.length; i++) {
            $scope.Conversations.push(bodyChildren[i].innerText);
            if (($('#inpPractice_' + i).val()).toLowerCase().trim() == (bodyChildren[i].innerText).toLowerCase().trim()) {
                $('#inpPractice_' + i).css({ "color": "#3598dc" });
                countSame++;
            }
            else {
                $('#inpPractice_' + i).css({ "color": "red" });
            }

            $scope.CheckResult = countSame + '/' + bodyChildren.length;

            //console.log($('#inpPractice_' + i).val());
        }

        if (!$scope.$$phase) { $scope.$apply(); }
    };

    $scope.GetEnglishTopics(1);
    //$scope.GetTopics(Page);
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