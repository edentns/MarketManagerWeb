(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.BssItem.controller : it.BssItemCtrl
     * 기본상품관리
     */
    angular.module("it.BssItem.controller")
        .controller("it.BssItemCtrl", ["$scope", "$http", "$q", "$log", "it.BssItemSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, itItemCfctSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());