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
					});
				}
            };
        }]);
}());