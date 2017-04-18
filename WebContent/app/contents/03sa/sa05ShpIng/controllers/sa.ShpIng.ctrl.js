(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.controller : sa.ShpIngCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpIng.controller")
        .controller("sa.ShpIngCtrl", ["$scope", "$http", "$q", "$log", "sa.ShpIngSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saShpIngSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());