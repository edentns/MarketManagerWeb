(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.ItlMrk.controller : sy.ItlMrkCtrl
     * 연동쇼핑몰
     */
    angular.module("sy.ItlMrk.controller")
        .controller("sy.ItlMrkCtrl", ["$scope", "$http", "$q", "$log", "sy.ItlMrkSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syItlMrkSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());