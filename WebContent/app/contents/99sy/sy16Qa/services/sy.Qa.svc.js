(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Notice.service : sy.NoticeSvc
     * 공지사항
     */
    angular.module("sy.Qa.service")
        .factory("sy.QaSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	qaInsert : function (param, CUD) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/qa/qaInsert/"+CUD,
						data	: param
					});
				}
            };
        }]);
}());