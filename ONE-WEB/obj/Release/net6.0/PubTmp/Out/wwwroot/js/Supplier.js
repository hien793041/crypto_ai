app.controller('myController', function ($scope, $filter, $http, $timeout, Notification) {

    $scope.getDataPost = function (url, data) {
        var config = {};
        var promise = $http.post(url, data, config);
        return promise;

    }

    $scope.SupplierType = [];

    var promise = $scope.getDataPost('/Supplier/GetSupplierType', {});

    promise.then(function (response) {
        $scope.SupplierType = response.data;
    }).catch(function (response) {
        console.log(response.status);
    });

    //$scope.SupplierType = $scope.getDataPost('/Supplier/GetSupplierType', {});
    //$scope.Supplier = $scope.getDataPost('/Supplier/GetSupplier', {});

    //$scope.SupplierType = getData('/Supplier/GetSupplierType', {}).success(function (data) {
    //    alert('i');
    //});

    //var post = $http({
    //    method: "POST",
    //    url: '/Supplier/GetSupplierType',
    //    dataType: 'json',
    //    data: {  },
    //    headers: { "Content-Type": "application/json" }
    //});

    //post.then(function (response, status) {
    //    $scope.SupplierType = response.data;
    //});

    alert($scope.SupplierType.length);

    $scope.Test = function () {
        alert($scope.SupplierType.length);
    }
});

//function Http_Common(url, data) {
//    var post = $http({
//        method: "POST",
//        url: url,
//        data: data,
//        headers: { "Content-Type": "application/json" }
//    });

//    post.success(function (data, status) {
//        return data;
//    });
//}