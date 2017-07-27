(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.service : sa.ShpIngSvc
     * 상품분류관리
     */
    angular.module("sa.ShpIng.service")
        .factory("sa.ShpIngSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shipping/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							//
						}else{
							alert("주문목록을 불러오는데 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 주문 목록 
				 */
            	delay : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shipping/delay",
						data 	: param
					}).success(function (data, status, headers, config) {
						/*if(data === "success"){
							alert("배송지연을 등록 하였습니다.");
						}else{
							alert("배송지연을 등록하는데 실패 하였습니다.");
						}*/
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				}
            };
        }]);
}());