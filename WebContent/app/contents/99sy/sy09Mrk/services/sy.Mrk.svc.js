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
                }
                
            };
        }]);
}());