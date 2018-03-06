(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Avtm.service : ma.AvtmSvc
     * Avtm를 관리한다.
     */
    angular.module("ma.Avtm.service")
        .factory("ma.AvtmSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
				/**
				 * qa를 업데이트 한다.
				 */
            	avtmUpt : function (param) {					
					return $http({
						method	: "POST",
						data 	: param,
						url		: APP_CONFIG.domain +"/avtm/upt"
					});
				}
            	
            };
        }]);
}());