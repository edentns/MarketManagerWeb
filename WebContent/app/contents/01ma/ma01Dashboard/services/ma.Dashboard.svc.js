(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Dashboard.service : ma.DashboardSvc
     * Dashboard에 ""를 관리한다.
     */
    angular.module("ma.Dashboard.service")
        .factory("ma.DashboardSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
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
                },
                
				/**
				 * 본인확인업데이트
				 * @param {{bsCd:string, user:string, password:string}} userDataSet
				 * @returns {*}
				 */
				updateMngMrk : function (noMngMrk, ynDel) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/updateMngMrk",
						headers	: { "Content-Type": "application/x-www-form-urlencoded; text/plain; */*; charset=utf-8" },
						data    : $.param({NO_MNGMRK:noMngMrk, YN_DEL:ynDel})
					});
				}
            };
        }]);
}());