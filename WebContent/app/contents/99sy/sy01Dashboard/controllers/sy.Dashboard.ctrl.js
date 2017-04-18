(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.DashboardCtrl", ["$scope", "$http", "$q", "$log", "sy.DashboardSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, SyDashboardSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());