(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc) {
			/*var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;*/
						
			//popup insert & update Validation
            this.readValidation = function(idx){
            	var result = true;
        		if(idx.NM_MRK === null || idx.NM_MRK === ""){ alert("마켓명을 입력해 주세요."); result = false; return; };
        		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); result = false; return;};
        		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); result = false; return;};			 
        		if(idx.DTS_TO < idx.DTS_FROM){ alert("조회기간을 올바르게 선택해 주세요."); result = false; return;};	
        		if(idx.CD_CCLSTAT === null || idx.CD_CCLSTAT === ""){ alert("취소상태를 선택해 주세요."); return false;};
            	return result;
            };
            
            this.NoINVOValidation = function(input, colunm, valicolunm){
            	//var regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
            	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            	var iValue = input.val(); 
 			    
			    if (input.is("[name='"+colunm+"']") && !iValue) {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 입력해 주세요.");
                    return false;
                };
			    if(input.is("[name='"+colunm+"']") && iValue && (iValue.trim().length > 100 || iValue.trim().length < 3)){
			    	input.attr("data-"+valicolunm+"-msg", "송장번호룰 3자 이상 100자 이내로 입력해 주세요.");
                    return false;
			    };
			    if (input.is("[name='"+colunm+"']") && iValue && !regTest.test(iValue.trim())) {
					input.attr("data-"+valicolunm+"-msg", "송장 번호는 택배사에 따라 숫자 또는 숫자 와 '-'(짝대기, 연속으로 안됨) 조합으로 가능합니다.");
				    return false;
				};				
				return true;
            }; 
            
            this.popupUtil = {
            	blur : function(e){
            		var element = $(e.currentTarget),
            			msg = element.closest("tr").find(".k-invalid-msg"),
            		    inputText = element.closest("input").val() || element.closest("textarea").val(),
            		    inputDate = element.closest("input[name=#DTS_RECER]").val(),
            		    //regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
                	    regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            		
            		if((regTest.test(inputText) && msg.length > 0) || (inputDate && msg.length > 0)){
            			msg.hide();
            		};
            	}
            };
		}
	]);
}());