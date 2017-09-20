(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Pars.controller : sy.ParsCtrl
     * 
     */
    angular.module("sy.Pars.controller")
        .controller("sy.ParsCtrl", ["$scope", "$cookieStore", "$http", "$q", "$log", "$state", "sy.ParsSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", 
            function ($scope, $cookieStore, $http, $q, $log, $state, saParsSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
            }]);                              
}());
		