(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.service : sa.TkbkReqSvc
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.service")
        .factory("sa.TkbkReqSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/tkbk/ordlist?"+ $.param(param),
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
				 * 반품 승인
				 */
            	tkbkConfirm : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/tkbk/confirm",
						data	: param 
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 반품 거부
				 */
            	tkbkReject : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/tkbk/reject",
						data	: param 
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 반품 완료
				 */
            	tkbkCompleted : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/tkbk/completed",
						data	: param 
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 반품 전송
				 */
				tkbkInterfacesend : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/tkbk/interfacesend",
						data	: param 
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				}
            };
        }]);
}());