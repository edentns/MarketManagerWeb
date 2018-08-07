(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.service : sa.OrdSvc
     * 상품분류관리
     */
    angular.module("sa.Ord.service")
        .factory("sa.OrdSvc", ["APP_CONFIG", "APP_MSG", "sa.ShpStdbyOrdSvc", "$http", function (APP_CONFIG, APP_MSG, ShpStdbyOrdSvc, $http) {
            return {     
            	
            	/**
				 * 주문 목록 조회
				 */
            	orderList : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ord/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
				
				/**
				 * 주문 상세 조회
				 */
            	orderInfo : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/ord/ordinfo/"+decodeURIComponent(param.NO_ORD),
					}).success(function (data, status, headers, config) {
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},	
				
            	/**
				 * 주문 확정 backs 호출
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
				 * 주문 취소 backs 호출
				 */
	       		orderCancel : function (param) {				
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/ord/cancel",
						data	: param
					});
				},
				
				orderInfoCancel : function(defer, vo){
	            	if(!vo.inputs.CD_CCLRSN){
	            		//alert("주문취소코드를 선택해주세요.");
	            		//return false;
	    				defer.reject();
	            	}
	            	else if(!vo.inputs.CD_CCLLRKRSN.CD_DEF && vo.inputs.CD_CCLLRKRSN.NM_DEF){
	            		//alert("하위 주문취소코드를 선택해주세요.");
	            		//return false;
	    				defer.reject();
	            	}
	            	else if(!vo.inputs.DC_CCLRSNCTT || vo.inputs.DC_CCLRSNCTT.length < 4 || vo.inputs.DC_CCLRSNCTT.length > 1000){  
	            		//alert("주문취소사유를 5자 이상 1000자 이하로 작성해 주세요.");
	            	    //return false;
	    				defer.reject();
	            	}
	            	else if(confirm(APP_MSG.cancel.confirm)){
	            		var param = $.extend(vo.inputs, vo.ds);
	            		    				    
        				this.orderCancel(param).then(function (res) {
        					vo.ordCancelPopOptionsClose();
        					vo.getInitializeOrdInfoProc();
            				defer.resolve(APP_MSG.cancel.success);		   
            			}, function(err){
    	    				defer.reject(err.data);
    					});
	            	};
        			return defer.promise;
				},
				
				orderInfoShipInfoReg : function(defer, vo){
					var param = [$.extend({ROW_CHK: true}, vo.ds)];        		
	        		vo.resChk = true;	        		
	        		ShpStdbyOrdSvc.shpInReg(param).then(function (res) {
	        			var rtnV = res.data,
	        				allV = rtnV.allNoOrd,
						    trueV = rtnV.trueNoOrd,
						    falseV = rtnV.falseNoOrd;
	        			
	        			if(trueV.length > 0){
	            			vo.getInitializeOrdInfoProc();
	        				defer.resolve(APP_MSG.insert.success);		          	
	        			}else if(falseV.length > 0){
	        				//송장번호가 없거나 틀렸을때는 툴팁으로 표시된다.
	        				vo.resChk = false;
	        				angular.element("input[name=NO_INVO]").blur();
	        				//defer.resolve();
	        			}else if(!allV){
	        				//alert("배송정보등록이 실패하였습니다.");
	        				defer.reject(APP_MSG.insert.error);
	        			}
	    			}, function(err){
	    				defer.reject(err.data);
					});
	    			return defer.promise;
				}				
            };
        }]);
}());