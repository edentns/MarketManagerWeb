(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.UserJoin.controller : sy.UserJoinCtrl
     * 비밀번호 재설정 등록
     */
    angular.module("sy.UserJoin.controller")
        .controller("sy.UserJoinCtrl", ["$scope", "$http", "$q", "$log", "sy.UserJoinSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syUserJoinSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());