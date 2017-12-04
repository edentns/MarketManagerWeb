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
            	
            	qaSave : function (param, CUD) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/qaInsert/"+CUD,
						data	: param
					});
				},
				
				qaDelete : function (deleteItem) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/sy/qaDelete",
						data	: deleteItem
					}).success(function (data, status, headers, config) {
						alert(data);
					}).error(function (data, status, headers, config) {
						alert(data);
						e.error();
					});
				}
            };
        }]);
}());