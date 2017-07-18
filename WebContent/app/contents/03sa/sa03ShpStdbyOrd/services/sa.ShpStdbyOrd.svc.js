(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpStdbyOrd.service : sa.ShpStdbyOrdSvc
     * 상품분류관리
     */
    angular.module("sa.ShpStdbyOrd.service")
        .factory("sa.ShpStdbyOrdSvc", ["APP_CONFIG", "$http", function (APP_CONFIG, $http) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	shpbyordList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shpbyord/shpbyordlist?"+ $.param(param),
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
				shpbyordInfo : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ord/ordinfo/"+decodeURIComponent(param.NO_ORD),
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
				 * 배송 정보 등록
				 */
				shpInReg : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shpbyord/shpinreg",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("배송정보를 등록 하였습니다.");
						}else{
							alert("배송정보를 등록 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
				
				/**
				 * 송장 출력
				 */
				noout : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shpbyord/noout",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("송장정보를 출력 하였습니다.");
						}else{
							alert("송장정보 출력을 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 배송 정보 전송
				 */
				shpinsend : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/shpbyord/shpinsend",
						data	: param
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							alert("배송정보를 전송 하였습니다.");
						}else if (data === "already"){
							location.reload();
						}else{
							alert("배송정보 전송을 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 택배사 코드
				 */
				shplist : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shpbyord/shplist/"+decodeURIComponent(param.NO_MRK),
					}).success(function (data, status, headers, config) {
						if(data === "success"){
							//alert("배송정보를 전송 하였습니다.");
						}else{
							//alert("배송정보 전송을 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류로 인하여 택배사 코드가 표시되지 않았습니다.");
					});
				}
            };
        }]);
}());