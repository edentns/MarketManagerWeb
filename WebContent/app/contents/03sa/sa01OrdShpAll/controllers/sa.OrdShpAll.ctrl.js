(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdShpAll.controller : sa.OrdShpAllCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdShpAll.controller")
        .controller("sa.OrdShpAllCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdShpAllSvc", "APP_CODE", "$timeout", "resData", "Page",
            function ($scope, $http, $q, $log, saOrdShpAllSvc, APP_CODE, $timeout, resData, Page) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
            }]);
}());