(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.DashboardCtrl", ["$scope", "$http", "$q", "$log", "ma.DashboardSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaDashboardSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());