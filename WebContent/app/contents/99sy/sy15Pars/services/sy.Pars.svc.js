(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Pars.service : sy.ParsSvc
     * 상품분류관리
     */
    angular.module("sy.Pars.service")
        .factory("sy.ParsSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	savePars : function ( aParam, CUD ) {
                    return $http({
                        method   : "POST",
                        url		 : APP_CONFIG.domain +"/sy15Pars/"+CUD,
                        data     : aParam
                    });
                }
           
            };
        }]);
}());