(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.controller : sa.TkbkReqCtrl
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.controller")
        .controller("sa.TkbkReqCtrl", ["$scope", "$http", "$q", "$log", "sa.TkbkReqSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saTkbkReqSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());