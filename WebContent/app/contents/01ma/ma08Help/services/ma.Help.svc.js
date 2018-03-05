(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Help.service : ma.HelpSvc
     * Help를 관리한다.
     */
    angular.module("ma.Help.service")
        .factory("ma.HelpSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
				/**
				 * qa를 업데이트 한다.
				 */
            	helpUpt : function (param) {					
					return $http({
						method	: "POST",
						data 	: param,
						url		: APP_CONFIG.domain +"/help/upt"
					});
				}
            	
            };
        }]);
}());