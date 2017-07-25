(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.service : sa.OrdCclSvc
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.service")
        .factory("sa.OrdCclSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	
            	ocmList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ocm/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 취소 거부 
				 */
            	
				ocmReject : function (param) {				
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/ocm/ocmreject/",
						data 	: param
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							alert("취소거부가 처리 되었습니다.");
						}else{
							alert("취소거부가 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 주문 취소 승인 
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
				},
				
				/**
				 * 취소 결과 전송
				 */
	       		ocmSend : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ocm/ocminter",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("취소 결과가 전송 되었습니다.");
						}else{
							alert("취소 결과가 전송 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				}					
            };
        }]);
}());