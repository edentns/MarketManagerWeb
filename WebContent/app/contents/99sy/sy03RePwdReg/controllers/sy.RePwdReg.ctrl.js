(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.RePwdReg.controller : sy.RePwdRegCtrl
     * 비밀번호 재설정 등록
     */
    angular.module("sy.RePwdReg.controller")
        .controller("sy.RePwdRegCtrl", ["$scope", "$http", "$q", "$log", "sy.RePwdRegSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, syRePwdRegSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());