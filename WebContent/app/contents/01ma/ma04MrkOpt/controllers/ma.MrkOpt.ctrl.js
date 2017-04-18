(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.MrkOpt.controller : ma.MrkOptCtrl
     * 코드관리
     */
    angular.module("ma.MrkOpt.controller")
        .controller("ma.MrkOptCtrl", ["$scope", "$http", "$q", "$log", "ma.MrkOptSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaMrkOptSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());