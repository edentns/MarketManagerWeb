(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.service : ma.QaSvc
     * QA를 관리한다.
     */
    angular.module("sy.Itl.service")
        .factory("sy.ItlSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	itlSearch : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/qaDelete",
						data	: param
					}).success(function (data, status, headers, config) {
						alert(data);
					}).error(function (data, status, headers, config) {
						alert(data);
						e.error();
					});
				}
				
            	
            };
        }]);
}());