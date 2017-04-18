(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Notice.controller : ma.NoticeCtrl
     * 코드관리
     */
    angular.module("ma.Notice.controller")
        .controller("ma.NoticeCtrl", ["$scope", "$http", "$q", "$log", "ma.NoticeSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, MaNoticeSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());