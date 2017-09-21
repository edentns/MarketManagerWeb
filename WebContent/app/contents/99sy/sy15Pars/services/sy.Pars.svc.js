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
            	/**
                 * 마켓정보를 가져온다.
                 * @returns {*}
                 */
                getMarketNameList: function () {
                    return $http({
                        method  : "GET",
                        url		: APP_CONFIG.domain +"/sy15Pars"
                    });
                }
            };
        }]);
}());