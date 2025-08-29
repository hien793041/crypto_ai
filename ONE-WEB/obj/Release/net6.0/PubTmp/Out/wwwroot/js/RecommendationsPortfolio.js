var PagePortfolio = 1, PageArticle = 1;

function ChangePage(page) {
    PagePortfolio = page;
    angular.element(document.getElementById('kt_content')).scope().GetProjects(PagePortfolio);
}

function ChangePageArticle(page) {
    PageArticle = page;
    angular.element(document.getElementById('kt_content')).scope().GetArticles(PageArticle);
}

app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {
    $scope.submitted = false;
    $scope.StockId = '';
    $scope.TotalRow = 0;
    $scope.PageSize = 10;
    $scope.RecommendationBuyPrice = '';
    $scope.RecommendationTargetPrice = '';
    $scope.RecommendationStopLoss = '';
    $scope.RecommendationRRR = '';
    $scope.RecommendationValuation = '';
    $scope.RecommendationFinancialHealth = '';
    $scope.RecommendationIntendTime = '';

    $scope.TotalRowArticle = 0;
    $scope.FromRowArticle = 0;
    $scope.ToRowArticle = 0;

    $scope.GetClassIndex = function (value) {
        if(value > 0)
            return 'index-increase';
        else if (value < 0)
            return 'index-decrease';

        return 'index-sideways';
    }; 

    $scope.stringIsNumber = function (s) {
        var x = +s; // made cast obvious for demonstration
        return x.toString() == s;
    }; 

    $("#RecommendationCode_Search").autocomplete({
        minLength: 1
    });

    $scope.Complete_RecommendationCode = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.RecommendationCode
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/SearchStock',
            async: false,
            dataType: 'json',
            data: { data: JSON.stringify(input) },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var obj = {
                        value: data[i].Code, // + (data[i].Name != null ? " - " + data[i].Name : ""),
                        id: data[i].Id
                    };
                    $scope.availableTags.push(obj);
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

        $("#RecommendationCode_Search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                $scope.RecommendationStockId = ui.item.id;
            }
        });

    }

    $scope.calculateDiffDay = function (dateStart, dateEnd)
    {
        if (dateStart == null) {
            return '';
        }
        else
            dateStart = new Date(dateStart);

        if (dateEnd == null){
            dateEnd = new Date();
        }

        var dayDif = Math.floor((Date.UTC(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24));

        return dayDif;
    };

    $scope.StatusClass = function (value) {
        if (value === 1)
            return 'active';
        else if (value === 2)
            return 'success';
        return 'danger';
    };

    $scope.GetRecommendationsPortfolio = function (page) {
        PagePortfolio = page;

        pagesize = $('#selRecordPortfolio').val() == '' ? 10 : $('#selRecordPortfolio').val();

        if ($scope.Search_Status == undefined || $scope.Search_Status == null)
            $scope.Search_Status = -1;

        var input =
        {
            Page: page, PageSize: pagesize, Status: $scope.Search_Status
        };

        var post = $http({
            method: "POST",
            url: '/Stock/GetRecommendationsPortfolio',
            dataType: 'json',
            params: { data: JSON.stringify(input) },
            headers: { "Content-Type": "application/json" }
        });

        post.success(function (data, status) {
            $scope.RecommendationsPortfolio = data;
            if (data != undefined && data.length > 0) {
                GetPageList('pagerPortfolio', Math.ceil(data[0].TotalRow / pagesize), page);
                $scope.TotalRow = $scope.RecommendationsPortfolio[0].TotalRow;
                $scope.FromRow = $scope.RecommendationsPortfolio[0].Row;
                $scope.ToRow = $scope.RecommendationsPortfolio[$scope.RecommendationsPortfolio.length - 1].Row;
            }
            else {
                $scope.TotalRow = 0;
                $scope.FromRow = 0;
                $scope.ToRow = 0;
                $('#pagerPortfolio').html('');
            }
        });

        post.error(function (data, status) {
            $scope.RecommendationsPortfolio = [];
            $scope.TotalRow = 0;
            $scope.FromRow = 0;
            $scope.ToRow = 0;
            $('#pagerPortfolio').html('');
        });

    };

    $scope.ShowAddRecommendation = function () {
        $scope.RecommendationCode = '';
        $scope.RecommendationStockId = '';
    };

    $scope.AddRecommendation = function () {
        if (!$scope.FormAddRecommendation.$valid)
            return;

        var input =
        {
            IsUpdate: false, StockId: $scope.RecommendationStockId, BuyPrice: $scope.RecommendationBuyPrice, BuyPrice: $scope.RecommendationBuyPrice
            , TargetPrice: $scope.RecommendationTargetPrice, StopLoss: $scope.RecommendationStopLoss, RRR: $scope.RecommendationRRR
            , Valuation: $scope.RecommendationValuation, ReasonableLevel: $scope.RecommendationReasonableLevel, LevelOfFluctuation: $scope.RecommendationLevelOfFluctuation
            , FinancialHealth: $scope.RecommendationFinancialHealth, IntendTime: $scope.RecommendationIntendTime
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/UpdateRecommendationsPortfolio',
            async: true,
            data: { data: JSON.stringify(input) },
            dataType: 'json',
            success: function (data) {
                if (data != null && data.Result > 0) {
                    $('#Popup_AddRecommendationsPortfolio').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }

                $scope.submitted = false;
                $scope.GetRecommendationsPortfolio(1);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetArticles = function (page) {
        PageArticle = page;

        pagesize = $('#selRecordArticle').val() == '' ? 10 : $('#selRecordArticle').val();

        var input =
        {
            CategoryId: "3d6c5732-173c-4a25-9108-b1e327ba6259", Page: page, PageSize: pagesize
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
                if (data != undefined && data.length > 0) {
                    GetPageListWithFunction('pagerArticle', Math.ceil(data[0].TotalRow / pagesize), page, ChangePageArticle);
                    $scope.TotalRowArticle = $scope.Articles[0].TotalRow;
                    $scope.FromRowArticle = $scope.Articles[0].Row;
                    $scope.ToRowArticle = $scope.Articles[$scope.Articles.length - 1].Row;
                }
                else {
                    $scope.TotalRowArticle = 0;
                    $scope.FromRowArticle = 0;
                    $scope.ToRowArticle = 0;
                    $('#pagerArticle').html('');
                }

                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.Articles = [];
                if (!$scope.$$phase) { $scope.$apply(); }
            }
        });

    };

    $scope.AddArticle = function () {
        if (!$scope.FormAddTopic.$valid)
            return;

        var sHTML = $('#Note_AddTopic').code();
        var input =
        {
            IsUpdate: false, Ordinal: 1, Name: $scope.Name, Content: sHTML, CategoryId: "3d6c5732-173c-4a25-9108-b1e327ba6259"
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
                    $('#Popup_AddArticle').modal('toggle');
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

    $scope.ShowEditArticle = function (x) {
        $scope.Article = x;

        $scope.Name_Edit = $scope.Article.Title;
        $('#Note_EditTopic').code($scope.Article.Content);
    };

    $scope.UpdateArticle = function () {
        if (!$scope.FormEditTopic.$valid)
            return;

        var sHTML = $('#Note_EditTopic').code();
        var input =
        {
            Id: $scope.Article.Id, IsUpdate: true, Ordinal: 1, Name: $scope.Name_Edit, Content: sHTML, CategoryId: "3d6c5732-173c-4a25-9108-b1e327ba6259"
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
                    $('#Popup_EditArticle').modal('toggle');
                    Notification.success(data.Message);
                }
                else {
                    Notification.error(data.Message);
                }
                $scope.submitted = false;
                $scope.GetArticles(PageArticle);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $scope.submitted = false;
                Notification.error(msgError);
            }
        });
    };

    $scope.GetRecommendationsPortfolio(1);
    $scope.GetArticles(1);
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

app.filter('formatNumber', function () {
    return function (input) {
        return input != null ? input.replace(/,/g, ".") : '';
    };
});