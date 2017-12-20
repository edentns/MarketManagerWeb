(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.service : sa.OrdSvc
     * 상품분류관리
     */
    angular.module("sa.Ord.service")
        .factory("sa.OrdSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {     
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ord/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							//alert("주문확정 처리 되었습니다.");
						}else{
							//alert("주문확정 처리 실패 하었습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
				
				/**
				 * 주문 상세
				 */
            	orderInfo : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ord/ordinfo/"+decodeURIComponent(param.NO_ORD),
					}).success(function (data, status, headers, config) {
						if(data){
							//alert("주문확정 처리 되었습니다.");
						}else{
							//alert("주문확정 처리 실패 하었습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
				
            	/**
				 * 주문 확정 
				 */
            	orderConfirm : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/ord/confirm",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("주문확정 처리 되었습니다.");
						}else{
							alert("주문확정 처리 실패 하었습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
            
            	/**
				 * 주문 취소 
				 */
	       		orderCancel : function (param) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ord/cancel",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("주문취소가 처리 되었습니다.");
						}else{
							alert("주문취소 처리 실패 하었습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				}
            };
        }]);
}());