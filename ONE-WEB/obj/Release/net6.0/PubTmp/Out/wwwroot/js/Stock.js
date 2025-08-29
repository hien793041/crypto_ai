var PagePortfolio = 1, PageArticle = 1, PageStockTrading = 1;



function openCity(evt, idtab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById('Content' + idtab).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("tabWatchlist").click();
// A function is used for dragging and moving
function dragElement(element, direction) {
    var md; // remember mouse down info
    const first = document.getElementById("first");
    const second = document.getElementById("second");

    element.onmousedown = onMouseDown;

    function onMouseDown(e) {
        //console.log("mouse down: " + e.clientX);
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth
        };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e) {
        //console.log("mouse move: " + e.clientX);
        var delta = {
            x: e.clientX - md.e.clientX,
            y: e.clientY - md.e.clientY
        };

        if (direction === "H") // Horizontal
        {
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
    }
}

function dragElement2(element, direction) {
    var md; // remember mouse down info
    const first = document.getElementById("second");
    const second = document.getElementById("third");

    element.onmousedown = onMouseDown;

    function onMouseDown(e) {
        //console.log("mouse down: " + e.clientX);
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth + 60
        };

        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            //console.log("mouse up");
            document.onmousemove = document.onmouseup = null;
        }
    }

    function onMouseMove(e) {
        //console.log("mouse move: " + e.clientX);
        var delta = {
            x: e.clientX - md.e.clientX,
            y: e.clientY - md.e.clientY
        };

        if (direction === "H") // Horizontal
        {
            // Prevent negative-sized elements
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            first.style.width = (md.firstWidth + delta.x) + "px";
            second.style.width = (md.secondWidth - delta.x) + "px";
        }
    }
}

dragElement(document.getElementById("separator"), "H");
dragElement2(document.getElementById("separator2"), "H");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function () {
    function moveColumn(table, sourceIndex, targetIndex) {
        console.log("Move Col " + sourceIndex + " to " + targetIndex);
        var body = $("tbody", table);
        $("tr", body).each(function (i, row) {
            $("td", row).eq(sourceIndex).insertAfter($("td", row).eq(targetIndex - 1));
        });
    }

    $("#tblRecommendationsPortfolio > thead > tr").sortable({
        items: "> th.sortme",
        start: function (event, ui) {
            ui.item.data("source", ui.item.index());
        },
        update: function (event, ui) {
            moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index());
            $(".mytable > tbody").sortable("refresh");
        }
    });

    $("#tblRecommendationsPortfolio > tbody").sortable({
        items: "> tr.sortme"
    });
});

function initOnReady() {
    var widget = window.tvWidget = new TradingView.widget({
        height: 450,
        width: '100%',
        debug: true, // uncomment this line to see Library errors and warnings in the console
        //fullscreen: true,
        symbol: 'VN-Index',
        interval: '1D',
        container_id: "tv_chart_container",
        timezone: "Asia/Ho_Chi_Minh",
        // BEWARE: no trailing slash is expected in feed URL
        //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/trading-view/udf"),
        library_path: "/charting_library/",
        locale: getParameterByName('lang') || "en",

        disabled_features: ["use_localstorage_for_settings"], // 'left_toolbar', "header_widget", 
        enabled_features: ["study_templates"], // "hide_left_toolbar_by_default"
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.dotnet',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
    });
};

function initOnReady_Index(symbol) {
    var widget = window.tvWidget = new TradingView.widget({
        height: 350,
        width: '100%',
        debug: true, // uncomment this line to see Library errors and warnings in the console
        //fullscreen: true,
        symbol: symbol,
        interval: '1D',
        container_id: "tv_chart_index",
        timezone: "Asia/Ho_Chi_Minh",
        // BEWARE: no trailing slash is expected in feed URL
        //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/trading-view/udf"),
        library_path: "/charting_library/",
        locale: getParameterByName('lang') || "en",

        disabled_features: ['left_toolbar', "header_widget"], // 'left_toolbar', "header_widget",
        enabled_features: ["hide_left_toolbar_by_default"], // "hide_left_toolbar_by_default"
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.dotnet',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
    });
};

window.addEventListener('DOMContentLoaded', initOnReady, false);
//window.addEventListener('DOMContentLoaded', initOnReady_Index('VN-Index'), false);

var chart_Index = null;

(async () => {

    function addPopupEvents(chart) {
        const closePopupButtons = document.getElementsByClassName(
            'highcharts-close-popup'
        );
        // Close popup button:
        Highstock.addEvent(
            closePopupButtons[0],
            'click',
            function () {
                this.parentNode.style.display = 'none';
            }
        );

        Highstock.addEvent(
            closePopupButtons[1],
            'click',
            function () {
                this.parentNode.style.display = 'none';
            }
        );

        // Add an indicator from popup
        Highstock.addEvent(
            document.querySelectorAll('.highcharts-popup-indicators button')[0],
            'click',
            function () {
                const typeSelect = document.querySelectorAll(
                    '.highcharts-popup-indicators select'
                )[0],
                    type = typeSelect.options[typeSelect.selectedIndex].value,
                    period = document.querySelectorAll(
                        '.highcharts-popup-indicators input'
                    )[0].value || 14;

                chart.addSeries({
                    linkedTo: 'aapl-ohlc',
                    type: type,
                    params: {
                        period: parseInt(period, 10)
                    }
                });

                chart.stockToolbar.indicatorsPopupContainer.style.display =
                    'none';
            }
        );

        // Update an annotation from popup
        Highstock.addEvent(
            document.querySelectorAll(
                '.highcharts-popup-annotations ' +
                'button'
            )[0],
            'click',
            function () {
                const strokeWidth = parseInt(
                    document.querySelectorAll(
                        '.highcharts-popup-annotations ' +
                        'input[name="stroke-width"]'
                    )[0].value,
                    10
                ),
                    strokeColor = document.querySelectorAll(
                        '.highcharts-popup-annotations input[name="stroke"]'
                    )[0].value;
                // Stock/advanced annotations have common options under
                // typeOptions
                if (chart.currentAnnotation.options.typeOptions) {
                    chart.currentAnnotation.update({
                        typeOptions: {
                            lineColor: strokeColor,
                            lineWidth: strokeWidth,
                            line: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            background: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            innerBackground: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            outerBackground: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            connector: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            }
                        }
                    });
                } else {
                    // Basic annotations:
                    chart.currentAnnotation.update({
                        shapes: [{
                            'stroke-width': strokeWidth,
                            stroke: strokeColor
                        }],
                        labels: [{
                            borderWidth: strokeWidth,
                            borderColor: strokeColor
                        }]
                    });
                }
                chart.stockToolbar.annotationsPopupContainer.style.display =
                    'none';
            }
        );
    }

    // Load the dataset
    //const data = await fetch(
    //    'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    //).then(response => response.json());

    var dataIndex = [], stockCode = '';

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [];

    chart_Index = Highstock.stockChart('tv_chart_index', {
        chart: {
            //marginLeft: 30,
            //marginRight: 30,
            events: {
                load: function () {
                    addPopupEvents(this);
                }
            }
        },
        credits: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false,
            selected: 2
        },
        scrollbar: { enabled: false },
        //xAxis: {
        //    minPadding: 0,
        //    maxPadding: 0
        //},
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '50%',
            resize: {
                enabled: true
            }
            }, {
                labels: {
                    align: 'left'
                },
                top: '50%',
                height: '20%',
                offset: 0
            }, {
                labels: {
                    align: 'left'
                },
                top: '70%',
                height: '30%',
                offset: 0
            }
        ],
        navigationBindings: {
            events: {
                selectButton: function (event) {
                    let newClassName = event.button.className + ' ' +
                        'highcharts-active';
                    const topButton = event.button.parentNode.parentNode;

                    if (topButton.classList.contains('right')) {
                        newClassName += ' right';
                    }

                    // If this is a button with sub buttons,
                    // change main icon to the current one:
                    if (!topButton.classList.contains(
                        'highcharts-menu-wrapper'
                    )) {
                        topButton.className = newClassName;
                    }

                    // Store info about active button:
                    this.chart.activeButton = event.button;
                },
                deselectButton: function (event) {
                    event.button.parentNode.parentNode.classList.remove(
                        'highcharts-active'
                    );

                    // Remove info about active button:
                    this.chart.activeButton = null;
                },
                showPopup: function (event) {

                    if (!this.indicatorsPopupContainer) {
                        this.indicatorsPopupContainer = document
                            .getElementsByClassName(
                                'highcharts-popup-indicators'
                            )[0];
                    }

                    if (!this.annotationsPopupContainer) {
                        this.annotationsPopupContainer = document
                            .getElementsByClassName(
                                'highcharts-popup-annotations'
                            )[0];
                    }

                    if (event.formType === 'indicators') {
                        this.indicatorsPopupContainer.style.display = 'block';
                    } else if (event.formType === 'annotation-toolbar') {
                        // If user is still adding an annotation, don't show
                        // popup:
                        if (!this.chart.activeButton) {
                            this.chart.currentAnnotation = event.annotation;
                            this.annotationsPopupContainer.style.display =
                                'block';
                        }
                    }

                },
                closePopup: function () {
                    this.indicatorsPopupContainer.style.display = 'none';
                    this.annotationsPopupContainer.style.display = 'none';
                }
            }
        },
        stockTools: {
            gui: {
                enabled: false
            }
        },
        series: [
            {
                type: 'candlestick',
                id: 'aapl-ohlc',
                name: stockCode,
                //lastPrice: {
                //    enabled: true,
                //    label: {
                //        enabled: true,
                //        align: 'left',
                //        x: 8
                //    }
                //},
                data: ohlc
            }, {
                type: 'column',
                //lastPrice: {
                //    enabled: true,
                //    label: {
                //        format: '{#if value ge 1000000} ' +
                //            '{(divide value 1000000):.2f} M {else} {value} {/if}',
                //        enabled: true,
                //        align: 'left',
                //        x: 8
                //    }
                //},
                keys: ['x', 'y', 'className'],
                id: 'aapl-volume',
                name: 'Volume',
                data: volume,
                yAxis: 1
            }
            //, {
            //    type: 'line',
            //    id: 'aapl-rsi',
            //    name: 'RSI',
            //    data: [],
            //    yAxis: 2
            //}
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });

})();

function ChangePage(page) {
    PagePortfolio = page;
    angular.element(document.getElementById('kt_content')).scope().GetProjects(PagePortfolio);
}

function ChangePageArticle(page) {
    PageArticle = page;
    angular.element(document.getElementById('kt_content')).scope().GetArticles(PageArticle);
}

function ChangePageStockTrading(page) {
    PageStockTrading = page;
    angular.element(document.getElementById('kt_content')).scope().GetStockTrading(PageStockTrading);
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

    $scope.categoriesIndustry = [];
    $scope.dataBubbleChart = [];
    $scope.dataNumberOfSharesChart = [];
    $scope.dataActivityByIndustryChart = [];
    $scope.TotalStock = 0;
    $scope.TradingIndex = {};
    $scope.ActiveStock = {};
    $scope.MarketSymbol = 'VN-Index';
    $scope.MarketIndex = {};
    $scope.ExchangeId = 1;

    $scope.GetClassIndex = function (value) {
        if(value > 0)
            return 'index-increase';
        else if (value < 0)
            return 'index-decrease';

        return 'index-sideways';
    }; 

    $scope.GetClassBackground = function (value) {
        if (value > 0)
            return 'success';
        else if (value < 0)
            return 'danger';

        return 'warning';
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

    $scope.ShowStock = function (x) {
        $scope.ActiveStock = x;
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

    $scope.GetStockTrading = function (page) {
        PageStockTrading = page;

        pagesize = $('#selRecordStockTrading').val() == '' ? 10 : $('#selRecordStockTrading').val();

        var input =
        {
            Page: page, PageSize: pagesize, StockCode: $scope.MarketSymbol, ExchangeId: $scope.ExchangeId
        };

        var post = $http({
            method: "POST",
            url: '/Stock/GetStockTradingBy',
            dataType: 'json',
            params: { data: JSON.stringify(input) },
            headers: { "Content-Type": "application/json" }
        });

        post.success(function (data, status) {
            $scope.StockTrading = data;
            if (data != undefined && data.length > 0) {
                GetPageListWithFunction('pagerStockTrading', Math.ceil(data[0].TotalRow / pagesize), page, 'ChangePageStockTrading');
                $scope.TotalRowStockTrading = $scope.StockTrading[0].TotalRow;
                $scope.FromRowStockTrading = $scope.StockTrading[0].Row;
                $scope.ToRowStockTrading = $scope.StockTrading[$scope.StockTrading.length - 1].Row;
            }
            else {
                $scope.TotalRowStockTrading = 0;
                $scope.FromRowStockTrading = 0;
                $scope.ToRowStockTrading = 0;
                $('#pagerStockTrading').html('');
            }
        });

        post.error(function (data, status) {
            $scope.StockTrading = [];
            $scope.TotalRowStockTrading = 0;
            $scope.FromRowStockTrading = 0;
            $scope.ToRowStockTrading = 0;
            $('#pagerStockTrading').html('');
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
                    GetPageListWithFunction('pagerArticle', Math.ceil(data[0].TotalRow / pagesize), page, 'ChangePageArticle');
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

    $scope.LoadIndexChart = function (symbol) {
        //window.addEventListener('DOMContentLoaded', initOnReady_Index(symbol), false);
        $('#btgrIndex > button').removeClass('active');
        $('#bt' + symbol).addClass('active');
        //$('#bubble_tooltip0').css({ "color": rgba(44, 175, 254, 0.5) });
        //document.getElementById('bubble_tooltip0').style.color = rgba(44, 175, 254, 0.5);
    };

    $scope.LoadBienDongChart = function (industryCode, index, fromtradingdate = '', totradingdate = '', first = false) {
        $scope.IndustryCodeActive = industryCode;
        $scope.ColorIndexActive = index;
        //$scope.LoadActivityByIndustryChart(industryCode, first);
        if (industryCode === -1)
            $('#chart_DailyActiveReport .highcharts-axis-labels a').css('color', '');

        $scope.LoadNumberOfSharesChart(industryCode, first);
        $scope.LoadBubbleChart(industryCode, index, fromtradingdate, totradingdate, first);
    };

    var chart_Bubble = null;

    $scope.LoadBubbleChart = function (industryCode, index, fromtradingdate = '', totradingdate = '', first = false) {
        
        var dataFluctuation = [];
        var _arrData = [];
        var _arrIndustry = [];
        var _color = index;

        if (first) 
        {
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: fromtradingdate, ToTradingDate: totradingdate
                , ExchangeId: $scope.ExchangeId
            };
            $.ajax({
                type: 'POST',
                url: '/Stock/Chart_GetBubbleByIndustry',
                async: false,
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
                success: function (data) {
                    $scope.dataBubbleChart = data;
                    $scope.TotalStock = 0;
                    
                    for (var i = 0; data != null && i < data.length; i++) {
                        if (industryCode == -1)
                            _color = i;
                        _arrData = [];

                        var mamau = '';

                        for (var j = 0; data[i].Stock != null && j < data[i].Stock.length; j++) {
                            if (data[i].Stock[j].X > 0)
                                mamau = '#0bdf39';
                            else if (data[i].Stock[j].X < 0)
                                mamau = '#ff0017';
                            else
                                mamau = '#dfba49';

                            var _eleData = { x: data[i].Stock[j].X, y: data[i].Stock[j].Y, z: data[i].Stock[j].Z, name: data[i].Stock[j].Code, color: mamau };
                            _arrData.push(_eleData);
                        }

                        $scope.TotalStock += data[i].Stock != null ? data[i].Stock.length : 0;

                        if (industryCode == -1 && $scope.categoriesIndustry.length == 0)
                            _arrIndustry.push({ Name: data[i].Name, Code: data[i].IndustryCode, Color: Highcharts.getOptions().colors[_color], Total: data[i].Stock.length })

                        var _data = {
                            data: _arrData,
                            //color: Highcharts.color(Highcharts.getOptions().colors[_color]).setOpacity(0.8).get('rgba')
                            //marker: {
                            //    fillOpacity: 1
                            //}
                        };

                        dataFluctuation.push(_data);
                    }

                    if (industryCode == -1 && $scope.categoriesIndustry.length == 0) {
                        $scope.categoriesIndustry = _arrIndustry;
                        //$scope.categoriesIndustry.splice(0, 0, { Name: 'Tất cả', Code: -1, Color: Highcharts.getOptions().colors[_arrIndustry.length + 1] });
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }

        if (!first) {
            var data = [];

            if (industryCode == -1) {
                data = $scope.dataBubbleChart;
            }
            else {
                data = $scope.dataBubbleChart.filter((item) => item.IndustryCode === industryCode);
            }

            for (var i = 0; i < data.length; i++) {
                if (industryCode == -1)
                    _color = i;

                _arrData = [];
                var mamau = '';

                for (var j = 0; j < data[i].Stock.length; j++) {
                    if (data[i].Stock[j].X > 0)
                        mamau = '#0bdf39';
                    else if (data[i].Stock[j].X < 0)
                        mamau = '#ff0017';
                    else
                        mamau = '#dfba49';

                    var _eleData = { x: data[i].Stock[j].X, y: data[i].Stock[j].Y, z: data[i].Stock[j].Z, name: data[i].Stock[j].Code, color: mamau };
                    _arrData.push(_eleData);
                }

                var _data = {
                    data: _arrData,
                    //color: //Highcharts.getOptions().colors[_color],
                        //Highcharts.color(Highcharts.getOptions().colors[_color]).setOpacity(0.8).get('rgba')
                    //marker: {
                    //    fillOpacity: 1
                    //}
                };

                dataFluctuation.push(_data);
            }
        }

        if (chart_Bubble != null) {
            const seriesConfig = {
                series: dataFluctuation
            }
            chart_Bubble.update(seriesConfig, true, true);

            return;
        }

        chart_Bubble = Highcharts.chart('chart_Fluctuation', {

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zooming: {
                    type: 'xy'
                }
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                min: -10,
                max: 10,
                gridLineWidth: 1,
                accessibility: {
                    rangeDescription: 'Range: 0 to 100.'
                },
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 0,
                    label: {
                        rotation: 0,
                        y: 0,
                        style: {
                            fontStyle: 'italic'
                        },
                        text: ''
                    },
                    zIndex: 3
                }]
            },
            legend: {
                enabled: false
            },
            yAxis: {
                min: 0,
                max: 110,
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: '<span style="font-size: 10px;font-weight:500">LỰC CẦU CHỦ ĐỘNG</span>'
                },
                accessibility: {
                    rangeDescription: 'Range: 0 to 100.'
                },
                plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 50,
                    label: {
                        align: 'right',
                        style: {
                            fontStyle: 'italic'
                        },
                        text: '',
                        x: -10
                    },
                    zIndex: 3
                }]
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2" style="font-weight: 700;color: #5b9bd1;font-size: 16px;">{point.name}</th></tr>' +
                    '<tr><th>X:</th><td>&nbsp;{point.x}</td></tr>' +
                    '<tr><th>Y:</th><td>&nbsp;{point.y}</td></tr>' +
                    '<tr><th>Z:</th><td>&nbsp;{point.z}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: dataFluctuation

        });
    };

    var chart_ActivityByIndustry = null;

    $scope.LoadActivityByIndustryChart = function (industryCode, first = false) {
        var categoriesIndustry = [];
        var BuyValueIndustry = [];
        var SellValueIndustry = [];

        if (first) {
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
                , ExchangeId: $scope.ExchangeId
            };
            $.ajax({
                type: 'POST',
                url: '/Stock/Chart_GetActivityByIndustry',
                async: false,
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
                success: function (data) {
                    $scope.dataActivityByIndustryChart = data;

                    for (i = 0; data != null && i < data.length; i++) {
                        categoriesIndustry.push({ name: data[i].Name, industryCode: data[i].IndustryCode });
                        //BuyValueIndustry.push({ name: data[i].Name, value: data[i].BuyValue });
                        //SellValueIndustry.push({ name: data[i].Name, value: data[i].SellValue });
                        BuyValueIndustry.push(data[i].BuyValue);
                        SellValueIndustry.push(data[i].SellValue);
                    }
                    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }
        
        if (!first) {
            var data = [];

            if (industryCode == -1) {
                data = $scope.dataActivityByIndustryChart;
            }
            else {
                data = $scope.dataActivityByIndustryChart.filter((item) => item.IndustryCode === industryCode);
            }

            var dataLength = data.length;
            for (i = 0; i < dataLength; i++) {
                categoriesIndustry.push({ name: data[i].Name, industryCode: data[i].IndustryCode });
                BuyValueIndustry.push(data[i].BuyValue);
                SellValueIndustry.push(data[i].SellValue);
            }
        }

        if (chart_ActivityByIndustry != null) {
            chart_ActivityByIndustry.series[0].update(
                {
                    data: BuyValueIndustry
                }
            );

            chart_ActivityByIndustry.series[1].update(
                {
                    data: SellValueIndustry
                }
            );

            //chart_ActivityByIndustry.xAxis[0].setCategories(
            //    categoriesIndustry
            //);

            var _categoriesIndustry = [];
            for (i = 0; categoriesIndustry != null && i < categoriesIndustry.length; i++) {
                _categoriesIndustry.push(i);
            }

            chart_ActivityByIndustry.xAxis[0].update({ categories: _categoriesIndustry });

            return;
        }

        chart_ActivityByIndustry = Highcharts.chart('chart_DailyActiveReport', {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'MUA BÁN CHỦ ĐỘNG THEO NGÀNH',
                align: 'left'
            },
            subtitle: {
                text: '',
                align: 'left'
            },
            xAxis: {
                //categories: categoriesIndustry,
                type: 'category',
                crosshair: true,
                accessibility: {
                    description: 'Countries'
                },
                lineWidth: 0,
                labels: {
                    events: {
                        click: function () {
                            //console.log(this)
                            //console.log(this.label.textStr);
                            //this.css({
                            //    color: 'red'
                            //});

                            var doc = new DOMParser().parseFromString(this.label.textStr, "text/xml");
                            var industryCode = doc.firstChild.getAttribute("industryCode");
                            var index = doc.firstChild.getAttribute("index");

                            $('#chart_DailyActiveReport .highcharts-axis-labels a').css('color', '');

                            $('#lbDAR' + index).css('color', 'red');

                            angular.element(document.getElementById('kt_content')).scope().LoadBienDongChart(Number(industryCode), Number(index));
                        }
                    },
                    rotation: 0,
                    useHTML: true,
                    formatter: function () {
                        return '<a id="lbDAR' + this.value + '" industryCode="' + categoriesIndustry[this.value].industryCode + '" index="' + this.value + '">' + categoriesIndustry[this.value].name + '</a>';
                    },
                    //formatter: function () {
                    //    return '<a href="javascript:alert(\'hello ' + categoriesIndustry[this.value].name + '\')">' +
                    //        categoriesIndustry[this.value].name + '</a>';
                    //},
                    style: {
                        /*color: 'red',*/
                        textDecoration: "none"
                    }
                } 
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    enabled:false
                },
                min: 0,
                title: {
                    text: ''
                },
                gridLineColor: 'transparent'
            },
            tooltip: {
                //headerFormat: '<span style="font-size:10px">' + categoriesIndustry['{ point.x }'].name + '</span><table>',
                //pointFormat: categoriesIndustry[ + '{point.value}' + ].name,
                //valueSuffix: ' (Tỷ đồng)',
                //formatter: function () {
                //    let index = this.x;

                //    return categoriesIndustry[index].name;
                //},
                formatter: function () {
                    var currentPoint = this,
                        currentSeries = currentPoint.series,
                        chart = currentSeries.chart,
                        stackName = this.series.userOptions.stack,
                        stackValues = '';

                    chart.series.forEach(function (series) {
                        series.points.forEach(function (point) {
                            if (currentSeries.userOptions.stack === series.userOptions.stack && currentPoint.key === point.category) {
                                stackValues += '<span style="color: ' + point.color + '">\u25CF</span> ' + series.name + ': ' + point.y + ' (Tỷ đồng)<br/>'
                                point.setState('hover')
                            } else {
                                point.setState('')
                            }
                        })
                    });

                    return '<b>' + categoriesIndustry[this.x].name + '</b><br/>' +
                        stackValues;
                },
                useHTML: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0.1,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'Buy Value',
                    color: '#1aa67c',
                    data: BuyValueIndustry,
                    borderRadius: 0
                },
                {
                    name: 'Sell Value',
                    color: '#ff0017',
                    data: SellValueIndustry,
                    borderRadius: 0
                }
                
            ]
        });

        //alert(Highcharts.getOptions().colors[0]);
        //$('#bubble_tooltip0').css({ "color": rgba(44, 175, 254, 0.5) });
        //document.getElementById('bubble_tooltip0').style.color = rgba(44, 175, 254, 0.5);
    };

    var chart_NumberOfShares = null;

    $scope.LoadNumberOfSharesChart = function (industryCode, first = false) {
        // Build the chart
        //if (first)
        {
            var dataChart = [];
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
                , ExchangeId: $scope.ExchangeId
            };
            $.ajax({
                type: 'POST',
                url: '/Stock/Chart_GetDataNumberOfShares',
                async: true,
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
                success: function (data) {
                    dataChart = [{
                        name: 'Điều chỉnh',
                        y: data.Correction
                    }, {
                        name: 'Hồi phục',
                        y: data.Recovery
                    }, {
                        name: 'Tăng',
                        y: data.Uptrend
                    }, {
                        name: 'Giảm',
                        y: data.Downtrend
                    }];


                    if (chart_NumberOfShares != null) {
                        chart_NumberOfShares.series[0].update(
                            {
                                data: dataChart
                            }
                        );

                        $("#lbPieChart").text(data.Total + ' CP');
                        return;
                    }

                    chart_NumberOfShares = Highcharts.chart('PieChart_Stocks', {
                        chart: {
                            type: 'pie',
                            custom: {},
                            events: {
                                render() {
                                    const chart = this,
                                        series = chart.series[0];
                                    let customLabel = chart.options.chart.custom.label;

                                    if (!customLabel) {
                                        customLabel = chart.options.chart.custom.label =
                                            chart.renderer.label(
                                                '<strong id="lbPieChart">' + data.Total + ' CP</strong>'
                                            )
                                                .css({
                                                    color: '#000',
                                                    textAnchor: 'middle'
                                                })
                                                .add();
                                    }

                                    const x = series.center[0] + chart.plotLeft,
                                        y = series.center[1] + chart.plotTop -
                                            (customLabel.attr('height') / 2);

                                    customLabel.attr({
                                        x,
                                        y
                                    });
                                    // Set font size based on chart diameter
                                    customLabel.css({
                                        fontSize: `${series.center[2] / 12}px`
                                    });
                                }
                            }
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        title: {
                            text: 'XU HƯỚNG CỔ PHIẾU'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
                        },
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                borderRadius: 0,
                                dataLabels: [{
                                    enabled: true,
                                    distance: 2,
                                    format: '<span>{point.name}<br/><b>{point.percentage:.0f}%</b></span>'
                                }, {
                                    enabled: false,
                                    distance: -15,
                                    format: '{point.percentage:.0f}%',
                                    style: {
                                        fontSize: '0.9em'
                                    }
                                }],
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: 'Stock',
                            colorByPoint: true,
                            innerSize: '70%',
                            data: dataChart
                        }]
                    });
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }

    };

    var currentSlider = 1;
    var maxSlider = 1;

    $scope.Chart_GetDates = function () {
        var input =
        {
           
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_GetDates',
            async: false,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.TradingDates = data;

                $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
                $scope.ToTradingDateActive = $scope.TradingDates[$scope.TradingDates.length - 1].TradingDate;

                //$("#slider-range-date-biendong").slider("destroy");

                maxSlider = $scope.TradingDates.length;
                $("#slider-range-date-biendong").slider({
                    isRTL: Metronic.isRTL(),
                    range: "max",
                    min: 1,
                    max: $scope.TradingDates.length,
                    value: $scope.TradingDates.length,
                    slide: function (event, ui) {
                        //$("#slider-range-max-amount").text(ui.value);
                        currentSlider = ui.value;

                        $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
                        $scope.ToTradingDateActive = $scope.TradingDates[currentSlider - 1].TradingDate;

                        if (!$scope.$$phase) { $scope.$apply(); }
                        setTimeout(function () {
                            $scope.LoadBienDongChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
                        }, 100);
                        
                    }
                });

                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    $scope.Chart_GetTradingIndex = function (symbol) {
        $scope.MarketSymbol = symbol;

        var input =
        {
            StockCode: symbol
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_GetTradingIndex',
            async: false,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.TradingIndex = data;

                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    var myTimerSliderChart = null;

    $scope.IsPlay = false;
    $scope.TextPlay = 'REPLAY';

    $scope.Chart_Play = function () {
        if (!$scope.IsPlay) {
            $scope.IsPlay = true;
            $scope.TextPlay = 'PAUSE';
            //$("#btPlayChart").hide();
            //$("#btPauseChart").show();
            myTimerSliderChart = setInterval($scope.PlaySliderChart, 2000);
        }
        else {
            $scope.IsPlay = false;
            $scope.TextPlay = 'REPLAY';
            //$("#btPauseChart").hide();
            //$("#btPlayChart").show();
            clearInterval(myTimerSliderChart);
        }
    };

    $scope.PlaySliderChart = function () {
        if (currentSlider < maxSlider) {
            currentSlider = currentSlider + 1;
        }
        else {
            currentSlider = 1;
        }

        $("#slider-range-date-biendong").slider('value', currentSlider);   

        $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
        $scope.ToTradingDateActive = $scope.TradingDates[currentSlider - 1].TradingDate;

        if (!$scope.$$phase) { $scope.$apply(); }

        $scope.LoadBienDongChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    };

    $scope.ChonLoaiChartBienDong = function (event, type) {
        $scope.TypeChartBienDong = type;
        $('#btgrLoaiBienDong > a').removeClass('active');
        $(event.target).addClass('active');
    };

    var chart_BulletGraph_1 = null, chart_BulletGraph_2 = null, chart_BulletGraph_3 = null;
    $scope.LoadChartBulletGraph = function () {
        chart_BulletGraph_1 = Highcharts.chart('chart_BulletGraph_1', {
            chart: {
                /*marginTop: 40,*/
                inverted: true,
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 5,
                type: 'bullet'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#000',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            xAxis: {
                categories: [
                    ''
                ]
            },
            yAxis: {
                plotBands: [{
                    from: 0,
                    to: 150,
                    color: '#666'
                }, {
                    from: 150,
                    to: 225,
                    color: '#999'
                }, {
                    from: 225,
                    to: 9e9,
                    color: '#bbb'
                }],
                title: null,
                labels: {
                    enabled: false
                }
            },
            series: [{
                data: [{
                    y: 275,
                    target: 250
                }]
            }],
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            }
        });

        chart_BulletGraph_2 = Highcharts.chart('chart_BulletGraph_2', {
            chart: {
                inverted: true,
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 5,
                type: 'bullet'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#000',
                    targetOptions: {
                        width: '200%'
                    }
                }
            },
            xAxis: {
                categories: [
                    ''
                ]
            },
            yAxis: {
                plotBands: [{
                    from: 0,
                    to: 20,
                    color: '#666'
                }, {
                    from: 20,
                    to: 25,
                    color: '#999'
                }, {
                    from: 25,
                    to: 100,
                    color: '#bbb'
                }],
                labels: {
                    format: '{value}%'
                },
                title: null,
                labels: {
                    enabled: false
                }
            },
            series: [{
                data: [{
                    y: 22,
                    target: 27
                }]
            }],
            tooltip: {
                pointFormat: '<b>{point.y}</b> (with target at {point.target})'
            }
        });

        $("#chart_BulletGraph_3").highcharts({
            lang: {
                thousandsSep: " ",
                decimalPoint: ".",

            },
            credits: {
                enabled: false
            },
            chart: {
                backgroundColor: "#ffffff",

                inverted: true,
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 5,
                type: "bullet"
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            //xAxis: {
            //    labels: {
            //        style: {
            //            color: "#000000",
            //            fontFamily: "Arial",
            //            fontSize: "10px",
            //            fontWeight: "normal",
            //            textDecoration: "plain",
            //            fontStyle: "normal"
            //        },
            //    }
            //},
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: true
                }
            },
            plotOptions: {
                series: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: "#000",
                    targetOptions: {
                        width: "200%",
                        color: "#000",
                        height: 4
                    },
                    dataLabels: {
                        enabled: false,
                        inside: true
                    },
                    allowPointSelect: true,
                    point: {
                        events: {
                            click: function () {
                                click_link_fulldim([this.category], 111, 51, ["Region"]);
                            }
                        }
                    }
                }
            },
            tooltip: {
                enabled: true
            },
            xAxis: {
                categories: [
                    ''
                ]
            },
            yAxis: {
                plotBands: [{
                    from: 0,
                    to: $scope.TradingIndex.Volume.VolumeT1,
                    color: "#666"
                }, {
                    from: $scope.TradingIndex.Volume.VolumeT1,
                    to: $scope.TradingIndex.Volume.VolumeT2,
                    color: "#999"
                }, {
                    from: $scope.TradingIndex.Volume.VolumeT2,
                    to: 9e9,
                    color: "#bbb"
                }],
                title: null,
                labels: {
                    enabled: false
                }
            },
            series: [{
                data: [{
                    y: $scope.TradingIndex.Volume.VolumeT0,
                    target: $scope.TradingIndex.Volume.Volume_AVG20
                }]
            }],
            tooltip: {
                pointFormat: "<b>{point.y}</b> (with target at {point.target})"
            }
        });
    };

    var gaugeOptions = {

        chart: {
            type: 'solidgauge',
        },
        title: {
            text: ''
        },

        tooltip: {
            enabled: true,
            pointFormat: '{point.name}: <b>{point.y}</b>'

        },
        pane: {
            center: ['50%', '85%'],
            size: '150%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '70%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        // the value axis
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            minorTickInterval: 25,
            tickPixelInterval: 10,
            tickWidth: 0,
            tickAmount: null,
            labels: {
                y: 5
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 10,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
    };

    $scope.LoadChartADX_RSI = function () {

        var fullData = [
            [{
                'name': 'ADX',
                'innerRadius': 85,
                'radius': 70,
                'y': $scope.TradingIndex.ADX
            }, {
                'name': 'RSI',
                'innerRadius': 85,
                'radius': 100,
                'y': $scope.TradingIndex.RSI
            }]
        ];
        var cont = 1;
        var series = [];
        series.push({
            'name': 'Name serie',
            'data': [
                Object.assign({}, fullData[0][1]),
                Object.assign({}, fullData[0][0]),
                
            ],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:15px">{y:.1f}</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4">' +
                    'RSI' +
                    '</span>' +
                    '</div>'
            }
            //'dataLabels': false
        });
        

        $('#chart_gauge_adx_rsi').highcharts(Highcharts.merge(gaugeOptions, {

            credits: {
                enabled: false
            },
            series: series

        }), function (chart) {
            //if (!chart.renderer.forExport) {
            //    setInterval(function () {
            //        if (chart && chart.series) {
            //            chart.series[0].points.forEach((point, i) => {
            //                point.update(fullData[cont][i])
            //            })
            //            cont = (cont + 1 === 2) ? 0 : cont + 1;
            //        }
            //    }, 1000);
            //}
        });

        //$('#chart_gauge_adx_rsi_2').highcharts(Highcharts.merge(gaugeOptions, {

        //    credits: {
        //        enabled: false
        //    },
        //    series: series

        //}), function (chart) {
        //});
    };

    $scope.LoadChart_RSI = function () {

        Highcharts.chart('chart_gauge_rsi_2', {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '100%'
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },

            pane: {
                startAngle: -90,
                endAngle: 90,
                background: null,
                center: ['50%', '75%'],
                size: '120%'
            },

            // the value axis
            yAxis: {
                min: 0,
                max: 100,
                tickPixelInterval: 0,
                tickPosition: 'inside',
                tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                tickLength: 20,
                tickWidth: 0,
                minorTickInterval: null,
                labels: {
                    distance: 15,
                    style: {
                        fontSize: '14px'
                    },
                    enabled: false
                },
                lineWidth: 0,
                plotBands: [{
                    from: 0,
                    to: 20,
                    color: '#943126', // green
                    thickness: 15,
                    borderRadius: '0%'
                }, {
                    from: 20,
                    to: 40,
                    color: '#CB4335', // red
                    thickness: 15,
                    borderRadius: '0%'
                }, {
                    from: 40,
                    to: 60,
                    color: '#CCCC00', // yellow
                    thickness: 15
                }, {
                    from: 60,
                    to: 80,
                    color: '#43AF1D', // yellow
                    thickness: 15
                }, {
                    from: 80,
                    to: 100,
                    color: '#009900', // yellow
                    thickness: 15
                }]
            },

            series: [{
                name: 'RSI',
                data: [$scope.TradingIndex.RSI],
                tooltip: {
                    valueSuffix: ''
                },
                dataLabels: {
                    format: 'Tăng mạnh',
                    y: 5,
                    borderWidth: 0,
                    color: (
                        Highcharts.defaultOptions.title &&
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || '#333333',
                    style: {
                        fontSize: '16px'
                    }
                },
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 6
                }

            }]

        });

    };

    $scope.LoadChartForecast = function () {

        (async () => {
            const json = await fetch(
                'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=64.128288&lon=-21.827774'
            ).then(response => response.json()),
                data = json.properties.timeseries.slice(0, 10).map(el =>
                    [
                        new Date(el.time).getTime(),
                        el.data.instant.details.air_temperature
                    ]),
                todayDate = new Date(),
                today = todayDate.getTime() - todayDate.getTimezoneOffset() * 60 * 1000;

            Highcharts.chart('chart_Forecast', {

                title: {
                    text: 'Hourly forecast temperatures in Reykjavík, Iceland'
                },
                credits: {
                    enabled: false
                },
                subtitle: {
                    text: 'Dotted line typically signifies prognosis'
                },

                xAxis: {
                    type: 'datetime',
                    plotLines: [{
                        color: '#4840d6',
                        width: 2,
                        value: today,
                        zIndex: 2,
                        dashStyle: 'Dash',
                        label: {
                            text: 'Current time',
                            rotation: 0,
                            y: 20,
                            style: {
                                color: '#333333'
                            }
                        }
                    }]
                },

                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },

                legend: {
                    enabled: false
                },

                tooltip: {
                    valueSuffix: '°C'
                },

                series: [{
                    name: 'Temperature in Reykjavík',
                    data: data,
                    zoneAxis: 'x',
                    lineWidth: 4,
                    marker: {
                        lineWidth: 2,
                        lineColor: '#4840d6',
                        fillColor: '#fff'
                    },
                    color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#fa4fed'],
                            [1, '#5897ff']
                        ]
                    },
                    zones: [{
                        value: today
                    }, {
                        dashStyle: 'Dot'
                    }]
                }]

            });
        })();
    };

    $scope.ChooseMarket = function (symbol, exchangeid) {
        $scope.MarketSymbol = symbol;
        $scope.ExchangeId = exchangeid;
        $scope.GetStockTradingIndex($scope.ExchangeId);
        $scope.GetStockTrading($scope.ExchangeId);
        $scope.LoadChartIndex(symbol);
        $scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
        $scope.LoadActivityByIndustryChart(-1, true);
    };

    $scope.LoadChartIndex = function (symbol) {
        var dataIndex = [], stockCode = symbol;

        // split the data set into ohlc and volume
        const ohlc = [], volume = [], rsi = [];

        var input =
        {
            Page: 1, PageSize: 10000, StockCode: stockCode, ExchangeId: 1, Sort: "ASC"
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/GetStockTradingBy',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (response) {
                dataIndex = response;

                if (dataIndex != undefined) {
                    for (let i = 0; i < dataIndex.length; i += 1) {

                        ohlc.push([
                            dataIndex[i].Date, // the date
                            dataIndex[i].Open, // open
                            dataIndex[i].High, // high
                            dataIndex[i].Low, // low
                            dataIndex[i].Close // close
                        ]);

                        volume.push([
                            dataIndex[i].Date, // the date
                            dataIndex[i].Volume, // the volume
                            dataIndex[i].Open < dataIndex[i].Close ? 'highcharts-point-up' : 'highcharts-point-down'
                        ]);

                        rsi.push([
                            dataIndex[i].Date, // the date
                            dataIndex[i].RSI
                        ]);
                    }
                }

                if (chart_Index != null) {
                    chart_Index.series[0].setData(ohlc, true);

                    chart_Index.series[1].setData(volume, true);

                    //chart_Index.series[2].setData(rsi, true);

                    chart_Index.series[0].update(
                        {
                            name: stockCode
                        }
                    );

                    $scope.Add_RIS_Chart(true, rsi)
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    $scope.Add_RIS_Chart = function (hasRSI, data) {
        if (chart_Index && hasRSI) {

            if (chart_Index.series.length > 2)
                chart_Index.series[2].setData(data, true);
            else
                chart_Index.addSeries({
                    //connectNulls: true,
                    //lineColor: '#f00',
                    //color: '#f00',
                    //negativeColor: '#f00',
                    //lineWidth: 1,
                    //linkedTo: 'main',
                    //show: true,
                    name: 'RSI',
                    type: 'line',
                    yAxis: 2,
                    zIndex: 4,
                    data: data
                });
        }
        else if (chart_Index && !hasRSI) {
            chart_Index.series[2].remove();
        }
    };

    $scope.GetStockTradingIndex = function (exchangeid) {
        $scope.MarketIndex = {};
        var input =
        {
            ExchangeId: exchangeid
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/GetStockTradingIndex',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (response) {
                $scope.StockTradingIndex = response;
                if (response != null) {
                    $scope.MarketIndex = $scope.StockTradingIndex.filter(function (item) {
                        return item.Code === $scope.MarketSymbol;
                    })[0];
                }

                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    $scope.GetAnalysisReport = function (page) {
        var input =
        {
            Page: page, PageSize: 10
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/GetAnalysisReport',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (response) {
                $scope.AnalysisReport = response;
                if (!$scope.$$phase) { $scope.$apply(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    $scope.Chart_GetDates();
    $scope.Chart_GetTradingIndex($scope.MarketSymbol);
    $scope.LoadIndexChart($scope.MarketSymbol);
    $scope.GetRecommendationsPortfolio(1);
    $scope.GetArticles(1);
    $scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    $scope.LoadActivityByIndustryChart(-1, true);
    //$scope.LoadNumberOfSharesChart(-1);
    $scope.LoadChartBulletGraph();
    $scope.LoadChartADX_RSI();
    $scope.LoadChart_RSI();
    $scope.LoadChartForecast();
    $scope.GetStockTrading(1);
    $scope.LoadChartIndex($scope.MarketSymbol);
    $scope.GetStockTradingIndex($scope.ExchangeId);
    $scope.GetAnalysisReport(1);
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

//app.filter('formatNumber', function () {
//    return function (input) {
//        return input != null ? input.replace(/,/g, ".") : '';
//    };
//});