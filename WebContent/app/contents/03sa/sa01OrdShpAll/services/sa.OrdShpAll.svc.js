(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdShpAll.service : sa.OrdShpAllSvc
     * 상품분류관리
     */
    angular.module("sa.OrdShpAll.service")
        .factory("sa.OrdShpAllSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ordall/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("주문목록을 불러오는데 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 주문 상세 목록 
				 */
            	orderDetailList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ordall/orddetaillist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("주문목록을 불러오는데 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				}
            };
        }]);
}());