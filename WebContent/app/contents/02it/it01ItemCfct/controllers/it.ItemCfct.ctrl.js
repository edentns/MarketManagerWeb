(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.ItemCfct.controller : it.ItemCfctCtrl
     * 상품분류관리
     */
    angular.module("it.ItemCfct.controller")
        .controller("it.ItemCfctCtrl", ["$scope", "$http", "$q", "$log", "it.ItemCfctSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, itItemCfctSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());