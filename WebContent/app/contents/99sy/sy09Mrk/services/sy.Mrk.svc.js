(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Mrk.service : sy.MrkSvc
     * 마켓관리
     */
    angular.module("sy.Mrk.service")
        .factory("sy.MrkSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	saveUserMrk : function ( aParam, CUD ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/sy09Mrk/"+CUD,
                        data     : aParam
                    });
                },

	        	conMrk : function ( aParam ) {
	                return $http({
	                    method   : "POST",
	                    url		 : APP_CONFIG.domain +"/sy09MrkCons",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
	                    data     : $.param(aParam)
	                });
	            }
            };
        }]);
}());