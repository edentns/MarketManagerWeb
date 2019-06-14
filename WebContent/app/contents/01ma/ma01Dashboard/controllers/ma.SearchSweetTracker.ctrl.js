(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.DashSearchSweetTrackerCtrl", ['$scope', 'ma.DashboardSvc', "$q", '$timeout', 'UtilSvc', "APP_CONFIG",
            function ($scope, MaDashboardSvc, $q, $timeout, UtilSvc, APP_CONFIG) {
    		
        	var searchBox = $scope.searchBox = {
        		cd : "04",
        		invoice : "615327242550"
        	}
        	
        	searchBox.onClick = function(){
        		var self = this;
        		
				var param = {
					t_code : self.cd,
					t_invoice : self.invoice
				};
				
				MaDashboardSvc.chkKey(param).then(function (res) {
					alert(res.data[0]);
					alert(res.data[1]);
				});
        	}        	
        	
        }]);
}());