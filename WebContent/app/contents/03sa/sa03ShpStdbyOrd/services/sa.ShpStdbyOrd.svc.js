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
						
					}).error(function (data, status, headers, config) {
						alert("시스템 오류로 인하여 택배사 코드가 표시되지 않았습니다.");
					});
				},
				
				/**
				 * 단일 택배사 코드
				 */
				shplistInfo : function (param) {					
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/shpbyord/shplistinfo/"+decodeURIComponent(param.NO_ORD),
					}).success(function (data, status, headers, config) {
						
					}).error(function (data, status, headers, config) {
						alert("시스템 오류로 인하여 택배사 코드가 표시되지 않았습니다.");
					});
				},
				
				/**
				 *  유효성 검사
				 * */
	            updateValidation : function(param, btnCase){
	            	var tempParam = "",
	            	       result = true;
	            	tempParam = param.filter(function(ele){
						return ele.ROW_CHK === true;
					});
	            	if(tempParam.length < 1){
	            		alert("등록 하실 행을 선택해 주세요");
						return false;
	            	}
	            	switch(btnCase){
	            		case '001' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT > '002'){
	    	            			alert('주문상태가 신규주문, 상품준비중 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	            			};
	            			break;
	            		}
	            		case '002' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT !== '002'){
	    	            			alert('주문상태가 상품준비중 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].CD_PARS){
	    	            			alert('택배사를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].NO_INVO){
	    	            			alert('송장 번호를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}	    	            		
	    	            		if(tempParam[i].NO_INVO){
	    	            			var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
	    	                    	var iValue = tempParam[i].NO_INVO;
	    	                    	
	    	                        if (iValue.length<3 || iValue.length>30) {
	    	                        	alert("송장번호를 3자 이상 30자 이하로 입력해 주세요.");
	    	                         	result = false;
		        						return false;
	    	                        };
	    	                		if (iValue && !regTest.test(iValue.trim())) {
	    	                			alert("송장번호는  숫자 또는 숫자와 '-'(특수문자) 조합으로만 가능합니다.");
	    	         					result = false;
		        						return false;
	    	         				};
	    	            		}
	            			};
	            			break;
	            		}
	            		case '003' : {
	            			var i = 0;
	            			for(i; i< tempParam.length; i+=1){
	            				if(tempParam[i].CD_ORDSTAT !== '004'){
	    	            			alert('주문상태가 배송중 일때 가능 합니다.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].CD_PARS){
	    	            			alert('택배사를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	    	            		if(!tempParam[i].NO_INVO){
	    	            			alert('송장 번호를 입력해 주세요.');
	    	            			result = false;
	        						return;
	    	            		}
	            			};
	            			break;
	            		} 	
	            		default : {
	            			break;
	            		}
	            	}	  
	            	return result;
	            },
				
				/**
				 * 택배사 객체 필터링
				 * */	            
	            filteringShpbox : function(inputc, vo){
	            	var changDbbox = "";
	            	changDbbox = vo.shipCodeTotal.filter(function(element){
						return (element.NO_MRK === inputc);
					});	 
	            	return changDbbox;
	            }
            };
        }]);
}());