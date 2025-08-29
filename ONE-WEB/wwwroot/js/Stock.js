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

var widget_PTKT = null, widget_Index = null, widget_symbol = null;

function initOnReady(symbol) {
    widget_PTKT = window.tvWidget = new TradingView.widget({
        height: $(document).height() - 150,
        width: '100%',
        //debug: true, // uncomment this line to see Library errors and warnings in the console
        //fullscreen: true,
        symbol: symbol,
        interval: '1D',
        container_id: "tv_chart_container", //bieu do PTKT
        timezone: "Asia/Ho_Chi_Minh",
        // BEWARE: no trailing slash is expected in feed URL
        //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/trading-view/udf"),
        library_path: "/charting_library/",
        locale: getParameterByName('lang') || "en",

        disabled_features: ["use_localstorage_for_settings"], // 'left_toolbar', "header_widget", 
        enabled_features: ["study_templates"], // "hide_left_toolbar_by_default"
        //charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.dotnet',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
    });
};

function initOnReady_Index(symbol) {
    widget_Index = window.tvWidget = new TradingView.widget({
        height: 300,
        width: '100%',
        //debug: true, // uncomment this line to see Library errors and warnings in the console
        //fullscreen: true,
        symbol: symbol,
        interval: '1D',
        container_id: "tv_chart_index", //chi so chung khoan
        timezone: "Asia/Ho_Chi_Minh",
        // BEWARE: no trailing slash is expected in feed URL
        //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/trading-view/udf"),
        library_path: "/charting_library/",
        locale: getParameterByName('lang') || "en",

        withdateranges: false,
        disabled_features: ['left_toolbar', "header_widget", "timeframes_toolbar"], // 'left_toolbar', "header_widget",
        enabled_features: ["hide_left_toolbar_by_default"], // "hide_left_toolbar_by_default"
        //charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.dotnet',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
    });
};

function initOnReady_Symbol(symbol) {
    widget_symbol = window.tvWidget = new TradingView.widget({
        //height: $('#tab_tong_quan').innerHeight(),
        width: '100%',
        //debug: true, // uncomment this line to see Library errors and warnings in the console
        //fullscreen: true,
        symbol: symbol,
        interval: '1D',
        container_id: "tv_chart_symbol", //co phieu
        timezone: "Asia/Ho_Chi_Minh",
        // BEWARE: no trailing slash is expected in feed URL
        //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
        datafeed: new Datafeeds.UDFCompatibleDatafeed("/api/trading-view/udf"),
        library_path: "/charting_library/",
        locale: getParameterByName('lang') || "en",

        disabled_features: ["left_toolbar", "header-toolbar-symbol-search"], // 'left_toolbar', "header_widget", 
        enabled_features: ["study_templates"], // "hide_left_toolbar_by_default"
        //charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.dotnet',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
        header_symbol_search: false
    });

    widget_symbol.onChartReady(function () {
        widget_symbol.chart().createStudy('Stochastic RSI', false, true);
        //widget_symbol.chart().createStudy('Average Directional Index', false, true);
        $('#header-toolbar-symbol-search').remove();

        $('#tradingview_cc8fe').load(function () {
            $('#tradingview_cc8fe').contents().find('#leftpanel').hide();
            $('#tradingview_cc8fe').contents().find('#header-toolbar-symbol-search').hide();
        });

        $('#tv_chart_symbol > iframe').contents().find('#header-toolbar-symbol-search,#header-toolbar-compare,#header-toolbar-study-templates,#header-toolbar-undo-redo,#header-toolbar-properties,#header-toolbar-screenshot').parent().hide();
        $('#tv_chart_symbol > iframe').contents().find('.button-2gir_Bbb,.seriesControlWrapper-1c7dZFwu,.noWrapWrapper-AC879h-w').hide();

        var head = $("#tv_chart_symbol > iframe").contents().find("head");
        var css = '<style type="text/css">'
            + '.group-wWM3zP_M { margin-left: 0px !important; }'
            + ' .layout__area--center { top: 38px !important;}'
            + ' .pane-separator { background: #eee !important; }'
            + ' .price-axis > canvas { left: -7px !important; }'
            + ' .price-axis-stub-3MoqVLRB > canvas { left: -7px !important; }'
            + ' .chart-controls-bar { border-top: 0px solid !important;}'
            + ' .separator-3bp1jCsV { width: 0px !important; }'
            //+ ' table.chart-markup-table > tr:last-child { margin-top: -10px !important; position: absolute !important; }'
            + '</style>';
        $(head).append(css);
    });

};

//window.addEventListener('DOMContentLoaded', initOnReady('VNINDEX'), false);
//window.addEventListener('DOMContentLoaded', initOnReady_Index('VNINDEX'), false);
//window.addEventListener('DOMContentLoaded', initOnReady_Symbol('VNINDEX'), false);

var chart_Index = null;

//(async () => {

//    function addPopupEvents(chart) {
//        const closePopupButtons = document.getElementsByClassName(
//            'highcharts-close-popup'
//        );
//        // Close popup button:
//        Highstock.addEvent(
//            closePopupButtons[0],
//            'click',
//            function () {
//                this.parentNode.style.display = 'none';
//            }
//        );

//        Highstock.addEvent(
//            closePopupButtons[1],
//            'click',
//            function () {
//                this.parentNode.style.display = 'none';
//            }
//        );

//        // Add an indicator from popup
//        Highstock.addEvent(
//            document.querySelectorAll('.highcharts-popup-indicators button')[0],
//            'click',
//            function () {
//                const typeSelect = document.querySelectorAll(
//                    '.highcharts-popup-indicators select'
//                )[0],
//                    type = typeSelect.options[typeSelect.selectedIndex].value,
//                    period = document.querySelectorAll(
//                        '.highcharts-popup-indicators input'
//                    )[0].value || 14;

//                chart.addSeries({
//                    linkedTo: 'aapl-ohlc',
//                    type: type,
//                    params: {
//                        period: parseInt(period, 10)
//                    }
//                });

//                chart.stockToolbar.indicatorsPopupContainer.style.display =
//                    'none';
//            }
//        );

//        // Update an annotation from popup
//        Highstock.addEvent(
//            document.querySelectorAll(
//                '.highcharts-popup-annotations ' +
//                'button'
//            )[0],
//            'click',
//            function () {
//                const strokeWidth = parseInt(
//                    document.querySelectorAll(
//                        '.highcharts-popup-annotations ' +
//                        'input[name="stroke-width"]'
//                    )[0].value,
//                    10
//                ),
//                    strokeColor = document.querySelectorAll(
//                        '.highcharts-popup-annotations input[name="stroke"]'
//                    )[0].value;
//                // Stock/advanced annotations have common options under
//                // typeOptions
//                if (chart.currentAnnotation.options.typeOptions) {
//                    chart.currentAnnotation.update({
//                        typeOptions: {
//                            lineColor: strokeColor,
//                            lineWidth: strokeWidth,
//                            line: {
//                                strokeWidth: strokeWidth,
//                                stroke: strokeColor
//                            },
//                            background: {
//                                strokeWidth: strokeWidth,
//                                stroke: strokeColor
//                            },
//                            innerBackground: {
//                                strokeWidth: strokeWidth,
//                                stroke: strokeColor
//                            },
//                            outerBackground: {
//                                strokeWidth: strokeWidth,
//                                stroke: strokeColor
//                            },
//                            connector: {
//                                strokeWidth: strokeWidth,
//                                stroke: strokeColor
//                            }
//                        }
//                    });
//                } else {
//                    // Basic annotations:
//                    chart.currentAnnotation.update({
//                        shapes: [{
//                            'stroke-width': strokeWidth,
//                            stroke: strokeColor
//                        }],
//                        labels: [{
//                            borderWidth: strokeWidth,
//                            borderColor: strokeColor
//                        }]
//                    });
//                }
//                chart.stockToolbar.annotationsPopupContainer.style.display =
//                    'none';
//            }
//        );
//    }

//    // Load the dataset
//    //const data = await fetch(
//    //    'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
//    //).then(response => response.json());

//    var dataIndex = [], stockCode = '';

//    // split the data set into ohlc and volume
//    const ohlc = [],
//        volume = [];

//    chart_Index = Highstock.stockChart('tv_chart_index', {
//        chart: {
//            //marginLeft: 30,
//            //marginRight: 30,
//            events: {
//                load: function () {
//                    addPopupEvents(this);
//                }
//            }
//        },
//        credits: {
//            enabled: false
//        },
//        navigator: {
//            enabled: false
//        },
//        rangeSelector: {
//            enabled: false,
//            selected: 2
//        },
//        scrollbar: { enabled: false },
//        //xAxis: {
//        //    minPadding: 0,
//        //    maxPadding: 0
//        //},
//        //////////Have RSI
//        //yAxis: [{
//        //    labels: {
//        //        align: 'left'
//        //    },
//        //    height: '50%',
//        //    resize: {
//        //        enabled: true
//        //    }
//        //    }, {
//        //        labels: {
//        //            align: 'left'
//        //        },
//        //        top: '50%',
//        //        height: '20%',
//        //        offset: 0
//        //    }, {
//        //        labels: {
//        //            align: 'left'
//        //        },
//        //        top: '70%',
//        //        height: '30%',
//        //        offset: 0
//        //    }
//        //],

//        yAxis: [{
//            labels: {
//                align: 'left'
//            },
//            height: '70%',
//            resize: {
//                enabled: true
//                }
//            }, {
//                labels: {
//                    align: 'left'
//                },
//                top: '70%',
//                height: '30%',
//                offset: 0
//            }
//        ],
//        navigationBindings: {
//            events: {
//                selectButton: function (event) {
//                    let newClassName = event.button.className + ' ' +
//                        'highcharts-active';
//                    const topButton = event.button.parentNode.parentNode;

//                    if (topButton.classList.contains('right')) {
//                        newClassName += ' right';
//                    }

//                    // If this is a button with sub buttons,
//                    // change main icon to the current one:
//                    if (!topButton.classList.contains(
//                        'highcharts-menu-wrapper'
//                    )) {
//                        topButton.className = newClassName;
//                    }

//                    // Store info about active button:
//                    this.chart.activeButton = event.button;
//                },
//                deselectButton: function (event) {
//                    event.button.parentNode.parentNode.classList.remove(
//                        'highcharts-active'
//                    );

//                    // Remove info about active button:
//                    this.chart.activeButton = null;
//                },
//                showPopup: function (event) {

//                    if (!this.indicatorsPopupContainer) {
//                        this.indicatorsPopupContainer = document
//                            .getElementsByClassName(
//                                'highcharts-popup-indicators'
//                            )[0];
//                    }

//                    if (!this.annotationsPopupContainer) {
//                        this.annotationsPopupContainer = document
//                            .getElementsByClassName(
//                                'highcharts-popup-annotations'
//                            )[0];
//                    }

//                    if (event.formType === 'indicators') {
//                        this.indicatorsPopupContainer.style.display = 'block';
//                    } else if (event.formType === 'annotation-toolbar') {
//                        // If user is still adding an annotation, don't show
//                        // popup:
//                        if (!this.chart.activeButton) {
//                            this.chart.currentAnnotation = event.annotation;
//                            this.annotationsPopupContainer.style.display =
//                                'block';
//                        }
//                    }

//                },
//                closePopup: function () {
//                    this.indicatorsPopupContainer.style.display = 'none';
//                    this.annotationsPopupContainer.style.display = 'none';
//                }
//            }
//        },
//        stockTools: {
//            gui: {
//                enabled: false
//            }
//        },
//        series: [
//            {
//                type: 'candlestick',
//                id: 'aapl-ohlc',
//                name: stockCode,
//                //lastPrice: {
//                //    enabled: true,
//                //    label: {
//                //        enabled: true,
//                //        align: 'left',
//                //        x: 8
//                //    }
//                //},
//                data: ohlc
//            }, {
//                type: 'column',
//                //lastPrice: {
//                //    enabled: true,
//                //    label: {
//                //        format: '{#if value ge 1000000} ' +
//                //            '{(divide value 1000000):.2f} M {else} {value} {/if}',
//                //        enabled: true,
//                //        align: 'left',
//                //        x: 8
//                //    }
//                //},
//                keys: ['x', 'y', 'className'],
//                id: 'aapl-volume',
//                name: 'Volume',
//                data: volume,
//                yAxis: 1
//            }
//            //, {
//            //    type: 'line',
//            //    id: 'aapl-rsi',
//            //    name: 'RSI',
//            //    data: [],
//            //    yAxis: 2
//            //}
//        ],
//        responsive: {
//            rules: [{
//                condition: {
//                    maxWidth: 800
//                },
//                chartOptions: {
//                    rangeSelector: {
//                        inputEnabled: false
//                    }
//                }
//            }]
//        }
//    });

//})();

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

function drawBuySellValueLabels(chart) {
    const ren = chart.renderer,
        firstX = chart.plotLeft + 5,
        secondX = chart.xAxis[0].toPixels(6) - 10,
        y = chart.plotTop - 5;

    ren.text('Buy Value: <span id="intradayBuyValue"></span> tỷ', firstX, y).attr({
        stroke: '#1aa67c',
        'font-size': '10px',
        'stroke-width': 1
    }).add();

    ren.text('Sell Value: <span id="intradaySellValue"></span> tỷ', secondX, y).attr({
        stroke: '#ff0017',
        'font-size': '10px',
        'stroke-width': 1
    }).add();
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
    $scope.MarketSymbol = 'VNINDEX';
    $scope.MarketIndex = {};
    $scope.ExchangeId = 1;
    $scope.StockData = {};
    $scope.TickData = [];
    $scope.Trend = '';
    $scope.DateRange = '1D';
    $scope.Interval = 1;
    $scope.StockIndexes = [];
    $scope.IntradayValue = {};
    $scope.Tab = { "Main": '', "Child": '', "Type": 'MarketCap' };
    $scope.SoPhien = 10;

    $scope.ChooseTab = function () {
        if ($scope.Tab.Main == 'BDPTKT')
            initOnReady($scope.MarketSymbol);
        else if ($scope.Tab.Main == 'XuHuong')
            $scope.ProcessTabXuHuong();

        if ($scope.Tab.Main != 'BDPTKT' && widget_PTKT != null)
            widget_PTKT.remove();
            
    }; 

    $scope.ChooseChildTab = function () {
        if ($scope.Tab.Child == 'TongQuan')
            $scope.ProcessTabTongQuan();
        else if ($scope.Tab.Child == 'CungCau') {
            $scope.ProcessTabCungCau();
        }
        else if ($scope.Tab.Child == 'BanDo') {
            $scope.ProcessTabBanDo();
        }
        else if ($scope.Tab.Child == 'KhoiNgoai') {
            $scope.ProcessTabKhoiNgoai();
        }
    }; 

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

    var interval_GetStockDataBy = null;
    var interval_GetTickDataBy = null;

    $scope.RealTimeStockDataBy = function () {
        $scope.GetStockDataBy($scope.ActiveStock.Code);
    };

    $scope.RealTimeTickDataBy = function () {
        $scope.GetTickDataBy($scope.ActiveStock.Code);
    };

    $scope.ShowStock = function (x) {
        $('#Popup_Stock').modal('show');
        $scope.ActiveStock = x;
        $scope.GetStockDataBy(x.Code);
        $scope.GetTickDataBy(x.Code);
        $scope.LoadChart_RSI_Symbol(); 
        setTimeout(function () {
            var myRange = document.getElementById("myRange");
            
            var myValue = document.querySelector('#myValue');
            var myUnits = 'Tốt';
            myValue.innerHTML = myUnits;
            var off = myRange.offsetWidth / (parseInt(myRange.max) / parseInt(myRange.min));
            var px = (myRange.valueAsNumber) * off - (myValue.offsetParent != null ? myValue.offsetParent.offsetWidth : 0) / 2;

            myValue.parentElement.style.left = px + 'px';
           
            myRange.oninput = function () {
                let px = (myRange.valueAsNumber) * off - myValue.offsetParent.offsetWidth / 2;

                if (px < 0)
                    px = 0;

                myValue.parentElement.style.left = px + 'px';
            }

            $('#tong_quan_right').height($('#tong_quan_left').height() - 1);

            //widget_symbol.chart().setSymbol(x.Code);

        }, 1000);

        initOnReady_Symbol(x.Code);
        interval_GetStockDataBy = setInterval($scope.RealTimeStockDataBy, 2000);
        interval_GetTickDataBy = setInterval($scope.RealTimeTickDataBy, 2000);

    };

    $scope.CloseStock = function () {
        clearInterval(interval_GetStockDataBy);
        clearInterval(interval_GetTickDataBy);
        if (widget_symbol != null)
            widget_symbol.remove();
    };

    $scope.GetRecommendationsPortfolio = function (page) {
        PagePortfolio = page;

        pagesize = $('#selRecordPortfolio').val() == '' ? 10 : $('#selRecordPortfolio').val();

        if ($scope.Search_Status == undefined || $scope.Search_Status == null)
            $scope.Search_Status = -1;

        var input =
        {
            Page: page, PageSize: pagesize, Status: $scope.Search_Status, IsPublic: true
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
            url: '/Article/GetPublicArticles',
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

    $scope.LoadBienDongChart_All = function (industryCode, index) {
        $scope.Trend = '';

        $scope.LoadBienDongChart(industryCode, index, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    };

    $scope.LoadBienDongChart = function (industryCode, index, fromtradingdate = '', totradingdate = '', first = false) {
        $scope.IndustryCodeActive = industryCode;
        $scope.ColorIndexActive = index;
        if (industryCode === -1) {
            //$scope.Trend = '';
            $('#chart_DailyActiveReport .highcharts-axis-labels a').css('color', '');
        }

        $scope.LoadActivityByIndustryChart(industryCode, first);
        $scope.LoadNumberOfSharesChart(industryCode, first);
        $scope.LoadBubbleChart(industryCode, index, fromtradingdate, totradingdate, first);
    };

    $scope.GetColor = function (value) {
        if (value >= -0.5 && value < 0.5)
            return '#CCCC00';
        else if (value >= 0.5 && value < 2)
            return '#43AF1D';
        else if (value >= 2)
            return '#009900';
        else if (value >= -2 && value < -0.5)
            return '#CB4335';
        else
            return '#943126';
    }

    var chart_Bubble = null;

    $scope.LoadBubbleChart_Data = function (industryCode, first, dataFluctuation) {

        if (!first)
        {
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
                    //if (data[i].Stock[j].Y > 0)
                    //    mamau = '#0bdf39';
                    //else if (data[i].Stock[j].Y < 0)
                    //    mamau = '#ff0017';
                    //else
                    //    mamau = '#dfba49';

                    //if (data[i].Stock[j].PercentChange > -1 && data[i].Stock[j].PercentChange < 1)
                    //    mamau = '#CCCC00';
                    //else if (data[i].Stock[j].PercentChange >= 1 && data[i].Stock[j].PercentChange <= 3)
                    //    mamau = '#43AF1D';
                    //else if (data[i].Stock[j].PercentChange > 3)
                    //    mamau = '#009900';
                    //else if (data[i].Stock[j].PercentChange >= -3 && data[i].Stock[j].PercentChange <= -1)
                    //    mamau = '#CB4335';
                    //else
                    //    mamau = '#943126';

                    mamau = $scope.GetColor(data[i].Stock[j].PercentChange);

                    var _eleData = { x: data[i].Stock[j].X, y: data[i].Stock[j].Y, z: data[i].Stock[j].Z, name: data[i].Stock[j].Code, color: mamau, ema7: data[i].Stock[j].EMA7, ema21: data[i].Stock[j].EMA21, closepx: data[i].Stock[j].ClosePx, trend: data[i].Stock[j].Trend };
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
            if (dataFluctuation.length > 0) {
                const seriesConfig = {
                    series: dataFluctuation
                }
                chart_Bubble.update(seriesConfig, true, true);
            }

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
                min: 0,
                max: 100,
                gridLineWidth: 1,
                title: {
                    text: '<span style="font-size: 10px;font-weight:500">TỶ LỆ LỆNH MUA CHỦ ĐỘNG</span>'
                },
                accessibility: {
                    rangeDescription: 'Range: 0 to 100.'
                },
                plotLines: [{
                    color: 'red',
                    dashStyle: 'dot',
                    width: 1,
                    value: 50,
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
                min: -10,
                max: 10,
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: '<span style="font-size: 10px;font-weight:500">BIẾN ĐỘNG</span>'
                },
                accessibility: {
                    rangeDescription: 'Range: 0 to 100.'
                },
                plotLines: [{
                    color: 'red',
                    dashStyle: 'dot',
                    width: 1,
                    value: 0,
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
                    '<tr><th>Giá HT:</th><td>&nbsp;{point.closepx}</td></tr>' +
                    '<tr><th>Thay đổi:</th><td>&nbsp;{point.y} %</td></tr>' +
                    '<tr><th>Lực cầu:</th><td>&nbsp;{point.x} %</td></tr>' +
                    '<tr><th>GTGD:</th><td>&nbsp;{point.z} tỷ</td></tr>' +
                    '<tr><th>EMA 7:</th><td>&nbsp;{point.ema7}</td></tr>' +
                    '<tr><th>EMA 21:</th><td>&nbsp;{point.ema21}</td></tr>' +
                    '<tr><th>Xu hướng:</th><td>&nbsp;{point.trend}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    },
                    events: {
                        click: function (event) {
                            //alert(event.point.options.name);
                            var x = { Code: event.point.options.name };
                            angular.element(document.getElementById('kt_content')).scope().ShowStock(x);
                        }
                    }
                }
            },
            series: dataFluctuation

        });
    }

    $scope.LoadBubbleChart = function (industryCode, index, fromtradingdate = '', totradingdate = '', first = false) {
        running_BubbleChart = true;
        var dataFluctuation = [];
        var _arrData = [];
        var _arrIndustry = [];
        var _color = index;
        var _fromTradingTime = $scope.FromTradingTimeActive;
        var _toTradingTime = $scope.ToTradingTimeActive;

        if ($scope.DateRange == '1W') {
            _fromTradingTime = $filter('date')($scope.FromTradingTimeActive, "yyyy-MM-dd HH:mm:ss");
            _toTradingTime = $filter('date')($scope.ToTradingTimeActive, "yyyy-MM-dd HH:mm:ss");
        }

        //if (first) 
        {
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: fromtradingdate, ToTradingDate: totradingdate, ExchangeId: $scope.ExchangeId
                , Trend: $scope.Trend, DateRange: $scope.DateRange, FromTradingTime: _fromTradingTime, ToTradingTime: _toTradingTime
                , IndexId: $scope.IndexId
            };
            $.ajax({
                type: 'POST',
                url: '/Stock/Chart_GetBubbleByIndustry',
                async: true,
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
                success: function (data) {
                    if (!angular.equals($scope.dataBubbleChart, data)) {

                        $scope.dataBubbleChart = data;
                        $scope.TotalStock = 0;

                        for (var i = 0; data != null && i < data.length; i++) {
                            if (industryCode == -1)
                                _color = i;
                            _arrData = [];

                            var mamau = '';

                            for (var j = 0; data[i].Stock != null && j < data[i].Stock.length; j++) {
                                //if (data[i].Stock[j].Y > 0)
                                //    mamau = '#0bdf39';
                                //else if (data[i].Stock[j].Y < 0)
                                //    mamau = '#ff0017';
                                //else
                                //    mamau = '#dfba49';

                                //if (data[i].Stock[j].PercentChange > -1 && data[i].Stock[j].PercentChange < 1)
                                //    mamau = '#CCCC00';
                                //else if (data[i].Stock[j].PercentChange >= 1 && data[i].Stock[j].PercentChange <= 3)
                                //    mamau = '#43AF1D';
                                //else if (data[i].Stock[j].PercentChange > 3)
                                //    mamau = '#009900';
                                //else if (data[i].Stock[j].PercentChange >= -3 && data[i].Stock[j].PercentChange <= -1)
                                //    mamau = '#CB4335';
                                //else
                                //    mamau = '#943126';

                                mamau = $scope.GetColor(data[i].Stock[j].PercentChange);

                                var _eleData = { x: data[i].Stock[j].X, y: data[i].Stock[j].Y, z: data[i].Stock[j].Z, name: data[i].Stock[j].Code, color: mamau, ema7: data[i].Stock[j].EMA7, ema21: data[i].Stock[j].EMA21, closepx: data[i].Stock[j].ClosePx, trend: data[i].Stock[j].Trend };
                                _arrData.push(_eleData);
                            }

                            $scope.TotalStock += data[i].Stock != null ? data[i].Stock.length : 0;

                            if (industryCode == -1 && $scope.categoriesIndustry.length == 0 && data[i].Stock != null)
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

                        $scope.LoadBubbleChart_Data(industryCode, first, dataFluctuation);
                    }

                    running_BubbleChart = false;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    running_BubbleChart = false;
                }
            });
        }

    };

    $scope.FullScreenBubbleChart = function () {
        chart_Bubble.fullscreen.toggle();
        //$("#chart_Fluctuation").toggleClass('modal');
        //$("#chart_Fluctuation").highcharts().reflow();
    };

    $scope.FullScreenCPTheoVonHoaChart = function () {
        chart_CPTheoVonHoa.fullscreen.toggle();
    };

    var chart_ActivityByIndustry = null;

    $scope.LoadActivityByIndustryChart_Data = function (first, industryCode, categoriesIndustry, BuyValueIndustry, SellValueIndustry, AvgValueIndustry) {
        if (!first) {
            var data = [];

            if (industryCode == -1) {
                data = $scope.dataActivityByIndustryChart;
            }
            else {
                data = $scope.dataActivityByIndustryChart.Industries.filter((item) => item.IndustryCode === industryCode);
            }

            var dataLength = data.Industries.length;
            for (i = 0; i < dataLength; i++) {
                categoriesIndustry.push({ name: data.Industries[i].Name, industryCode: data.Industries[i].IndustryCode });
                BuyValueIndustry.push(data.Industries[i].BuyValue);
                SellValueIndustry.push(data.Industries[i].SellValue);
            }
        }

        if (chart_ActivityByIndustry != null) {
            chart_ActivityByIndustry.xAxis[0].update({
                labels: {
                    formatter: function () {
                        if (this.value < categoriesIndustry.length)
                            return '<a id="lbDAR' + this.value + '" title="' + categoriesIndustry[this.value].name + '" industryCode="' + categoriesIndustry[this.value].industryCode + '" index="' + this.value + '">' + categoriesIndustry[this.value].name + '</a>';
                    }
                }
            }, true);

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

            chart_ActivityByIndustry.series[2].update(
                {
                    data: AvgValueIndustry
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

            //$("#intradayBuyValue").text($scope.IntradayValue.BuyValue);
            //$("#intradaySellValue").text($scope.IntradayValue.SellValue);

            if (industryCode == -1) {
                chart_ActivityByIndustry.series[2].update({ marker: { enabled: false, width: 10 } });
            }
            else {
                chart_ActivityByIndustry.series[2].update({ marker: { enabled: true, width: 10 } });
            }

            return;
        }

        chart_ActivityByIndustry = Highcharts.chart('chart_DailyActiveReport', {
            chart: {
                type: 'column',
                events: {
                    load() {
                        const chart = this;
                        //drawBuySellValueLabels(chart);
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Giá trị mua bán chủ động theo ngành',
                //align: 'left'
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

                            angular.element(document.getElementById('kt_content')).scope().LoadBienDongChart(Number(industryCode), Number(index), $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
                        }
                    },
                    rotation: 0,
                    useHTML: true,
                    formatter: function () {
                        return '<a id="lbDAR' + this.value + '" title="' + categoriesIndustry[this.value].name + '" industryCode="' + categoriesIndustry[this.value].industryCode + '" index="' + this.value + '">' + categoriesIndustry[this.value].name + '</a>';
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
                    enabled: false
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
                },
                {
                    type: 'line',
                    step: 'center',
                    name: 'Average',
                    data: AvgValueIndustry,
                    lineWidth: 1,
                    //dashstyle: "shortdash",
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: false
                            }
                        },
                        lineWidth: 1,
                        width: 10,
                        lineColor: Highcharts.getOptions().colors[3],
                        symbol: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAADCAYAAAAKovabAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAaSURBVChTY/yU1/ufYYgAJig9JMAQciwDAwDtagLyVWaM9wAAAABJRU5ErkJggg==)',
                        fillColor: 'white'
                    }
                }

            ]
        });

        $("#intradayBuyValue").text($scope.IntradayValue.BuyValue);
        $("#intradaySellValue").text($scope.IntradayValue.SellValue);

        //alert(Highcharts.getOptions().colors[0]);
        //$('#bubble_tooltip0').css({ "color": rgba(44, 175, 254, 0.5) });
        //document.getElementById('bubble_tooltip0').style.color = rgba(44, 175, 254, 0.5);
    }

    $scope.LoadActivityByIndustryChart = function (industryCode, first = false) {
        running_ActivityByIndustryChart = true;
        var categoriesIndustry = [];
        var BuyValueIndustry = [];
        var SellValueIndustry = [];
        var AvgValueIndustry = [];

        //if (first) {
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
                , ExchangeId: $scope.ExchangeId, IndexId: $scope.IndexId
            };
            $.ajax({
                type: 'POST',
                url: '/Stock/Chart_GetActivityByIndustry',
                async: true,
                dataType: 'json',
                data: {
                    data: JSON.stringify(input)
                },
                success: function (data) {
                    //if (!angular.equals($scope.dataActivityByIndustryChart, data)) {
                    $scope.dataActivityByIndustryChart = data;

                    if (data != null) {
                        $scope.IntradayValue = data.Intraday;
                    }

                    for (i = 0; data != null && i < data.Industries.length; i++) {
                        categoriesIndustry.push({ name: data.Industries[i].Name, industryCode: data.Industries[i].IndustryCode });
                            //BuyValueIndustry.push({ name: data[i].Name, value: data[i].BuyValue });
                            //SellValueIndustry.push({ name: data[i].Name, value: data[i].SellValue });
                        BuyValueIndustry.push(data.Industries[i].BuyValue);
                        SellValueIndustry.push(data.Industries[i].SellValue);
                        AvgValueIndustry.push(data.Industries[i].AvgValue);
                    }

                    $scope.LoadActivityByIndustryChart_Data(first, industryCode, categoriesIndustry, BuyValueIndustry, SellValueIndustry, AvgValueIndustry);
                   // }
                    running_ActivityByIndustryChart = false;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    running_ActivityByIndustryChart = false;
                }
            });
        //}
        
        
    };

    /*$scope.LoadActivityByIndustryChart_Data = function (categoriesIndustry, BuyValueIndustry, SellValueIndustry) {
        chart_ActivityByIndustry = Highcharts.chart('chart_DailyActiveReport', {
            title: {
                text: 'Giá trị mua bán chủ động theo ngành'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
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
            xAxis: {
                type: 'category',
                crosshair: true,
                accessibility: {
                    description: 'Countries'
                },
                lineWidth: 0,
                labels: {
                    events: {
                        click: function () {
                            var doc = new DOMParser().parseFromString(this.label.textStr, "text/xml");
                            var industryCode = doc.firstChild.getAttribute("industryCode");
                            var index = doc.firstChild.getAttribute("index");

                            $('#chart_DailyActiveReport .highcharts-axis-labels a').css('color', '');

                            $('#lbDAR' + index).css('color', 'red');

                            angular.element(document.getElementById('kt_content')).scope().LoadBienDongChart(Number(industryCode), Number(index), $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
                        }
                    },
                    rotation: 0,
                    useHTML: true,
                    formatter: function () {
                        return '<a id="lbDAR' + this.value + '" title="' + categoriesIndustry[this.value].name + '" industryCode="' + categoriesIndustry[this.value].industryCode + '" index="' + this.value + '">' + categoriesIndustry[this.value].name + '</a>';
                    },
                    style: {
                        textDecoration: "none"
                    }
                } 
            },
            yAxis: {
                title: {
                    text: 'GTGD'
                }
            },
            //tooltip: {
            //    valueSuffix: ' tỷ'
            //},
            plotOptions: {
                series: {
                    borderRadius: '25%'
                }
            },
            series: [
                {
                    type: 'column',
                    name: 'Buy Value',
                    color: '#1aa67c',
                    data: BuyValueIndustry,
                    borderRadius: 0
                },
                {
                    type: 'column',
                    name: 'Sell Value',
                    color: '#ff0017',
                    data: SellValueIndustry,
                    borderRadius: 0
                }
                , {
                type: 'line',
                step: 'center',
                name: 'Average',
                data: [1147, 1183.33, 1170.66, 1239.33, 1175.66],
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }, {
                type: 'pie',
                name: 'Total',
                data: [{
                    name: 'Buy Value',
                    y: 1119,
                    color: Highcharts.getOptions().colors[0], // 2020 color
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        format: '{point.total}',
                        style: {
                            fontSize: '15px'
                        }
                    }
                }, {
                    name: 'Sell Value',
                    y: 3486,
                    color: Highcharts.getOptions().colors[1] // 2021 color
                }],
                center: [75, 65],
                size: 100,
                innerSize: '70%',
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            }]
        });
    }*/

    $scope.LoadActivityByIndustryChart_2 = function (industryCode, first = false) {
        var categoriesIndustry = [];
        var BuyValueIndustry = [];
        var SellValueIndustry = [];

        var input =
        {
            IndustryCode: industryCode, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, IndexId: $scope.IndexId
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_GetActivityByIndustry',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                //if (!angular.equals($scope.dataActivityByIndustryChart, data)) {
                $scope.dataActivityByIndustryChart = data;

                for (i = 0; data != null && i < data.length; i++) {
                    categoriesIndustry.push({ name: data[i].Name, industryCode: data[i].IndustryCode });
                    //BuyValueIndustry.push({ name: data[i].Name, value: data[i].BuyValue });
                    //SellValueIndustry.push({ name: data[i].Name, value: data[i].SellValue });
                    BuyValueIndustry.push(data[i].BuyValue);
                    SellValueIndustry.push(data[i].SellValue);
                }

                $scope.LoadActivityByIndustryChart_Data(categoriesIndustry, BuyValueIndustry, SellValueIndustry);
                // }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    };

    var chart_NumberOfShares = null;

    $scope.LoadNumberOfSharesChart = function (industryCode, first = false) {
        running_NumberOfSharesChart = true;
        // Build the chart
        //if (first)
        {
            var dataChart = [];
            var input =
            {
                IndustryCode: industryCode, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
                , ExchangeId: $scope.ExchangeId, IndexId: $scope.IndexId
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
                    if (angular.equals($scope.DataNumberOfShares, data)) {
                        $scope.DataNumberOfShares = data;
                        return;
                    }

                    dataChart = [{
                        name: 'Không đổi',
                        y: data.UnChanged,
                        value: data.UnChanged,
                        type: 'UnChanged'
                    }, {
                        name: 'Tăng',
                        y: data.Increase,
                        value: data.Increase,
                        type: 'Increase'
                    }, {
                        name: 'Tăng mạnh',
                        y: data.IncreaseSharply,
                        value: data.IncreaseSharply,
                        type: 'IncreaseSharply'
                    }, {
                        name: 'Giảm',
                        y: data.Decrease,
                        value: data.Decrease,
                        type: 'Decrease'
                    }, {
                        name: 'Giảm mạnh',
                        y: data.DecreaseSharply,
                        value: data.DecreaseSharply,
                        type: 'DecreaseSharply'
                    }];


                    if (chart_NumberOfShares != null && chart_NumberOfShares.series != undefined) {
                        chart_NumberOfShares.series[0].update(
                            {
                                data: dataChart
                            }
                        );

                        $("#lbPieChart").text(data.Total + ' CP');
                        return;
                    }

                    $('.PieChart_Stocks').each(function () {
                        chart_NumberOfShares = $(this).highcharts({
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
                                text: 'Số cổ phiếu tăng giảm'
                            },
                            tooltip: {
                                pointFormat: '<b>{point.percentage:.0f}% ({point.value})</b>'
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
                                        //format: '<span id=lbPieChartType_{point.type}>{point.name}<br/><b>{point.percentage:.0f}% ({point.value})</b></span>'
                                        formatter: function () {
                                            var _trend = angular.element(document.getElementById('kt_content')).scope().Trend;
                                            if (_trend != "" && this.point.type == _trend) {
                                                return '<span style="color: red' + '">' + this.point.name + '<br/><b>' + Highcharts.numberFormat(this.point.percentage, 0) + '% (' + this.point.value + ')</b></span>';
                                            }
                                            else
                                                return '<span>' + this.point.name + '<br/><b>' + Highcharts.numberFormat(this.point.percentage, 0) + '% (' + this.point.value + ')</b></span>';
                                        }
                                    }, {
                                        enabled: false,
                                        distance: -15,
                                        format: '{point.percentage:.0f}%',
                                        style: {
                                            fontSize: '0.9em'
                                        }
                                    }],
                                    colors: [
                                        '#CCCC00',
                                        '#43AF1D',
                                        '#009900',
                                        '#CB4335',
                                        '#943126'
                                    ],
                                    showInLegend: true,
                                    animation: false,
                                    point: {
                                        events: {
                                            click: function (event) {
                                                angular.element(document.getElementById('kt_content')).scope().Trend = this.type;
                                                var series = this.series;
                                                var _trend = this.type;

                                                $.each(series.points, function (index, value) {
                                                    //if (_trend != "" && value.type === _trend) {
                                                        value.update({
                                                            dataLabels: [{
                                                                enabled: true,
                                                                distance: 2,
                                                                //format: '<span style="color:red">{point.name}<br/><b>{point.percentage:.0f}% ({point.value})</b></span>'
                                                                formatter: function () {
                                                                    var _trend = angular.element(document.getElementById('kt_content')).scope().Trend;
                                                                    if (_trend != "" && value.type == _trend) {
                                                                        return '<span style="color: red' + '">' + value.name + '<br/><b>' + Highcharts.numberFormat(value.percentage, 0) + '% (' + value.value + ')</b></span>';
                                                                    }
                                                                    else
                                                                        return '<span>' + value.name + '<br/><b>' + Highcharts.numberFormat(value.percentage, 0) + '% (' + value.value + ')</b></span>';
                                                                }
                                                            }]
                                                        });
                                                    //}
                                                });

                                                angular.element(document.getElementById('kt_content')).scope().LoadBubbleChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
                                            }
                                        }
                                    }  
                                }
                            },
                            series: [{
                                name: 'Stock',
                                colorByPoint: true,
                                innerSize: '60%',
                                data: dataChart
                            }]
                        });
                    });

                    //if ($scope.Trend != "") {
                    //    $("#lbPieChartType_" + $scope.Trend).setAttribute('fill', "red");
                    //}
                    running_NumberOfSharesChart = false;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    running_NumberOfSharesChart = false;
                }
            });
        }

    };

    var currentSlider = 1;
    var maxSlider = 1;

    $scope.Chart_GetDates = function (interval) {
        running_Chart_GetDates = true;
        $scope.Interval = interval;

        var input =
        {
            INTERVAL: interval, DateRange: $scope.DateRange, ExchangeId: $scope.ExchangeId
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
                if (!angular.equals($scope.TradingDates, data)) {
                    $scope.TradingDates = data;

                    $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
                    $scope.ToTradingDateActive = $scope.TradingDates[$scope.TradingDates.length - 1].TradingDate;

                    var valueSlider = 0;

                    if ($scope.DateRange == '1D' || $scope.DateRange == '1W') {
                        if ($scope.TradingDates[0].Times != null) {
                            $scope.FromTradingTimeActive = $scope.TradingDates[0].Times[0].Time;
                            $scope.ToTradingTimeActive = $scope.TradingDates[0].Times[$scope.TradingDates[0].Times.length - 1].Time;

                            maxSlider = $scope.TradingDates[0].Times.length;
                            valueSlider = $scope.TradingDates[0].Times.length;
                        }
                    }
                    else {
                        maxSlider = $scope.TradingDates.length;
                        valueSlider = $scope.TradingDates.length;
                    }

                    //$("#slider-range-date-biendong").slider("destroy");

                    $("#slider-range-date-biendong").slider({
                        isRTL: Metronic.isRTL(),
                        range: "max",
                        min: 1,
                        max: maxSlider,
                        valueSlider: valueSlider,
                        slide: function (event, ui) {
                            //$("#slider-range-max-amount").text(ui.value);
                            currentSlider = ui.value;

                            if ($scope.DateRange == '1D' || $scope.DateRange == '1W') {
                                if ($scope.TradingDates[0].Times != null) {
                                    $scope.FromTradingTimeActive = $scope.TradingDates[0].Times[0].Time;
                                    $scope.ToTradingTimeActive = $scope.TradingDates[0].Times[currentSlider - 1].Time;

                                    $scope.ToTradingDateActive = $filter('date')(new Date($scope.ToTradingTimeActive), "yyyy-MM-dd");
                                }
                            }
                            else {
                                $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
                                $scope.ToTradingDateActive = $scope.TradingDates[currentSlider - 1].TradingDate;
                            }

                            if (!$scope.$$phase) { $scope.$apply(); }
                            setTimeout(function () {
                                $scope.LoadBienDongChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
                            }, 100);

                        }
                    });

                    $("#slider-range-date-biendong").slider('value', valueSlider);

                    if (!$scope.$$phase) { $scope.$apply(); }
                }
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

        running_Chart_GetDates = false;
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

    $scope.StockArray = [];

    $("#XuHuong_Stock_Search").autocomplete({
        minLength: 1
    });

    $scope.Complete_XuHuong_Stock = function () {
        $scope.availableTags = [];
        var input =
        {
            Name: $scope.XuHuongStock
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

        $("#XuHuong_Stock_Search").autocomplete({
            source: $scope.availableTags,
            select: function (event, ui) {
                //$scope.StockId = ui.item.id;
                $scope.Stock_Search(ui.item.value);
            }
        });

    }

    $scope.Stock_Search = function (value) {
        if ($scope.Tab.Main == 'XuHuong') {
            $scope.StockArray.push(value);
            $scope.Load_Chart_XuHuong_TangTruong();
        }
    };

    var chart_RelativeRotationGraph = null;

    $scope.Chart_RelativeRotationGraph_Data = function (series) {
        //Highcharts.addEvent(Highcharts.Chart, 'load', function () {
        //    if (this.options.chart.className.indexOf('rounded-plot-border') !== -1) {
        //        this.plotBorder.attr({
        //            rx: 10,
        //            ry: 10,
        //            zIndex: 6
        //        });
        //    }
        //});
        //console.log(series);

        if (chart_RelativeRotationGraph != null) {
            chart_RelativeRotationGraph.update({ series: series });

            return;
        }

        chart_RelativeRotationGraph = Highcharts.chart('chart_RelativeRotationGraph', {
            chart: {
                type: 'scatter',
                /*height: '90%',*/
                plotBorderWidth: 10,
                plotBorderColor: '#ffffff',
                backgroundColor: '#f7f7f8',
                spacing: [10, 85, 15, 20],
                style: {
                    fontFamily: 'IBM Plex Sans'
                },
                className: 'rounded-plot-border'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            annotations: [{
                draggable: false,
                shapeOptions: {
                    type: 'path',
                    strokeWidth: 0
                },
                shapes: [{
                    fill: {
                        radialGradient: {
                            cx: 0,
                            cy: 1,
                            r: 1.1
                        },
                        stops: [
                            [0, 'rgba(255, 0, 0, 0.2)'],
                            [1, 'rgba(255,255,255, 0.1)']
                        ]
                    },
                    points: [{
                        x: 94,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 94,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }]
                }, {
                    fill: {
                        radialGradient: {
                            cx: 0,
                            cy: 0,
                            r: 1.1
                        },
                        stops: [
                            [0, 'rgba(0, 0, 255, 0.1)'],
                            [1, 'rgba(255,255,255, 0.1)']
                        ]
                    },
                    points: [{
                        x: 94,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 94,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }]
                }, {
                    fill: {
                        radialGradient: {
                            cx: 1,
                            cy: 0,
                            r: 1.1
                        },
                        stops: [
                            [0, 'rgba(0, 255, 0, 0.1)'],
                            [1, 'rgba(255,255,255, 0.1)']
                        ]
                    },
                    points: [{
                        x: 100,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 106,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 106,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }]
                }, {
                    fill: {
                        radialGradient: {
                            cx: 1,
                            cy: 1,
                            r: 1.1
                        },
                        stops: [
                            [0, 'rgba(255, 255, 0, 0.2)'],
                            [1, 'rgba(255,255,255, 0.1)']
                        ]
                    },
                    points: [{
                        x: 100,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 106,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 106,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: 100,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }]
                }],
                labelOptions: {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    y: 0,
                    padding: 10,
                    style: {
                        fontSize: '12px',
                        fontWeight: 700,
                        textOutline: '3px #ffffff80'
                    }
                },
                labels: [{
                    text: 'LAGGING',
                    style: {
                        color: '#c80056'
                    },
                    point: {
                        x: 94,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }
                }, {
                    text: 'IMPROVING',
                    style: {
                        color: '#004bb3'
                    },
                    point: {
                        x: 94,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }
                }, {
                    text: 'LEADING',
                    style: {
                        color: '#008224'
                    },
                    point: {
                        x: 106,
                        y: 106,
                        xAxis: 0,
                        yAxis: 0
                    }
                }, {
                    text: 'WEAKENING',
                    style: {
                        color: '#9a5c00'
                    },
                    point: {
                        x: 106,
                        y: 94,
                        xAxis: 0,
                        yAxis: 0
                    }
                }]
            }],
            title: {
                text: 'Bản đồ RRG'
            },
            plotOptions: {
                series: {
                    lineWidth: 2,
                    marker: {
                        enabled: true,
                        radius: 3,
                        symbol: 'circle'
                    }
                }
            },
            tooltip: {
                pointFormat: 'RS-Ratio®️: <b>{point.x}</b></br>' +
                    'RS-Momentum®️: <b>{point.y}</b>'
            },
            xAxis: {
                min: 94,
                max: 106,
                plotLines: [{
                    value: 100,
                    width: 1,
                    color: '#000000',
                    zIndex: 1
                }],
                title: {
                    text: 'JdK RS-Ratio®️',
                    style: {
                        fontWeight: 'bold'
                    }
                },
                tickWidth: 0,
                lineWidth: 0,
                gridLineWidth: 1
            },
            yAxis: {
                min: 94,
                max: 106,
                plotLines: [{
                    value: 100,
                    width: 1,
                    color: '#000000',
                    zIndex: 1
                }],
                title: {
                    text: 'JdK RS-Momentum®️',
                    style: {
                        fontWeight: 'bold'
                    }
                },
                gridLineWidth: 1
            },
            series: series,
            navigation: {
                buttonOptions: {
                    theme: {
                        fill: 'none'
                    },
                    y: -7
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            spacing: [10, 10, 15, 10],
                            height: '100%',
                            plotBorderWidth: 7
                        },
                        title: {
                            style: {
                                fontSize: 13
                            }
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    enabled: false
                                }
                            }
                        },
                        xAxis: {
                            labels: {
                                distance: 6,
                                style: {
                                    fontSize: '0.6em'
                                }
                            },
                            title: {
                                style: {
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        yAxis: {
                            labels: {
                                distance: 8,
                                style: {
                                    fontSize: '0.6em'
                                }
                            },
                            title: {
                                style: {
                                    fontWeight: 'normal'
                                }
                            }
                        }
                    }
                }]
            }
        });

    };

    $scope.Chart_RelativeRotationGraph = function () {
        running_XuHuong_RRG = true;
        var series = [];

        var input =
        {
            SoPhien: $scope.SoPhien, ExchangeId: $scope.ExchangeId
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_RRG',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var seriesdata = [];
                    var name = data[i].Code;
                    for (var j = 0; j < data[i].RS_Ratio.length; j++) {
                        var childdata = [];
                        childdata.push(data[i].RS_Ratio[j].Value);
                        childdata.push(data[i].RS_Momentum[j].Value);
                        seriesdata.push(childdata);
                    }
                    series.push({ name: name, data: seriesdata });
                }

                if (!angular.equals($scope.XuHuongRRGSeries, series))
                    $scope.Chart_RelativeRotationGraph_Data(series);

                $scope.XuHuongRRGSeries = series;

                running_XuHuong_RRG = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_XuHuong_RRG = false;
            }
        });

    };

    $("#range_xuhuong_phien").ionRangeSlider({
        from: 10,
        to: 90,
        min: 10,
        max: 90,
        valueSlider: 10,
        type: 'single',
        step: 10,
        postfix: "",
        prettify: false,
        hasGrid: false,
        onChange: function (obj) {
            val = obj.fromNumber;
            if (val != $scope.SoPhien) {
                $scope.SoPhien = val;
                $scope.Load_Chart_XuHuong_TangTruong();
                $scope.Chart_RelativeRotationGraph();
            }
            
        }
    });

    $scope.SelectionStock = function (x) {
        var index = $scope.StockArray.findIndex(v => v == x); // index will be 1

        if (index >= 0) {
            $scope.StockArray.splice(index, 1);
            //console.log($scope.StockArray);
        }

        var series = [];

        for (var i = 0; i < $scope.XuHuongNganhSeries.length; i++) {
            var indus = $scope.XuHuongNganh.find(v => v.name == $scope.XuHuongNganhSeries[i].name);
            if (indus != null && indus.Check)
                series.push($scope.XuHuongNganhSeries[i]);
            else {
                if($scope.XuHuongNganhSeries[i].name != x)
                    series.push($scope.XuHuongNganhSeries[i]);
            }
        }

        $scope.Load_Chart_XuHuong_TangTruong_Data(series);
    };

    $scope.SelectionIndustry = function (id) {
        var index = $scope.XuHuongNganh.findIndex(v => v.Id == id); // index will be 1

        if (index >= 0) {
            //var indexStock = $scope.StockArray.indexOf($scope.XuHuongNganh[index].Code);
            //if (indexStock >= 0) {
            //    $scope.StockArray.splice(indexStock, 1);
            //    $scope.XuHuongNganh.splice(index, 1);
            //}
            //else
            //$scope.XuHuongNganh.find(v => v.Id == id).Check = !$scope.XuHuongNganh.find(v => v.Id == id).Check;

            $scope.XuHuongNganh[index].Check = !$scope.XuHuongNganh[index].Check;
        }

        var series = [];
        
        for (var i = 0; i < $scope.XuHuongNganhSeries.length; i++) {
            var indus = $scope.XuHuongNganh.find(v => v.Id == $scope.XuHuongNganhSeries[i].id);
            if (indus != null && indus.Check)
                series.push($scope.XuHuongNganhSeries[i]);
            else {
                var name = $scope.XuHuongNganhSeries[i].name;
                var index = $scope.StockArray.findIndex(v => v == name); // index will be 1

                if (index >= 0) {
                    series.push($scope.XuHuongNganhSeries[i]);
                }
            }
        }

        $scope.Load_Chart_XuHuong_TangTruong_Data(series);
    };

    var chart_XuHuong_TangTruong = null;

    $scope.Load_Chart_XuHuong_TangTruong_Data = function (series) {
        //if (chart_XuHuong_TangTruong != null) {
        //    chart_XuHuong_TangTruong.update({ series: series }, true);
        //    chart_XuHuong_TangTruong.redraw()
        //    return;
        //}

        (async () => {

            //const names = ['MSFT', 'AAPL', 'GOOG'];

            /**
             * Create the chart when all data is loaded
             * @return {undefined}
             */
            function createChart(series) {

                chart_XuHuong_TangTruong = Highstock.stockChart('chart_XuHuong_TangTruong', {
                    navigator: {
                        enabled: false
                    },
                    rangeSelector: {
                        enabled: false,
                        selected: 4
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    scrollbar: {
                        enabled: false
                    },
                    yAxis: {
                        labels: {
                            format: '{#if (gt value 0)}+{/if}{value}%'
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },

                    plotOptions: {
                        series: {
                            compare: 'percent',
                            showInNavigator: true
                        }
                    },

                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">' +
                            '{series.name}</span>: <b>{point.y}</b> ' +
                            '({point.change}%)<br/>',
                        valueDecimals: 2,
                        split: true
                    },

                    series: series
                });

            }

            //const series = [];
            //for (const name of names) {
            //    const response = await fetch(
            //        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
            //        'samples/data/' + name.toLowerCase() + '-c.json'
            //    );
            //    const data = await response.json();
            //    series.push({ name, data });
            //}

            createChart(series);

        })();
    };

    $scope.XuHuongNganh = [];

    $scope.Load_Chart_XuHuong_TangTruong = function () {
        running_XuHuong_TangTruong = true;
        var series = [], nganh = [];

        var input =
        {
            SoPhien: $scope.SoPhien, ExchangeId: $scope.ExchangeId, Stocks: $scope.StockArray.map(e => e.replace(/\s/g, "")).join(";")//.toString()
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_XuHuong_TangTruong',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var seriesdata = [];
                    var name = data[i].Code;

                    //nganh.push({ "Id": data[i].Id, "Code": data[i].Code, "Check": true });

                    var indus = $scope.XuHuongNganh.find(v => v.Id == data[i].Id);
                    if (indus == null && data[i].IndustryCode < 0) {
                        $scope.XuHuongNganh.push({ "Id": data[i].Id, "Code": data[i].Code, "Check": true });
                    }

                    indus = $scope.XuHuongNganh.find(v => v.Id == data[i].Id);
                    if ((indus != null && indus.Check) || data[i].IndustryCode >= 0)
                    {
                        for (var j = 0; j < data[i].Trading.length; j++) {
                            var childdata = [];
                            childdata.push(data[i].Trading[j].TradingDate);
                            childdata.push(data[i].Trading[j].ClosePx);
                            seriesdata.push(childdata);
                        }

                        series.push({ id: data[i].Id, name: name, data: seriesdata });
                    }
                }

                //if (!angular.equals($scope.XuHuongNganh, nganh))
                //    $scope.XuHuongNganh = nganh;

                if (!angular.equals($scope.XuHuongNganhSeries, series))
                    $scope.Load_Chart_XuHuong_TangTruong_Data(series);

                $scope.XuHuongNganhSeries = series;

                running_XuHuong_TangTruong = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_XuHuong_TangTruong = false;
            }
        });
    };

    var myTimerSliderChart = null;

    $scope.IsPlay = false;
    $scope.TextPlay = 'REPLAY';

    $scope.Chart_Play = function () {
        if (!$scope.IsPlay) {
            if (currentSlider == maxSlider) {
                currentSlider = 0;
            }

            $scope.IsPlay = true;
            $scope.TextPlay = 'STOP';
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
            if ($scope.IsPlay) {
                $scope.IsPlay = false;
                $scope.TextPlay = 'REPLAY';
                clearInterval(myTimerSliderChart);
                if (!$scope.$$phase) { $scope.$apply(); }
                return;
            }
            else
                currentSlider = 1;
        }

        $("#slider-range-date-biendong").slider('value', currentSlider);   

        if ($scope.DateRange == '1D' || $scope.DateRange == '1W') {
            if ($scope.TradingDates[0].Times != null) {
                $scope.FromTradingTimeActive = $scope.TradingDates[0].Times[0].Time;
                $scope.ToTradingTimeActive = $scope.TradingDates[0].Times[currentSlider - 1].Time;

                $scope.ToTradingDateActive = $filter('date')(new Date($scope.ToTradingTimeActive), "yyyy-MM-dd");
            }
        }
        else {
            $scope.FromTradingDateActive = $scope.TradingDates[0].TradingDate;
            $scope.ToTradingDateActive = $scope.TradingDates[currentSlider - 1].TradingDate;
        }

        if (!$scope.$$phase) { $scope.$apply(); }

        $scope.LoadBienDongChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    };

    var chart_BulletGraph_1 = null, chart_BulletGraph_2 = null, chart_BulletGraph_3 = null;

    $scope.Reload = function () {
        //setTimeout(function () {
        //    chart_BulletGraph_1.redraw();
        //    chart_BulletGraph_2.redraw();
        //    chart_BulletGraph_3.redraw();
        //    //$scope.LoadChartBulletGraph();
        //}, 1000);
    }

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

        chart_BulletGraph_3 = Highcharts.chart('chart_BulletGraph_3', {
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
                center: ['50%', '60%'],
                size: '110%'
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

    $scope.LoadChart_RSI_Symbol = function () {

        Highcharts.chart('chart_rsi_symbol', {

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
                center: ['50%', '60%'],
                size: '130%'
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
                    thickness: 5,
                    borderRadius: '0%'
                }, {
                    from: 20,
                    to: 40,
                    color: '#CB4335', // red
                    thickness: 5,
                    borderRadius: '0%'
                }, {
                    from: 40,
                    to: 60,
                    color: '#CCCC00', // yellow
                    thickness: 5
                }, {
                    from: 60,
                    to: 80,
                    color: '#43AF1D', // yellow
                    thickness: 5
                }, {
                    from: 80,
                    to: 100,
                    color: '#009900', // yellow
                    thickness: 5
                }]
            },

            series: [{
                name: 'RSI',
                data: [$scope.TradingIndex.RSI],
                tooltip: {
                    valueSuffix: ''
                },
                dataLabels: {
                    format: '',
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
                    baseWidth: 6,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 3
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
        $('#btgrIndex > button').removeClass('active');
        $('#bt' + symbol).addClass('active');
        $scope.IndexId = '';
        $scope.MarketSymbol = symbol;
        $scope.ExchangeId = exchangeid;
        $scope.GetStockTradingIndex($scope.ExchangeId);
        $scope.GetStockTrading($scope.ExchangeId);
        $scope.LoadChartIndex(symbol);
        //$scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
        //$scope.LoadActivityByIndustryChart(-1, true);
        if(widget_PTKT != null)
            widget_PTKT.chart().setSymbol(symbol);

        widget_Index.chart().setSymbol(symbol);
        //$scope.LoadChartCPTheoVonHoa();
        //$scope.LoadBienDongThanhKhoan();
        //$scope.LoadBienDongChiSoTheoNganh();
        //$scope.LoadChartCoPhieuAnhHuong();
        //$scope.LoadChartGDKhoiNgoai();
        $scope.ChooseChildTab();
    };

    $scope.ChonLoaiChartBienDong = function (event, type, daterange = '') {
        $scope.FromTradingTimeActive = null;
        $scope.ToTradingTimeActive = null;

        $scope.DateRange = daterange;
        $scope.Chart_GetDates(type);
        //$scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
        //$scope.LoadActivityByIndustryChart(-1, true);
        $scope.TypeChartBienDong = type;
        $('#btgrLoaiBienDong > a').removeClass('active');
        $('#btgrLoaiBienDong2 > a').removeClass('active');
        //$(event.target).addClass('active');
        $('.coLBD' + daterange).addClass('active');
        //$scope.LoadChartCPTheoVonHoa();
        //$scope.LoadBienDongThanhKhoan();
        //$scope.LoadBienDongChiSoTheoNganh();
        ////$scope.LoadChartCoPhieuAnhHuong();
        //$scope.LoadChartGDKhoiNgoai();

        $scope.ChooseChildTab();
    };

    $scope.ChooseIndex = function () {
        //$scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
        //$scope.LoadActivityByIndustryChart(-1, true);
        //$scope.LoadChartCPTheoVonHoa();
        //$scope.LoadBienDongThanhKhoan();
        //$scope.LoadBienDongChiSoTheoNganh();
        //$scope.LoadChartCoPhieuAnhHuong();
        //$scope.LoadChartGDKhoiNgoai();
        $scope.IndexId = $('#selIndex').val();
        $scope.ChooseChildTab();
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

                    //$scope.Add_RIS_Chart(true, rsi)
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
        running_StockTradingIndex = true;
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
                //if (!angular.equals($scope.StockTradingIndex, response)) {
                    $scope.StockTradingIndex = response;
                    if (response != null) {
                        $scope.MarketIndex = $scope.StockTradingIndex.filter(function (item) {
                            return item.Code === $scope.MarketSymbol;
                        })[0];

                        var TempStockIndexes = [];
                        response.forEach(function (entry) {
                            TempStockIndexes.push({ Id: entry.Id, Code: entry.Code });
                        });

                        if (!angular.equals($scope.StockIndexes, TempStockIndexes)) {
                            $scope.StockIndexes = TempStockIndexes;
                            if ($scope.StockIndexes.length > 0)
                                $scope.IndexId = $scope.StockIndexes[0].Id
                        }
                    }

                    if (!$scope.$$phase) { $scope.$apply(); }
                //}
                running_StockTradingIndex = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_StockTradingIndex = false;
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

    $scope.GetStockDataBy = function (symbol) {
        var input =
        {
            Code: symbol
        };

        $http(
            {
                method: 'POST',
                url: '/Stock/GetStockDataBy',
                params: { data: JSON.stringify(input) },
            }).then(function (response) {
                if (!angular.equals($scope.StockData, response.data)) {
                    $scope.StockData = response.data;
                }
                
            }, function (error) {
                $scope.StockData = {};
            });
    };

    $scope.GetTickDataBy = function (symbol) {
        var input =
        {
            Code: symbol
        };

        $http(
            {
                method: 'POST',
                url: '/Stock/GetTickDataBy',
                params: { data: JSON.stringify(input) },
            }).then(function (response) {
                if (!angular.equals($scope.TickData, response.data)) {
                    $scope.TickData = response.data;
                    setTimeout(function () {
                        $(".table-scrollable").freezeTable({
                            'scrollable': true,
                        });
                    }, 3000);
                }
                
            }, function (error) {
                $scope.TickData = [];
            });
    };

    var chart_CPTheoVonHoa = null;

    $scope.LoadChartCPTheoVonHoa_Data = function (categories, tangManh, tangNhe, khongDoi, giam, giamManh) {

        if (chart_CPTheoVonHoa != null) {
            chart_CPTheoVonHoa.xAxis[0].update({ categories: categories });

            chart_CPTheoVonHoa.series[0].update(
                {
                    data: tangManh
                }
            );

            chart_CPTheoVonHoa.series[1].update(
                {
                    data: tangNhe
                }
            );

            chart_CPTheoVonHoa.series[2].update(
                {
                    data: khongDoi
                }
            );

            chart_CPTheoVonHoa.series[3].update(
                {
                    data: giam
                }
            );

            chart_CPTheoVonHoa.series[4].update(
                {
                    data: giamManh
                }
            );
            return;
        }

        chart_CPTheoVonHoa = Highcharts.chart('chart_CPTheoVonHoa', {
            colors: ['#009900', '#43AF1D', '#CCCC00', '#CB4335', '#943126'],
            chart: {
                type: 'column',
                inverted: true,
                polar: true
            },
            title: {
                useHTML: true,
                text: '<div style="width:100%"><span style="text-align: center;font-size: 1.0em !important;">Biến động cổ phiếu</span>' +
                    '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                    '<li id="FullScreenCPTheoVonHoaChart" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                    '<span class="highcharts-menu-item-btn"></span>' +
                    '</li>' +
                    '</ul></span></div>'
            },
            credits: {
                enabled: false
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                outside: true
            },
            pane: {
                size: '85%',
                innerSize: '20%',
                endAngle: 270
            },
            legend: {
                //layout: 'proximate',
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemMarginTop: 10,
                itemMarginBottom: 10,
                useHTML: true,
                labelFormatter: function () {
                    var soluong = 0, index = this.index;
                    //console.log(this.chart.series[index].yData.length);
                    //for (var i = 0; i < this.chart.series[index].yData.length; i++) {
                    //    //console.log(this.chart.series[index].yData);
                    //    console.log(this.chart.series[index]);
                        
                    //    //console.log((this.chart.series[index].data).length);
                    //    //var size = (this.chart.series[index].data).reduce((sum, a) => sum + 1, 0);
                    //    //console.log(size);

                    //    var element_count = 0;
                    //    var myArray = [];
                    //    myArray = this.chart.series[index].data;
                    //    console.log(myArray);
                    //    myArray.forEach(function (item) {
                    //        console.log(item);
                    //    });

                    //    //myArray.forEach(function (point, i) {
                            
                    //    //    console.log(i + 1);
                    //    //})

                    //    //console.log(myArray.length);
                    //    soluong = soluong + this.chart.series[index].yData[i].y;
                    //    //soluong = soluong + this.chart.series[index].data[i].ry;
                    //}
                    soluong = arrBienDongCoPhieu[index];
                    return '<div style="width:10vh;"><span style="float: left">' + this.name + '</span> <span style="float: right">' + soluong + '</span></div>';
                }
            },
            tooltip: {
                //headerFormat: '<span style="font-size:11px">{point.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{series.name}</span>: <b>{point.ry}</b><br/>'
            },
            xAxis: {
                tickInterval: 1,
                labels: {
                    align: 'right',
                    allowOverlap: true,
                    step: 1,
                    y: 3,
                    style: {
                        fontSize: '13px'
                    }
                },
                lineWidth: 0,
                gridLineWidth: 0,
                categories: categories
            },
            yAxis: {
                lineWidth: 0,
                tickInterval: 25,
                reversedStacks: false,
                endOnTick: true,
                showLastLabel: true,
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderWidth: 0,
                    pointPadding: 0,
                    groupPadding: 0.15,
                    borderRadius: '0%'
                }
            },
            series: [{
                name: 'Tăng mạnh',
                data: tangManh
            }, {
                name: 'Tăng nhẹ',
                data: tangNhe
            }, {
                name: 'Không đổi',
                data: khongDoi
            }, {
                name: 'Giảm',
                data: giam
            }, {
                name: 'Giảm mạnh',
                data: giamManh
            }
            ]
        });

        $('#FullScreenCPTheoVonHoaChart').click(function () {
            $scope.FullScreenCPTheoVonHoaChart();
        });
    }

    var arrBienDongCoPhieu = [0, 0, 0, 0, 0];

    $scope.LoadChartCPTheoVonHoa = function () {
        running_ChartCPTheoVonHoa = true;
        var categories = []; //['VN_LargeCap', 'VN_MidCap', 'VN_SmallCap' ];

        var tangManh = [], tangNhe = [], khongDoi = [], giam = [], giamManh = [];

        var input =
        {
            FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, DateRange: $scope.DateRange, IndexId: $scope.IndexId
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_BienDongTheoVonHoa',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                var total_VN_LargeCap = data.VN_LargeCap.IncreaseSharply + data.VN_LargeCap.Increase + data.VN_LargeCap.UnChanged + data.VN_LargeCap.Decrease + data.VN_LargeCap.DecreaseSharply;
                var total_VN_MidCap = data.VN_MidCap.IncreaseSharply + data.VN_MidCap.Increase + data.VN_MidCap.UnChanged + data.VN_MidCap.Decrease + data.VN_MidCap.DecreaseSharply;
                var total_VN_SmallCap = data.VN_SmallCap.IncreaseSharply + data.VN_SmallCap.Increase + data.VN_SmallCap.UnChanged + data.VN_SmallCap.Decrease + data.VN_SmallCap.DecreaseSharply;

                arrBienDongCoPhieu[0] = data.VN_LargeCap.IncreaseSharply + data.VN_MidCap.IncreaseSharply + data.VN_SmallCap.IncreaseSharply;
                arrBienDongCoPhieu[1] = data.VN_LargeCap.Increase + data.VN_MidCap.Increase + data.VN_SmallCap.Increase;
                arrBienDongCoPhieu[2] = data.VN_LargeCap.UnChanged + data.VN_MidCap.UnChanged + data.VN_SmallCap.UnChanged;
                arrBienDongCoPhieu[3] = data.VN_LargeCap.Decrease + data.VN_MidCap.Decrease + data.VN_SmallCap.Decrease;
                arrBienDongCoPhieu[4] = data.VN_LargeCap.DecreaseSharply + data.VN_MidCap.DecreaseSharply + data.VN_SmallCap.DecreaseSharply;

                if (($scope.ExchangeId == 1 || $scope.ExchangeId == 2) && data.VN_LargeCap.IncreaseSharply != null)
                    tangManh.push({ y: data.VN_LargeCap.IncreaseSharply * 100 / total_VN_LargeCap, ry: data.VN_LargeCap.IncreaseSharply });
                if ($scope.ExchangeId == 1 && data.VN_MidCap.IncreaseSharply != null)
                    tangManh.push({ y: data.VN_MidCap.IncreaseSharply * 100 / total_VN_MidCap, ry: data.VN_MidCap.IncreaseSharply });
                if (data.VN_SmallCap.IncreaseSharply != null)
                    tangManh.push({ y: data.VN_SmallCap.IncreaseSharply * 100 / total_VN_SmallCap, ry: data.VN_SmallCap.IncreaseSharply });
                
                if (($scope.ExchangeId == 1 || $scope.ExchangeId == 2) && data.VN_LargeCap.IncreaseSharply != null)
                    tangNhe.push({ y: data.VN_LargeCap.Increase * 100 / total_VN_LargeCap, ry: data.VN_LargeCap.Increase });
                if ($scope.ExchangeId == 1 && data.VN_MidCap.IncreaseSharply != null)
                    tangNhe.push({ y: data.VN_MidCap.Increase * 100 / total_VN_MidCap, ry: data.VN_MidCap.Increase });
                if (data.VN_SmallCap.IncreaseSharply != null)
                    tangNhe.push({ y: data.VN_SmallCap.Increase * 100 / total_VN_SmallCap, ry: data.VN_SmallCap.Increase });

                if (($scope.ExchangeId == 1 || $scope.ExchangeId == 2) && data.VN_LargeCap.IncreaseSharply != null)
                    khongDoi.push({ y: data.VN_LargeCap.UnChanged * 100 / total_VN_LargeCap, ry: data.VN_LargeCap.UnChanged });
                if ($scope.ExchangeId == 1 && data.VN_MidCap.IncreaseSharply != null)
                    khongDoi.push({ y: data.VN_MidCap.UnChanged * 100 / total_VN_MidCap, ry: data.VN_MidCap.UnChanged });
                if (data.VN_SmallCap.IncreaseSharply != null)
                    khongDoi.push({ y: data.VN_SmallCap.UnChanged * 100 / total_VN_SmallCap, ry: data.VN_SmallCap.UnChanged });

                if (($scope.ExchangeId == 1 || $scope.ExchangeId == 2) && data.VN_LargeCap.IncreaseSharply != null)
                    giam.push({ y: data.VN_LargeCap.Decrease * 100 / total_VN_LargeCap, ry: data.VN_LargeCap.Decrease });
                if ($scope.ExchangeId == 1 && data.VN_MidCap.IncreaseSharply != null)
                    giam.push({ y: data.VN_MidCap.Decrease * 100 / total_VN_MidCap, ry: data.VN_MidCap.Decrease });
                if (data.VN_SmallCap.IncreaseSharply != null)
                    giam.push({ y: data.VN_SmallCap.Decrease * 100 / total_VN_SmallCap, ry: data.VN_SmallCap.Decrease });
                
                if (($scope.ExchangeId == 1 || $scope.ExchangeId == 2) && data.VN_LargeCap.IncreaseSharply != null)
                    giamManh.push({ y: data.VN_LargeCap.DecreaseSharply * 100 / total_VN_LargeCap, ry: data.VN_LargeCap.DecreaseSharply });
                if ($scope.ExchangeId == 1 && data.VN_MidCap.IncreaseSharply != null)
                    giamManh.push({ y: data.VN_MidCap.DecreaseSharply * 100 / total_VN_MidCap, ry: data.VN_MidCap.DecreaseSharply });
                if (data.VN_SmallCap.IncreaseSharply != null)
                    giamManh.push({ y: data.VN_SmallCap.DecreaseSharply * 100 / total_VN_SmallCap, ry: data.VN_SmallCap.DecreaseSharply });

                if ($scope.ExchangeId == 1) {
                    if (data.VN_LargeCap.IncreaseSharply != null)
                        categories.push('VN_LargeCap');
                    if (data.VN_MidCap.IncreaseSharply != null)
                        categories.push('VN_MidCap');
                    if (data.VN_SmallCap.IncreaseSharply != null)
                        categories.push('VN_SmallCap');
                }
                else if ($scope.ExchangeId == 2) {
                    if (data.VN_LargeCap.IncreaseSharply != null)
                        categories.push('VN_LargeCap');
                    if (data.VN_SmallCap.IncreaseSharply != null)
                        categories.push('VN_SmallCap');
                }
                else if ($scope.ExchangeId == 3) {
                    if (data.VN_SmallCap.IncreaseSharply != null)
                        categories.push('VN_SmallCap');
                }

                $scope.LoadChartCPTheoVonHoa_Data(categories, tangManh, tangNhe, khongDoi, giam, giamManh);
                running_ChartCPTheoVonHoa = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_ChartCPTheoVonHoa = false;
            }
        });

    };

    var chart_CoPhieuAnhHuong = null;

    $scope.LoadChartCoPhieuAnhHuong_Data = function (name1, categories1, data1, unit1, name2, categories2, data2, unit2) {
        if (chart_CoPhieuAnhHuong != null) {
            chart_CoPhieuAnhHuong.xAxis[0].update({ categories: categories1 });
            chart_CoPhieuAnhHuong.xAxis[1].update({ categories: categories2 });

            chart_CoPhieuAnhHuong.series[0].update(
                {
                    data: data1
                }
            );

            chart_CoPhieuAnhHuong.series[1].update(
                {
                    data: data2
                }
            );

            return;
        }

        chart_CoPhieuAnhHuong = Highcharts.chart('chart_CoPhieuAnhHuong', {
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                useHTML: true,
                text: '<div style="width:100%"><span style="text-align: center;font-size: 1.0em !important;">Top cổ phiếu ảnh hưởng chỉ số</span>' +
                    '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                    '<li id="FullScreenCoPhieuAnhHuong" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                    '<span class="highcharts-menu-item-btn"></span>' +
                    '</li>' +
                    '</ul></span></div>'
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
                categories: categories1,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories2,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        //return (Math.abs(this.value) / 1000000) + 'M';
                        return this.value;
                    }
                },
                //min: -8000000,
                //max: 8000000
            },

            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            //return Math.round(Math.abs(this.y) / 1000) + 'T';
                            return this.y;
                        },
                        inside: false,
                        x: 0
                    }
                },
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    var cat = '';
                    if (this.point.negative)
                        cat = this.point.category;
                    else
                        cat = categories2[this.point.index];
                    return '<b>' + this.series.name + '</b><br/>' +
                        cat + ': ' + Highcharts.numberFormat(this.point.y, 2) + ' ' + unit1;
                }
            },

            series: [{
                name: name1,
                color: '#ff0017',
                data: data1
            }, {
                name: name2,
                color: '#1aa67c',
                data: data2
            }]
        });

        $('#FullScreenCoPhieuAnhHuong').click(function () {
            chart_CoPhieuAnhHuong.fullscreen.toggle();
        });
    };

    $scope.LoadChartCoPhieuAnhHuong = function () {
        running_CoPhieuAnhHuong = true;

        var categories1 = [], categories2 = [], data1 = [], data2 = [], name1 = '', name2 = '', unit1 = '', unit2 = '';

        var input =
        {
            DateRange: $scope.DateRange, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, DateRange: $scope.DateRange, IndexId: $scope.IndexId
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_CoPhieuAnhHuong',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data != null) {
                    categories1 = data.categories1;
                    categories2 = data.categories2;
                    data1 = data.data1;
                    data2 = data.data2;
                    name1 = data.name1;
                    name2 = data.name2;
                    unit1 = data.unit1;
                    unit2 = data.unit2;
                }
                $scope.LoadChartCoPhieuAnhHuong_Data(name1, categories1, data1, unit1, name2, categories2, data2, unit2);
                running_CoPhieuAnhHuong = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_CoPhieuAnhHuong = false;
            }
        });

    };

    var chart_BienDongChiSoTheoNganh = null;

    $scope.LoadBienDongChiSoTheoNganh_Data = function (categoriesData) {
        if (chart_BienDongChiSoTheoNganh != null) {
            chart_BienDongChiSoTheoNganh.series[0].update(
                {
                    data: categoriesData
                }
            );

            return;
        }

        chart_BienDongChiSoTheoNganh = Highcharts.chart('chart_BienDongChiSoTheoNganh', {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                useHTML: true,
                text: '<div style="width:100%"><span style="text-align: center;font-size: 1.0em !important;">Biến động chỉ số theo ngành</span>' +
                    '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                    '<li id="FullScreenBienDongChiSoTheoNganh" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                    '<span class="highcharts-menu-item-btn"></span>' +
                    '</li>' +
                    '</ul></span></div>'
            },
            subtitle: {
                text: ''
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    enabled: false
                },
                //min: 0,
                title: {
                    text: ''
                },
                gridLineColor: 'transparent'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
                    '<b>{point.y:.2f}%</b>'
            },

            series: [
                {
                    name: '',
                    colorByPoint: true,
                    data: categoriesData
                }
            ]
        });

        $('#FullScreenBienDongChiSoTheoNganh').click(function () {
            chart_BienDongChiSoTheoNganh.fullscreen.toggle();
        });
    }

    $scope.LoadBienDongChiSoTheoNganh = function () {
        running_BienDongChiSoTheoNganh = true;
        var categoriesData = [];

        var input =
        {
            FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, DateRange: $scope.DateRange, IndexId: $scope.IndexId
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_BienDongChiSoNganh',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        categoriesData.push({
                            name: data[i].Code,
                            y: data[i].PercentChange,
                            color: mamau = $scope.GetColor(data[i].PercentChange)
                        });
                    }
                }

                $scope.LoadBienDongChiSoTheoNganh_Data(categoriesData);
                running_BienDongChiSoTheoNganh = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_BienDongChiSoTheoNganh = false;
            }
        });
    };

    $scope.LoadChartGDKhoiNgoaiTuDoanh = function () {
        Highcharts.chart('chart_GDKhoiNgoaiTuDoanh', {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Hoạt động Khối ngoại, Tự doanh'
            },
            xAxis: {
                categories: ['05/05', '07/05', '09/05', '13/05', '15/05'],
                crosshair: true
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: "normal",
                }
            },
            series: [{
                name: 'Giá trị mua',
                color: '#1aa67c',
                data: [5, 3, 4, 7, 2]
            },{
                name: 'Giá trị bán',
                color: '#ff0017',
                data: [-2, -2, -3, -2, -1]
              }, {
                name: 'Giá trị mua ròng',
                type: 'spline',
                color: '#CCCC00',
                data: [-1.6, -2.9, -1.8, -0.7, 3.1],
                tooltip: {
                    valueSuffix: ''
                }
              }
            ]
        });
    };

    var chart_GDKhoiNgoai = null;

    $scope.LoadChartGDKhoiNgoai_Data = function (categories, data) {
        if (chart_GDKhoiNgoai != null) {
            //chart_GDKhoiNgoai.xAxis[0].update({ categories: categories });

            chart_GDKhoiNgoai.series[0].update(
                {
                    data: data
                }
            );

            return;
        }

        chart_GDKhoiNgoai = Highcharts.chart('chart_GDKhoiNgoai', {
            chart: {
                //type: 'areaspline'
                type: 'column'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                useHTML: true,
                text: '<div style="width:100%"><span style="text-align: center;font-size: 1.0em !important;">Hoạt động khối ngoại</span>' +
                    '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                    '<li id="FullScreenGDKhoiNgoai" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                    '<span class="highcharts-menu-item-btn"></span>' +
                    '</li>' +
                    '</ul></span></div>'
            },
            xAxis: {
                type: 'category',
                //categories: categories,
                //crosshair: true
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: "normal",
                },
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                name: 'GTGD ròng',
                color: '#1aa67c',
                negativeColor: '#ff0017',
                fillOpacity: 0.5,
                data: data,
                tooltip: {
                    valueSuffix: ' tỷ'
                }
            }
            ]
        });

        $('#FullScreenGDKhoiNgoai').click(function () {
            chart_GDKhoiNgoai.fullscreen.toggle();
        });
    };

    $scope.LoadChartGDKhoiNgoai = function () {
        running_GDKhoiNgoai = true;

        var categories = [];

        var input =
        {
            FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, DateRange: $scope.DateRange, IndexId: $scope.IndexId
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_HoatDongKhoiNgoai',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                $scope.LoadChartGDKhoiNgoai_Data(categories, data);
                running_GDKhoiNgoai = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_GDKhoiNgoai = false;
            }
        });
    };

    var renderChart = null;

    $scope.LoadChartBanDo_Data = function () {
        renderChart = data => {
            Highmap.chart('chart_BanDo', {
                chart: {
                    //backgroundColor: '#252931'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'All',
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    animationLimit: 1000,
                    borderColor: '#252931',
                    color: '#333',
                    opacity: 0.01,
                    nodeSizeBy: 'leaf',
                    dataLabels: {
                        enabled: false,
                        allowOverlap: true,
                        style: {
                            fontSize: '0.9em',
                            textOutline: 'none'
                        }
                    },
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true,
                            headers: true,
                            align: 'left',
                            color: '#333',
                            borderColor: '#e6e6e6',
                            style: {
                                fontWeight: 'bold',
                                fontSize: '0.7em',
                                lineClamp: 1,
                                textTransform: 'uppercase'
                            },
                            padding: 1
                        },
                        borderWidth: 1,
                        borderColor: '#ddd',
                        levelIsConstant: false
                    }, {
                        level: 2,
                        dataLabels: {
                            enabled: true,
                            headers: true,
                            align: 'center',
                            shape: 'callout',
                            backgroundColor: 'gray',
                            borderWidth: 1,
                            borderColor: '#e6e6e6',
                            padding: 1,
                            style: {
                                color: 'white',
                                fontWeight: 'normal',
                                fontSize: '0.6em',
                                lineClamp: 1,
                                textOutline: 'none',
                                textTransform: 'uppercase'
                            }
                        },
                        groupPadding: 1

                        // The companies
                    }, {
                        level: 3,
                        dataLabels: {
                            enabled: true,
                            align: 'center',
                            format: '{point.name}<br><span style="font-size: 0.7em">' +
                                '{point.custom.performance}</span>',
                            style: {
                                color: 'white'
                            }
                        }
                    }],
                    accessibility: {
                        exposeAsGroupOnly: true
                    },
                    breadcrumbs: {
                        buttonTheme: {
                            style: {
                                color: '#333'
                            },
                            states: {
                                hover: {
                                    fill: 'silver'
                                },
                                select: {
                                    style: {
                                        color: '#333'
                                    }
                                }
                            }
                        }
                    },
                    data
                }],
                title: {
                    text: '',
                    align: 'left',
                    style: {
                        color: 'white'
                    }
                },
                subtitle: {
                    useHTML: true,
                    text: '<span style="font-size: 14px;font-weight: 600;">Bản đồ thị trường<br></span>',
                    align: 'left',
                    style: {
                        color: '#333'
                    }
                },
                tooltip: {
                    followPointer: true,
                    outside: true,
                    headerFormat: '<span style="font-size: 0.9em">' +
                        '{point.custom.fullName}</span><br/>',
                    pointFormat: '<b>' + $scope.Tab.Type === 'MarketCap' ? 'Market Cap' : 'GTGD' + ':</b>' +
                        ' {(divide point.value 1000000000):.2f} tỷ<br/>' +
                        '{#if point.custom.performance}' +
                        '<b>Thay đổi:</b> {point.custom.performance}{/if}'
                },
                //colorAxis: {
                //    minColor: '#f73539',
                //    maxColor: '#2ecc59',
                //    stops: [
                //        [0, '#f73539'],
                //        [0.5, '#414555'],
                //        [1, '#2ecc59']
                //    ],
                //    min: -10,
                //    max: 10,
                //    gridLineWidth: 0,
                //    labels: {
                //        overflow: 'allow',
                //        format: '{#gt value 0}+{value}{else}{value}{/gt}%',
                //        style: {
                //            color: 'white'
                //        }
                //    }
                //},
                legend: {
                    itemStyle: {
                        color: 'white'
                    }
                },
                exporting: {
                    sourceWidth: 1200,
                    sourceHeight: 800,
                    buttons: {
                        fullscreen: {
                            text: '<i class="fa fa-arrows-alt"></i> Fullscreen',
                            onclick: function () {
                                this.fullscreen.toggle();
                            }
                        },
                        contextButton: {
                            menuItems: [
                                'downloadPNG',
                                'downloadJPEG',
                                'downloadPDF',
                                'downloadSVG'
                            ],
                            text: '<i class="fa fa-share-alt"></i> Export',
                            symbol: void 0,
                            y: -2
                        }
                    }
                },
                navigation: {
                    buttonOptions: {
                        theme: {
                            fill: '#e6e6e6',
                            style: {
                                color: 'silver',
                                whiteSpace: 'nowrap'
                            },
                            states: {
                                hover: {
                                    fill: '#333',
                                    style: {
                                        color: 'white'
                                    }
                                }
                            }
                        },
                        symbolStroke: 'silver',
                        useHTML: true,
                        y: -2
                    }
                }
            });
        };

        (async () => {

            // Plugin for relative font size
            Highmap.addEvent(Highmap.Series, 'drawDataLabels', function () {
                if (this.type === 'treemap') {
                    this.points.forEach(point => {

                        //// Color the level 2 headers with the combined performance of
                        //// its children
                        //if (point.node.level === 2 && Number.isFinite(point.value)) {
                        //    const previousValue = point.node.children
                        //        .reduce(
                        //            (acc, child) => acc + (child.point.value || 0) -
                        //                (child.point.value || 0) *
                        //                (child.point.colorValue || 0) / 100,
                        //            0
                        //        );

                        //    // Percentage change from previous value to point.value
                        //    const perf = 100 * (point.value - previousValue) /
                        //        (previousValue || 1);

                        //    point.custom = {
                        //        performance: (perf < 0 ? '' : '+') +
                        //            perf.toFixed(2) + '%'
                        //    };

                        //    if (point.dlOptions) {
                        //        point.dlOptions.backgroundColor = this.colorAxis
                        //            .toColor(perf);
                        //    }
                        //}

                        // Set font size based on area of the point
                        if (point.node.level === 3 && point.shapeArgs) {
                            const area = point.shapeArgs.width * point.shapeArgs.height;
                            point.dlOptions.style.fontSize =
                                `${Math.min(32, 7 + Math.round(area * 0.0008))}px`;
                        }
                    });
                }
            });

        })();
    };

    $scope.dataChartBanDo = [];

    $scope.LoadChartBanDo = function () {
        running_BanDo = true;
        var dataChart = [];
        var input =
        {
            INTERVAL: $scope.Interval, DateRange: $scope.DateRange, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, IndexId: $scope.IndexId, ValueType: $scope.Tab.Type
        };
        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_BanDo',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (!angular.equals($scope.dataChartBanDo, data))
                {
                    $scope.dataChartBanDo = data;
                    for (var i = 0; data != null && i < data.length; i++) {
                        let perf = null;
                        perf = 100 * (i + 1);
                        dataChart.push({
                            id: data[i].IndustryCode,
                            name: data[i].Name,
                            //color: Highcharts.getOptions().colors[i],
                            //value: perf,
                            //colorValue: perf,
                            custom: {
                                fullName: data[i].Name,
                                //performance: (perf < 0 ? '' : '+') + perf.toFixed(2) + '%'
                            }
                        });

                        for (var j = 0; data[i].Level2 != null && j < data[i].Level2.length; j++) {
                            perf = null;
                            perf = 100 * (j + 1);

                            //if (data[i].Level2.Stock != null) {
                            dataChart.push({
                                parent: data[i].IndustryCode,
                                id: data[i].Level2[j].IndustryCode,
                                name: data[i].Level2[j].Name,
                                value: data[i].Level2[j].MarketCap,
                                colorValue: perf,
                                //color: Highcharts.getOptions().colors[j],
                                custom: {
                                    fullName: data[i].Level2[j].Name,
                                    performance: (perf < 0 ? '' : '+') + perf.toFixed(2) + '%'
                                }
                            });
                            //}

                            for (var k = 0; data[i].Level2[j].Stock != null && k < data[i].Level2[j].Stock.length; k++) {
                                perf = data[i].Level2[j].Stock[k].PercentChange;

                                //if (data[i].Level2[j].Stock != null) {
                                dataChart.push({
                                    parent: data[i].Level2[j].IndustryCode,
                                    //id: data[i].Level2[j].IndustryCode,
                                    name: data[i].Level2[j].Stock[k].Code,
                                    value: data[i].Level2[j].Stock[k].MarketCap,
                                    colorValue: perf,
                                    color: $scope.GetColor(perf),
                                    custom: {
                                        fullName: data[i].Level2[j].Stock[k].Code,
                                        performance: (perf < 0 ? '' : '+') + perf.toFixed(2) + '%'
                                    }
                                });
                                //}
                            }

                            for (var l = 0; data[i].Level2[j].Level3 != null && l < data[i].Level2[j].Level3.length; l++) {
                                //perf = data[i].Level2[j].Stock[k].PercentChange;

                                //if (data[i].Level2[j].Stock != null) {
                                dataChart.push({
                                    parent: data[i].Level2[j].IndustryCode,
                                    //id: data[i].Level2[j].IndustryCode,
                                    name: data[i].Level2[j].Level3[l].Name,
                                    value: data[i].Level2[j].Level3[l].MarketCap,
                                    //colorValue: perf,
                                    custom: {
                                        fullName: data[i].Level2[j].Level3[l].Name,
                                        //performance: (perf < 0 ? '' : '+') + perf.toFixed(2) + '%'
                                    }
                                });
                                //}
                            }
                        }

                    }

                    //console.log(dataChart);

                    renderChart(dataChart);
                }

                running_BanDo = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_BanDo = false;
            }
        });
    };

    //var Highchart_multi = $('#chart_BienDongThanhKhoan').highcharts();

    //chartOptions = {
    //    chart: {
    //        renderTo: 'chart_BienDongThanhKhoan'
    //    }
    //};

    //var Highchart_multi = new Highcharts.Chart(chartOptions);

    var charBienDongThanhKhoan = null;
    var charBienDongCungCau = null;

    $scope.LoadBienDongThanhKhoan_Data = function (activity) {
        
        if (charBienDongThanhKhoan != null) {
            if (activity == null) {
                for (k = 0; k < Highcharts.charts.length; k = k + 1) {
                    chart = Highcharts.charts[k];
                    if (chart != undefined) {
                        if (chart.options.chart.isSynchronized) {
                            chart.xAxis[0].update({ categories: [] });

                            chart.series[0].update(
                                {
                                    data: []
                                }
                            );

                            chart.series[1].update(
                                {
                                    data: []
                                }
                            );
                        }
                    }
                }
                return;
            }

            //activity.datasets.forEach(function (dataset, i) {
            //    // Add X values

            //    dataset.data1 = dataset.data1.map((val, j) => [activity.xData[j], val]);
            //    dataset.data2 = dataset.data2.map((val, j) => [activity.xData[j], val]);

            //    for (k = 0; k < Highcharts.charts.length; k = k + 1) {
            //        chart = Highcharts.charts[k];
            //        if (chart != undefined) {
            //            if (chart.options.chart.isSynchronized && chart.options.chart.id == 'id' + i) {
            //                chart.xAxis[0].update({ categories: activity.xData });

            //                chart.series[0].update(
            //                    {
            //                        data: dataset.data1,
            //                        name: dataset.name1,
            //                    }
            //                );

            //                chart.series[1].update(
            //                    {
            //                        data: dataset.data2,
            //                        name: dataset.name2,
            //                    }
            //                );
            //                break;
            //            }
            //        }
            //    }
                
            //});

            return;
        }

        $('#chart_BienDongThanhKhoan').bind('mouseleave', function (e) {
            var chart,
                point,
                i,
                event;
            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                if (chart != undefined) {

                    //console.log(chart.renderTo.className);
                    if (chart.options.chart.isSynchronized) {

                        event = chart.pointer.normalize(e.originalEvent);
                        point = chart.series[0].searchPoint(event, true);

                        if (point != undefined) {
                            point.onMouseOut();
                            chart.tooltip.hide(point);
                            chart.xAxis[0].hideCrosshair();
                        }
                    }
                }
            }
        });

        $('#chart_BienDongThanhKhoan').bind('mousemove touchmove touchstart', function (e) {
            var chart,
                point,
                i,
                event;
            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                if (chart != undefined) {
                    //console.log(chart.options.chart.isSynchronized);
                    //console.log(chart.renderTo.className);
                    //chart.renderTo.className == 'chart chartMulti'
                    if (chart.options.chart.isSynchronized) {
                        //console.log(chart);
                        event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                        //console.log(chart.series.length);
                        //for (var i = 0; i < chart.series.length; i = i + 1)
                        {
                            point = chart.series[0].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.onMouseOver(); // Show the hover marker
                                //chart.tooltip.refresh(point); // Show the tooltip
                                chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
                            }

                            point = chart.series[1].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.onMouseOver(); // Show the hover marker
                                //chart.tooltip.refresh(point); // Show the tooltip
                                chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
                            }

                            point = chart.series[2].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.onMouseOver(); // Show the hover marker
                                //chart.tooltip.refresh(point); // Show the tooltip
                                chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
                            }

                            point = chart.series[3].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.onMouseOver(); // Show the hover marker
                                //chart.tooltip.refresh(point); // Show the tooltip
                                chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
                            }
                        }

                    }
                }
            }
        });

        /**
         * Override the reset function, we don't need to hide the tooltips and
         * crosshairs.
         */

        Highcharts.wrap(Highcharts.Pointer.prototype, 'reset', function (proceed, allowMove, delay) {
            if (!this.chart.options.chart.isSynchronized) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        });

        //Highcharts.Pointer.prototype.reset = function () {

        //    var chart = this.chart;
        //    if (chart != undefined) {
        //        if (chart.renderTo.className == 'chart chartMulti') {
        //            //console.log('hi');
        //            //console.log(this.chart);
        //            return undefined;
        //        }
        //    }
        //};

        /**
         * Highlight a point by showing tooltip, setting hover state and draw crosshair
         */
        Highcharts.Point.prototype.highlight = function (event) {
            event = this.series.chart.pointer.normalize(event);
            this.onMouseOver(); // Show the hover marker
            this.series.chart.tooltip.refresh(this); // Show the tooltip
            this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };

        /**
         * Synchronize extremes (zooming) through the setExtremes event handler.
         */
        function syncExtremes(e) {
            const thisChart = this.chart;

            if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
                Highchart_multi.charts.forEach(chart => {
                    if (chart !== thisChart) {
                        if (chart.xAxis[0].setExtremes) { // It is null while updating
                            chart.xAxis[0].setExtremes(
                                e.min,
                                e.max,
                                undefined,
                                false,
                                { trigger: 'syncExtremes' }
                            );
                        }
                    }
                });
            }
        }

        /**
         * Resets chart zoom on selection event.
         */
        function resetZoom(e) {
            // Prevent feedback loop
            if (e.resetSelection) {
                return;
            }

            // Zoom out all other charts on selection
            Highchart_multi.charts.forEach(chart => {
                if (chart !== e.target) {
                    chart.zoomOut();
                }
            });
        }

        (async () => {
            // Get the data
            //const activity = await fetch(
            //    '/Stock/Chart_BienDongThanhKhoanAsync'
            //).then(res => res.json());


            // Loop the data sets and create one chart each
            if (activity == null) {
                
                return;
            }

            var tickInterval = 0, tickInterval_temp = 0, ymax = undefined, pointStart = undefined;
            
            activity.datasets.forEach(function (dataset, i) {
                // Add X values
                if (i == 0) {
                    tickInterval = undefined;
                    if (dataset.data1.length > 0)
                        tickInterval_temp = Math.round(dataset.data1[dataset.data1.length - 1] / 4 / 1000)*1000;
                } else {
                    tickInterval = tickInterval_temp;
                    ymax = charBienDongCungCau.yAxis[0].getExtremes().dataMax;
                    //ymax = charBienDongCungCau.yAxis[0].max;
                }

                var data1 = [], data2 = [], data3 = [], data4 = [];
                for (var k = 0; k < activity.xData.length; k++) {
                    var currTimeStamp = new Date(activity.xData[k]);
                    //if (currTimeStamp.getHours() == 14 && currTimeStamp.getMinutes() == 31) {
                    //    data3.push([activity.xData[k - 1], dataset.data1[k - 1]]);
                    //    data4.push([activity.xData[k - 1], dataset.data2[k - 1]]);

                    //    var _index = activity.xData.length - 1;
                    //    data3.push([activity.xData[_index], dataset.data1[_index]]);
                    //    data4.push([activity.xData[_index], dataset.data2[_index]]);
                    //    pointStart = k-1;
                    //    break;
                    //}
                    //else
                    {
                        data1.push([activity.xData[k], dataset.data1[k]]);
                        data2.push([activity.xData[k], dataset.data2[k]]);
                    }
                    
                }

                //dataset.data1 = dataset.data1.map((val, j) => [activity.xData[j], val]);
                //dataset.data2 = dataset.data2.map((val, j) => [activity.xData[j], val]);

                var color1, color2;
                var title = '<div style="width:100%"><span style="text-align: center;font-size: 1.0em !important;">' + dataset.name + '</span>';
                if (i == 0) {
                    title = title +
                        '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                        '<li id="BienDongThanhKhoan" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                        '<span class="highcharts-menu-item-btn"></span>' +
                        '</li>' +
                        '</ul></span>';
                    
                    color2 = '#009900';
                    color1 = '#CCCC00';
                } else {
                    title = title +
                        '<span style="text-align: right;position: absolute;"><ul class="highcharts-stocktools-toolbar stocktools-toolbar" style="width: auto;">' +
                        '<li id="BienDongCungCau" class="highcharts-full-screen right" title="Fullscreen" style="height: 20px;">' +
                        '<span class="highcharts-menu-item-btn"></span>' +
                        '</li>' +
                        '</ul></span>';
                    color1 = '#009900';
                    color2 = '#CB4335';
                }

                title = title + '</div>';

                const chartDiv = document.createElement('div');
                chartDiv.className = 'chart chartMulti';
                document.getElementById('chart_BienDongThanhKhoan').appendChild(chartDiv);

                charBienDongCungCau = Highcharts.chart(chartDiv, {
                    chart: {
                        isSynchronized: true,
                        marginLeft: 40, // Keep all charts left aligned
                        spacingTop: 15,
                        spacingBottom: 0,
                        height: '220px',
                        zooming: {
                            type: 'x'
                        },
                        id: 'id' + i
                        //events: {
                        //    selection: resetZoom
                        //}
                    },
                    title: {
                        text: dataset.name,
                        align: 'left',
                        margin: 0,
                        x: 30,
                        useHTML: true,
                        text: title
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true
                    },
                    xAxis: {
                        //ordinal: true,
                        type: 'datetime',
                        categories: activity.xData,
                        //dateTimeLabelFormats: {
                        //    hour: '%I %p',
                        //    minute: '%I:%M %p'
                        //},
                        // crosshair: true,
                        //events: {
                        //    setExtremes: syncExtremes
                        //},
                        labels: {
                            //format: '{value}'
                            //format: '{value:%H:%M}'
                            padding: 10,
                            formatter: function () {
                                //console.log(this.value);
                                if ($scope.DateRange == '1D') {
                                    var currTimeStamp = new Date(this.value);
                                    return format_two_digits(currTimeStamp.getHours()) + ':' + format_two_digits(currTimeStamp.getMinutes());
                                }
                                else
                                    return this.value;
                                //return Highcharts.dateFormat('%H:%M', this.value);
                            }
                        },
                        //accessibility: {
                        //    description: 'Kilometers',
                        //    rangeDescription: '0km to 6.5km'
                        //}
                    },
                    yAxis: {
                        tickInterval: tickInterval,
                        max: ymax,
                        title: {
                            text: null
                        }
                    },
                    tooltip: {
                        //fixed: true,
                        shared: true,
                        useHTML: true,
                        //headerFormat: '<b>{point.x:%H%M}</b><br>',
                        //headerFormat: '{point.key}<br>',
                        headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
                        pointFormat: '<tr><td style="color: {series.color}">{series.name}:&nbsp ' +
                            '</td>' +
                            '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        //position: {
                        //    align: 'right',
                        //    relativeTo: 'spacingBox',
                        //    y: -2
                        //},
                        //padding: 0,
                        ////pointFormat: '{activity.xData[point.x]}: {point.y}',

                        //pointFormatter: function () {
                        //    var point = this,
                        //        series = point.series;

                        //    return `${series.name}: ${point.y}<br/>`
                        //},
                        //backgroundColor: 'none',
                        //headerFormat: '',
                        //shadow: false,
                        //style: {
                        //    fontSize: '18px'
                        //},
                        //valueDecimals: dataset.valueDecimals
                    },
                    series: [{
                        data: data1,
                        name: dataset.name1,
                        type: dataset.type1,
                        color: color1,
                        fillOpacity: 0.5,
                        zIndex: 1,
                        id: 'tktruoc1',
                        tooltip: {
                            valueSuffix: ' ' + dataset.unit1
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        }
                    },
                    {
                        data: data2,
                        name: dataset.name2,
                        type: dataset.type2,
                        color: color2,
                        fillOpacity: 0.5,
                        zIndex: 2,
                        id: 'tksau1',
                        tooltip: {
                            valueSuffix: ' ' + dataset.unit2
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        }
                    }
                    //,{
                    //    data: data3,
                    //    name: dataset.name1,
                    //    type: dataset.type1,
                    //    pointStart: pointStart,
                    //    color: color1,
                    //    fillOpacity: 0.5,
                    //    zIndex: 3,
                    //    linkedTo: 'tktruoc1',
                    //    tooltip: {
                    //        valueSuffix: ' ' + dataset.unit1
                    //    },
                    //    lineWidth: 1,
                    //    marker: {
                    //        enabled: false
                    //    }
                    //},
                    //{
                    //    data: data4,
                    //    name: dataset.name2,
                    //    type: dataset.type2,
                    //    pointStart: pointStart,
                    //    color: color2,
                    //    fillOpacity: 0.5,
                    //    zIndex: 4,
                    //    linkedTo: 'tksau1',
                    //    tooltip: {
                    //        valueSuffix: ' ' + dataset.unit2
                    //    },
                    //    lineWidth: 1,
                    //    marker: {
                    //        enabled: false
                    //    }
                    //}
                    ]
                });

                if (i == 0) {
                    charBienDongThanhKhoan = charBienDongCungCau;
                } 
            });
        })();

        $('#BienDongThanhKhoan').click(function () {
            charBienDongThanhKhoan.fullscreen.toggle();
        });

        $('#BienDongCungCau').click(function () {
            charBienDongCungCau.fullscreen.toggle();
        });
    }

    //$scope.FullScreenBienDongThanhKhoan = function () {
    //    charBienDongThanhKhoan.fullscreen.toggle();
    //};

    $scope.LoadBienDongThanhKhoan = function () {
        running_BienDongThanhKhoan = true;
        var activity = null;

        var input =
        {
            INTERVAL: $scope.Interval, DateRange: $scope.DateRange, FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, IndexId: $scope.IndexId
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_BienDongThanhKhoan',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                activity = data;
                $scope.LoadBienDongThanhKhoan_Data(activity);
                running_BienDongThanhKhoan = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_BienDongThanhKhoan = false;
            }
        });
    };

    var chart_BanDo_CoPhieuAnhHuong = null;

    $scope.LoadChart_BanDo_CoPhieuAnhHuong_Data = function (data) {
        var dataChart = [];
        
        for (var i = data.categories2.length - 1; i >= 0; i--) {
            dataChart.push({ "name": data.categories2[i], "y": data.data2[i] });
        }

        for (var i = 0; i < data.categories1.length; i++) {
            dataChart.push({ "name": data.categories1[i], "y": data.data1[i] });
        }

        if (chart_BanDo_CoPhieuAnhHuong != null) {
            //chart_GDKhoiNgoai.xAxis[0].update({ categories: categories });
            

            chart_BanDo_CoPhieuAnhHuong.series[0].update(
                {
                    data: dataChart
                }
            );

            return;
        }

        chart_BanDo_CoPhieuAnhHuong = Highcharts.chart('chart_BanDo_CoPhieuAnhHuong', {
            chart: {
                //type: 'areaspline'
                type: 'column'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                useHTML: true,
                text: ''
            },
            xAxis: {
                type: 'category',
                //categories: categories,
                //crosshair: true
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                formatter: function () {
                    //var cat = '';
                    
                    //cat = categories[this.point.index];
                    return this.point.name + ': ' + Highcharts.numberFormat(this.point.y, 2);
                }
            },
            plotOptions: {
                //column: {
                //    stacking: "normal",
                //},
                series: {
                    //marker: {
                    //    enabled: false
                    //},
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}'
                    }
                }
            },
            series: [{
                name: '',
                color: '#1aa67c',
                negativeColor: '#ff0017',
                fillOpacity: 0.5,
                data: dataChart,
                tooltip: {
                    valueSuffix: ''
                }
            }
            ]
        });

    };

    $scope.dataBanDo_CoPhieuAnhHuong = {};

    $scope.LoadChart_BanDo_CoPhieuAnhHuong = function () {
        running_BanDo_CoPhieuAnhHuong = true;

        //var categories = [];

        var input =
        {
            FromTradingDate: $scope.FromTradingDateActive, ToTradingDate: $scope.ToTradingDateActive
            , ExchangeId: $scope.ExchangeId, DateRange: $scope.DateRange /*, IndexId: $scope.IndexId*/
            , NumberCode: 10, ValueType: $scope.Tab.Type
        };

        $.ajax({
            type: 'POST',
            url: '/Stock/Chart_CoPhieuAnhHuong',
            async: true,
            dataType: 'json',
            data: {
                data: JSON.stringify(input)
            },
            success: function (data) {
                if (!angular.equals($scope.dataBanDo_CoPhieuAnhHuong, data)) {
                    $scope.dataBanDo_CoPhieuAnhHuong = data;
                    $scope.LoadChart_BanDo_CoPhieuAnhHuong_Data(data);
                }
                    
                running_BanDo_CoPhieuAnhHuong = false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                running_BanDo_CoPhieuAnhHuong = false;
            }
        });
    };

    var running_StockTradingIndex = false;

    $scope.RealTimeStockTradingIndex = function () {
        if (!running_StockTradingIndex)
            $scope.GetStockTradingIndex($scope.ExchangeId);
    };

    $scope.RealTimeChart_GetDates = function () {
        if (!running_Chart_GetDates)
            $scope.Chart_GetDates($scope.Interval, $scope.DateRange);
    };

    $scope.RealTimeBienDongChart = function () {
        //if (!running_BienDongChart)
            $scope.LoadBienDongChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    };

    $scope.RealTimeActivityByIndustryChart = function () {
        if (!running_ActivityByIndustryChart)
            $scope.LoadActivityByIndustryChart($scope.IndustryCodeActive, true);
    };

    $scope.RealTimeNumberOfSharesChart = function () {
        if (!running_NumberOfSharesChart)
            $scope.LoadNumberOfSharesChart($scope.IndustryCodeActive, true);
    };

    $scope.RealTimeBubbleChart = function () {
        if (!running_BubbleChart)
            $scope.LoadBubbleChart($scope.IndustryCodeActive, $scope.ColorIndexActive, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    };

    $scope.RealTimeChartCPTheoVonHoa = function () {
        if (!running_ChartCPTheoVonHoa)
            $scope.LoadChartCPTheoVonHoa();
    };

    $scope.RealTimeBienDongThanhKhoan = function () {
        if (!running_BienDongThanhKhoan)
            $scope.LoadBienDongThanhKhoan();
    };

    $scope.RealTimeBienDongChiSoTheoNganh = function () {
        if (!running_BienDongChiSoTheoNganh)
            $scope.LoadBienDongChiSoTheoNganh();
    };

    $scope.RealTimeCoPhieuAnhHuong = function () {
        if (!running_CoPhieuAnhHuong)
            $scope.LoadChartCoPhieuAnhHuong();
    };

    $scope.RealTimeGDKhoiNgoai = function () {
        if (!running_GDKhoiNgoai)
            $scope.LoadChartGDKhoiNgoai();
    };

    $scope.RealTimeChartBanDo = function () {
        if (!running_BanDo)
            $scope.LoadChartBanDo();
    };

    $scope.RealTimeBanDo_CoPhieuAnhHuong = function () {
        if (!running_BanDo_CoPhieuAnhHuong)
            $scope.LoadChart_BanDo_CoPhieuAnhHuong();
    };

    $scope.RealTime_XuHuong_RelativeRotationGraph = function () {
        if (!running_XuHuong_RRG)
            $scope.Chart_RelativeRotationGraph();
    };

    $scope.RealTime_XuHuong_TangTruong = function () {
        if (!running_XuHuong_TangTruong)
            $scope.Load_Chart_XuHuong_TangTruong();
    };

    var interval_Chart_GetDates = null, interval_ActivityByIndustryChart = null, interval_NumberOfSharesChart = null, interval_BubbleChart = null;
    var running_Chart_GetDates = false, running_ActivityByIndustryChart = false, running_NumberOfSharesChart = false, running_BubbleChart = false;
    $scope.ProcessTabCungCau = function () {
        $scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);

        interval_Chart_GetDates = setInterval($scope.RealTimeChart_GetDates, 1000 * 30);
        interval_ActivityByIndustryChart = setInterval($scope.RealTimeActivityByIndustryChart, 1000 * 30);
        interval_NumberOfSharesChart = setInterval($scope.RealTimeNumberOfSharesChart, 1000 * 30);
        interval_BubbleChart = setInterval($scope.RealTimeBubbleChart, 1000 * 30);

        clearInterval(interval_ChartCPTheoVonHoa);
        clearInterval(interval_BienDongThanhKhoan);
        clearInterval(interval_BienDongChiSoTheoNganh);
        clearInterval(interval_CoPhieuAnhHuong);
        clearInterval(interval_GDKhoiNgoai);
        clearInterval(interval_BanDo);
        clearInterval(interval_BanDo_CoPhieuAnhHuong);
        clearInterval(interval_XuHuong_RRG);
        clearInterval(interval_XuHuong_TangTruong);
    };

    var interval_ChartCPTheoVonHoa = null, interval_BienDongThanhKhoan = null, interval_BienDongChiSoTheoNganh = null, interval_CoPhieuAnhHuong = null, interval_GDKhoiNgoai = null, interval_BanDo = null, interval_BanDo_CoPhieuAnhHuong = null
        , interval_XuHuong_RRG = null, interval_XuHuong_TangTruong = null;
    var running_ChartCPTheoVonHoa = false, running_BienDongThanhKhoan = false, running_BienDongChiSoTheoNganh = false, running_CoPhieuAnhHuong = false, running_GDKhoiNgoai = false, running_BanDo = false, running_BanDo_CoPhieuAnhHuong = false
        , running_XuHuong_RRG = false, running_XuHuong_TangTruong = false;

    $scope.ProcessTabTongQuan = function () {
        $scope.LoadChartCPTheoVonHoa();
        $scope.LoadChartCoPhieuAnhHuong();
        $scope.LoadBienDongChiSoTheoNganh();
        //$scope.LoadChartGDKhoiNgoaiTuDoanh();
        $scope.LoadChartGDKhoiNgoai();
        $scope.LoadBienDongThanhKhoan();

        //interval_ChartCPTheoVonHoa = setInterval($scope.RealTimeChartCPTheoVonHoa, 1000 * 30);
        interval_BienDongThanhKhoan = setInterval($scope.RealTimeBienDongThanhKhoan, 1000 * 30);
        interval_BienDongChiSoTheoNganh = setInterval($scope.RealTimeBienDongChiSoTheoNganh, 1000 * 30);
        interval_CoPhieuAnhHuong = setInterval($scope.RealTimeCoPhieuAnhHuong, 1000 * 30);
        interval_GDKhoiNgoai = setInterval($scope.RealTimeGDKhoiNgoai, 1000 * 30);

        clearInterval(interval_Chart_GetDates);
        clearInterval(interval_ActivityByIndustryChart);
        clearInterval(interval_NumberOfSharesChart);
        clearInterval(interval_BubbleChart);
        clearInterval(interval_BanDo);
        clearInterval(interval_BanDo_CoPhieuAnhHuong);
        clearInterval(interval_XuHuong_RRG);
        clearInterval(interval_XuHuong_TangTruong);
    };

    $scope.ProcessTabBanDo = function () {
        $scope.LoadChartBanDo();
        $scope.LoadChart_BanDo_CoPhieuAnhHuong();

        clearInterval(interval_Chart_GetDates);
        clearInterval(interval_ActivityByIndustryChart);
        clearInterval(interval_NumberOfSharesChart);
        clearInterval(interval_BubbleChart);

        clearInterval(interval_ChartCPTheoVonHoa);
        clearInterval(interval_BienDongThanhKhoan);
        clearInterval(interval_BienDongChiSoTheoNganh);
        clearInterval(interval_CoPhieuAnhHuong);
        clearInterval(interval_GDKhoiNgoai);
        clearInterval(interval_XuHuong_RRG);
        clearInterval(interval_XuHuong_TangTruong);

        interval_BanDo = setInterval($scope.RealTimeChartBanDo, 1000 * 30);
        interval_BanDo_CoPhieuAnhHuong = setInterval($scope.RealTimeBanDo_CoPhieuAnhHuong, 1000 * 30);
    };

    $scope.ProcessTabKhoiNgoai = function () {
        clearInterval(interval_Chart_GetDates);
        clearInterval(interval_ActivityByIndustryChart);
        clearInterval(interval_NumberOfSharesChart);
        clearInterval(interval_BubbleChart);

        clearInterval(interval_ChartCPTheoVonHoa);
        clearInterval(interval_BienDongThanhKhoan);
        clearInterval(interval_BienDongChiSoTheoNganh);
        clearInterval(interval_CoPhieuAnhHuong);
        clearInterval(interval_GDKhoiNgoai);
        clearInterval(interval_BanDo);
        clearInterval(interval_BanDo_CoPhieuAnhHuong);
        clearInterval(interval_XuHuong_RRG);
        clearInterval(interval_XuHuong_TangTruong);
    };

    $scope.ProcessTabXuHuong = function () {
        $scope.Chart_RelativeRotationGraph();
        $scope.Load_Chart_XuHuong_TangTruong();

        clearInterval(interval_Chart_GetDates);
        clearInterval(interval_ActivityByIndustryChart);
        clearInterval(interval_NumberOfSharesChart);
        clearInterval(interval_BubbleChart);

        clearInterval(interval_ChartCPTheoVonHoa);
        clearInterval(interval_BienDongThanhKhoan);
        clearInterval(interval_BienDongChiSoTheoNganh);
        clearInterval(interval_CoPhieuAnhHuong);
        clearInterval(interval_GDKhoiNgoai);
        clearInterval(interval_BanDo);
        clearInterval(interval_BanDo_CoPhieuAnhHuong);

        interval_XuHuong_RRG = setInterval($scope.RealTime_XuHuong_RelativeRotationGraph, 1000 * 30);
        interval_XuHuong_TangTruong = setInterval($scope.RealTime_XuHuong_TangTruong, 1000 * 30);
    };

    $scope.Chart_GetDates(1);
    $scope.Chart_GetTradingIndex($scope.MarketSymbol);
    $scope.LoadIndexChart($scope.MarketSymbol);
    $scope.GetRecommendationsPortfolio(1);
    $scope.GetArticles(1);
    //$scope.LoadBienDongChart(-1, 0, $scope.FromTradingDateActive, $scope.ToTradingDateActive, true);
    //$scope.LoadActivityByIndustryChart(-1, true);
    //$scope.LoadNumberOfSharesChart(-1);
    $scope.LoadChartBulletGraph();
    $scope.LoadChartADX_RSI();
    $scope.LoadChart_RSI();
    $scope.LoadChartForecast();
    $scope.GetStockTrading(1);
    //$scope.LoadChartIndex($scope.MarketSymbol);
    $scope.GetStockTradingIndex($scope.ExchangeId);
    $scope.GetAnalysisReport(1);
    
    $scope.ProcessTabCungCau();
    $scope.LoadChartBanDo_Data();

    initOnReady_Index($scope.MarketSymbol);
    setInterval($scope.RealTimeStockTradingIndex, 2000);

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