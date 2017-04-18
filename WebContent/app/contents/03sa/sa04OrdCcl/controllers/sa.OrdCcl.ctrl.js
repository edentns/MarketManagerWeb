(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.controller : sa.OrdCclCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.controller")
        .controller("sa.OrdCclCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdCclSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saOrdCclSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());