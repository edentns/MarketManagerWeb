(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.controller : sy.NoticeCtrl
     * 공지사항
     */
    angular.module("sy.Notice.controller")
        .controller("sy.NoticeCtrl", ["$scope", "$http", "$q", "$log", "sy.NoticeSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syNoticeSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());