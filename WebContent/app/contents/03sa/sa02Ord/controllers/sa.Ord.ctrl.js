(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());