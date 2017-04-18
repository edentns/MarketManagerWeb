(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpStdbyOrd.controller : sa.ShpStdbyOrdCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpStdbyOrd.controller")
        .controller("sa.ShpStdbyOrdCtrl", ["$scope", "$http", "$q", "$log", "sa.ShpStdbyOrdSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saShpStdbyOrdSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());