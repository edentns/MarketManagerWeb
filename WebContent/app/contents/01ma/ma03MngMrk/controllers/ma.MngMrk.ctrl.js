(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MngMrk.controller : ma.MngMrkCtrl
     * 코드관리
     */
    angular.module("ma.MngMrk.controller")
        .controller("ma.MngMrkCtrl", ["$scope", "$http", "$q", "$log", "ma.MngMrkSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaMngMrkSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());