(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.CInfo.controller : sy.CInfoCtrl
     * 회사정보관리
     */
    angular.module("sy.CInfo.controller")
        .controller("sy.CInfoCtrl", ["$scope", "$http", "$q", "$log", "sy.CInfoSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syCInfoSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());