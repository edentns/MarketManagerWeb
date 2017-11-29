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
				if (input.is("[name='"+colunm+"']") && iValue ) {
					var row = input.closest("tr");
					var grid = row.closest("[data-role=grid]").data("kendoGrid");					
					var gridPop = angular.element(document.querySelector("div[kendo-grid]")).data("kendoGrid");
					var dataItem = "";
					var parsName = "";
					var cdName = "";
					
					if(grid){
						dataItem = grid.dataItem(row); 
					}else if(gridPop){
						dataItem = gridPop.dataItem($("[data-uid='" + input.closest("tr").parents("table").attr("data-uid") + "']", gridPop.table));
					}						
					
					if(dataItem.CD_PARS || dataItem.CD_PARS_INPUT) {
						cdName = dataItem.CD_PARS || dataItem.CD_PARS_INPUT;
						parsName = cdName.NM_PARS;
						
						if (parsName == "기타택배") {
							var pattern1 = /^[0-9a-zA-Z]{9,12}$/i;
							var pattern2 = /^[0-9a-zA-Z]{18}$/i;
							var pattern3 = /^[0-9a-zA-Z]{25}$/i;
							if (iValue.search(pattern1) == -1 && iValue.search(pattern2) == -1 && iValue.search(pattern3) == -1) {
							   input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
							   return false;
							}
						} else if (parsName == "EMS") {
							var pattern = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
							if (iValue.search(pattern) == -1) {
								input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
								return false;
							}
						} else if (parsName == "한진택배" || parsName == "현대택배") {
							if (!isNumeric(iValue)) {
								input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								return false;
							} else if ( iValue.length != 10 && iValue.length != 12 ) {
								input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호는 10자리 또는 12자리의 숫자로 입력해주세요.");
								return false;
							}
						} else if (parsName == "경동택배") {
							if (!isNumeric(iValue)) {
								input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								return false;
							} else if (iValue.length != 9 && iValue.length != 10 && iValue.length != 11) {
								input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 9자리 또는 10자리 또는 11자리의 숫자로 입력해주세요.");
								return false;
							}
						} else if (parsName == "이노지스택배") {
							if (!isNumeric(iValue)) {
								input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								return false;
							} else if (iValue.length > 13) {
								input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 최대 13자리의 숫자로 입력해주세요.");
								return false;
							}
						}  else if (parsName == "TNT Express") {
							var pattern1 = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
							var pattern2 = /^[0-9]{9}$/;
							if (iValue.search(pattern1) == -1 && iValue.search(pattern2) == -1) {
								input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
								return false;
							}
						}
					}
				}
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