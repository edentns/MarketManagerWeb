(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Dashboard.service : sy.DashboardSvc
     * Dashboard에 ""를 관리한다.
     */
    angular.module("sy.Dashboard.service")
        .factory("sy.DashboardSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	/**
                 * @description
                 * 공통적인 payload를 객체에 할당한다.
                 * 
                 * @param target
                 * @param payload
                 * @returns {*}
                 */
                setPayload: function(target, payload) {
                    payload = payload || {};
                    
                    var key;
                    for (key in payload) {
                        if (payload.hasOwnProperty(key)) {
                            target[key] = payload[key];
                        }
                    }
                    
                    return target;
                }
            };
        }]);
}());