(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleSiteItem.controller : it.SaleSiteItemCtrl
     * 상품분류관리
     */
    angular.module("it.SaleSiteItem.controller")
        .controller("it.SaleSiteItemCtrl", ["$scope", "$http", "$q", "$log", "it.SaleSiteItemSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, itSaleSiteItemSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());