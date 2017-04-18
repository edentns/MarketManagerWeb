(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Mrk.controller : sy.MrkCtrl
     * 마켓관리
     */
    angular.module("sy.Mrk.controller")
        .controller("sy.MrkCtrl", ["$scope", "$http", "$q", "$log", "sy.MrkSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syMrkSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());