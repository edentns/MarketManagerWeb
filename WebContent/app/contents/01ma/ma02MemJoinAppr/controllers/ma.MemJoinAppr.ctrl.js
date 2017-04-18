(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MemJoinAppr.controller : ma.MemJoinApprCtrl
     * 코드관리
     */
    angular.module("ma.MemJoinAppr.controller")
        .controller("ma.MemJoinApprCtrl", ["$scope", "$http", "$q", "$log", "ma.MemJoinApprSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaMemJoinApprSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());