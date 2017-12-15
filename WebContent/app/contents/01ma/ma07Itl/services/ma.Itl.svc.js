(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.service : ma.QaSvc
     * QA를 관리한다.
     */
    angular.module("ma.Itl.service")
        .factory("ma.ItlSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * qa 리스트를 불러온다.
				 */
            	qaList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/qa/list?"+ $.param(param)
					});
				},
				
				/**
				 * qa를 업데이트 한다.
				 */
            	qaUpdate : function (param) {					
					return $http({
						method	: "PUT",
						data 	: param,
						url		: APP_CONFIG.domain +"/qa/upt"
					});
				}
            	
            };
        }]);
}());