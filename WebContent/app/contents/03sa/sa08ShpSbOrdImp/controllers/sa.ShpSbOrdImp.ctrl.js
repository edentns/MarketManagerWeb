(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpSbOrdImp.controller : sa.ShpSbOrdImpCtrl
     * 
     */
    angular.module("sa.ShpSbOrdImp.controller")
        .controller("sa.ShpSbOrdImpCtrl", ["$scope", "$cookieStore", "$http", "$q", "$log", "$state", "sa.ShpSbOrdImpSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",  "Util03saSvc", 
            function ($scope, $cookieStore, $http, $q, $log, $state, saShpSbOrdImpSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
            }]);                              
}());
		