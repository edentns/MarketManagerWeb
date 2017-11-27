(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name cs.Inq.service : cs.InqSvc
     * C/S관리
     */
    angular.module("cs.Inq.service")
        .factory("cs.InqSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 마켓정보 list
				 */
            	csMrkList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/cs/mrklist",
						data	: param
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						
					});
				},
            
	            /**
				 * cs 조회 list
				 */
	        	csList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/cs/cslist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						
					});
				},
				
				/**
				 * cs 답변 저장
				 */
	        	csUpdate : function (param, e) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/cs/update",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data !== "") {	    					
    						alert("답변이 저장 되었습니다.");    							                			
        				}else{
        					alert("답변이 저장 실패하였습니다.!! 연구소에 문의 부탁드립니다.");
        					location.reload();
        				}  
					}).error(function (data, status, headers, config) {
						e.error();
					});
				}
            };
        }]);
}());