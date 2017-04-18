(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name cs.Inq.controller : cs.InqCtrl
     * C/S관리
     */
    angular.module("cs.Inq.controller")
        .controller("cs.InqCtrl", ["$scope", "$http", "$q", "$log", "cs.InqSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, csInqSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());