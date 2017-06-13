(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.CInfo.service : sy.CInfoSvc
     * 회사정보관리
     */
    angular.module("sy.CInfo.service")
        .factory("sy.CInfoSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	saveWaho : function ( aParam, CUD ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/sy06Waho/"+CUD,
                        data     : aParam
                    });
                },
                
            	saveCInfo : function ( aParam ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/sy06CInfo",
                        data     : aParam
                    });
                }
            };
        }]);
}());