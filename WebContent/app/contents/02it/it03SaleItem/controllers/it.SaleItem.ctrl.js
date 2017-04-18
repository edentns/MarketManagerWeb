(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleItem.controller : it.SaleItemCtrl
     * 판매상품관리
     */
    angular.module("it.SaleItem.controller")
        .controller("it.SaleItemCtrl", ["$scope", "$http", "$q", "$log", "it.SaleItemSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, itSaleItemSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());