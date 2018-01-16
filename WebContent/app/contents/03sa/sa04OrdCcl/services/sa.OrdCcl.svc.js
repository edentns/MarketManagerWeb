(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.service : sa.OrdCclSvc
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.service")
        .factory("sa.OrdCclSvc", ["APP_CONFIG", "$http", "$log", function (APP_CONFIG, $http, $log) {
            return {            	
            	/**
				 * 주문 목록 
				 */
            	
            	ocmList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ocm/ordlist?"+ $.param(param),
					});
				},
				
				/**
				 * 취소 거부 DATE
				 */            	
				ocmRejectDate : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ocm/ocmrejectdate/",
						data 	: param
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							alert("취소거부 처리 되었습니다.");
						}else{
							alert("취소거부 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 취소 거부 CTT
				 */            	
				ocmRejectCtt : function (param) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ocm/ocmrejectctt/",
						data 	: param
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							alert("취소거부 처리 되었습니다.");
						}else{
							alert("취소거부 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 취소 거부 NORMAL
				 */            	
				ocmRejectNormal : function (param) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ocm/ocmrejectnormal/",
						data 	: param
					});
				},
				
				/**
				 * 주문 취소 승인 
				 */
	       		orderCancel : function (param) {
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ocm/ocmconfirm",
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
				 * 수동 값 바인딩 **/				
				manualDataBind : function(input, target, kdgrid){
	            	var getUid = input.parents("table").attr("data-uid"),
	            	    grid = kdgrid,
	            	    viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	            	    dataItem = grid.dataItem(viewToRow);								                	    
	            	
	            	if(target === "CD_PARS"){
	            		var i, chosenPureData = input.data().handler.dataSource.data();
	            		for(i=0; i<chosenPureData.length; i++){
	            			if(chosenPureData[i]["CD_DEF"] === input.val()){
	            				dataItem[target] = chosenPureData[i];
	            			}
	            		};
	            	}else if(target === "DTS_RECER"){
	            		dataItem[target] = kendo.toString(new Date(input.val()), "yyyyMMdd");
	            	}else if(target === input.attr("name")){
	            		dataItem[target] = input.val();
	            	}
	            },
	            
	            /**
	             * err후 처리
	             * */
	            
	            afterErrProc : function(err){
	            	if(err.status !== 412){
                    	alert(err.data);
                   	} 
		            $log.error(err.data);
	            }
            };
        }]);
}());