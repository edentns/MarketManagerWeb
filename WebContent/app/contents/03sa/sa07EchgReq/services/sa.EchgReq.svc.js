(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.EchgReq.service : sa.EchgReqSvc
     * 상품분류관리
     */
    angular.module("sa.EchgReq.service")
        .factory("sa.EchgReqSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/echg/ordlist?"+ $.param(param),
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
				 * 교환 승인
				 */
				echgConfirm : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/echg/confirm",
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
				 * 교환 거부
				 */
            	echgReject : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/echg/reject",
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
				 * 교환 완료
				 */
            	echgCompleted : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/echg/completed",
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
            
            };
        }]);
}());