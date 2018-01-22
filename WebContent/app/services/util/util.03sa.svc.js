(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', '$timeout', 'APP_CONFIG', 'MenuSvc', 'UtilSvc', "$log",
		function ($rootScope, $state, $window, $http, $timeout, APP_CONFIG, MenuSvc, UtilSvc, $log) {
		
			//popup insert & update Validation
            this.readValidation = function(idx){
            	var result = true,
            		cashParam = angular.copy(idx);
            	
        		for(var w in idx){
        			if(w === "NM_MRK_SELCT_INDEX"){
        				var c = idx[w].length;
        				if(!c){
        					alert("마켓명을 입력해 주세요.");
                			if(confirm("마켓등록 페이지로 이동할까요?")){
                				$state.go("app.syMrk", { menu: true, ids: null });
                			};
                			result = false;
                			return false;
        				}
        			}
        			if(w === "CD_ORDSTAT"){
        				if(!idx[w]){ alert("주문상태를 입력해 주세요."); result = false; return false;};
        			}
        			if(w === "DTS_CHK"){
        				if(!idx[w]){ alert("기간을 선택해 주세요."); result = false; return false;};
        			}
        			if(w === "CD_CCLSTAT"){
        				if(!idx[w]){ alert("취소상태를 선택해 주세요."); result = false; return false;};
        			}
        			if(w === "I_CD_INQSTAT"){
        				if(!idx[w]){ alert("상태값을 입력해 주세요."); result = false; return false;};
        			}
        			if(w === "I_DTS_INQREG_F"){
        				if(idx.I_DTS_INQREG_F > idx.I_DTS_INQREG_T){ alert("문의일자를 올바르게 입력해 주세요."); result = false; return;};    
        			}
        			if(w === "DTS_FROM"){
        				if(idx.DTS_TO < idx.DTS_FROM){ alert("조회기간을 올바르게 선택해 주세요."); result = false; return false;};	
        			}
        		};
        		if(result){
        			this.localStorage.setItem(idx.CASH_PARAM, cashParam);
            		//값이 너무 길어서 안넘어 가는듯.. 조회전에 다 짤라줌
            		idx.NM_MRK_SELCT_INDEX = "";
            		idx.NM_ORDSTAT_SELCT_INDEX = "";
            		idx.CD_CCLSTAT_SELCT_INDEX = "";        		
            		//idx.DTS_SELECTED = "";        			
        		}        		
        		
            	return result;
            };
            
            //송장번호 유효성검사(정규식 체크)
            this.NoINVOValidation = function(input, colunm, valicolunm){
            	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            	var iValue = input.val().trim(); 
 			                	
			    if (input.is("[name='"+colunm+"']") && !iValue && valicolunm !== "no_invo_non_blank_validation") {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 입력해 주세요.");
                    return false;
                };
                if (input.is("[name='"+colunm+"']") && iValue && (iValue.length<3 || iValue.length>30)) {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 3자 이상 30자 이하로 입력해 주세요.");
                    return false;
                };
        		if (input.is("[name='"+colunm+"']") && iValue && !regTest.test(iValue.trim())) {
 					input.attr("data-"+valicolunm+"-msg", "송장번호는  숫자 또는 숫자와 '-'(특수문자) 조합으로만 가능합니다.");
 				    return false;
 				};
				return true;
			}; 
			
			//송장번호 유효성검사(서버체크)
			this.noInvoAjaxValidation = function(param){
				return $http({
                    method  : "POST",
					url		: APP_CONFIG.domain +"/parstest",
                    data     : param
                });
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
            	},
            	mblur : function(e){
            		var element = $(e.currentTarget),
        			msg = element.closest("tr").find(".k-invalid-msg") || element.closest("td").find(".k-invalid-msg");
        			
        			msg.hide();
            	}
            };
            
            //외부 kendo html 파일 불러오기
            this.externalKmodalPopup = function (param) {
				return $http({
					method  : "GET",
					url 	: param,
		            contentType: "text/x-kendo-template; charset=UTF-8",
				}).success(function (data, status, headers, config) {
					angular.element("#app-content").append(data);
				}).error(function (data, status, headers, config) {
                    alert("Error Loading Templates -- TODO: Better Error Handling");
				});
			};
            
			//검색어 저장 후 조회기능
			this.storedQuerySearchPlay = function(vo, param, grd){
				var getParam = this.localStorage.getItem(param);
            	
        		if(getParam){        			        			
        			var me = vo,
				    	df = getParam.DTS_FROM,
				    	dt = getParam.DTS_TO;
        			
        			for(var w in me){
        				if(w === "datesetting"){
        					me[w].selected = getParam.DTS_SELECTED;
        				}
        				if(w === "betweenDateOptionMo" ){
        					me[w] = getParam.DTS_CHK;
        				}
        				if(w === "ordMrkNameOp"){
        			   		me[w].setSelectNames = getParam.NM_MRK_SELCT_INDEX;
        			   		me[w].allSelectNames = getParam.NM_MRK_SELCT_INDEX;
        				}
        				if(w === "ordStatusOp"){
                			me[w].setSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;
        					me[w].allSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;
        				}
        				if(w === "ordMrkNameMo"){
        					me[w] = getParam.NM_MRK || getParam.NO_MRK; 
        				}
        				if(w === "ordStatusMo"){
        					me[w] = getParam.CD_ORDSTAT; 
        				}
        				if(w === "procName"){
        					var v = getParam.NM_MRKITEM || getParam.I_NM_MRKITEM || "";
        					me[w].value = v.trim();
        				}
        				if(w === "orderNo"){
        					var v = getParam.NO_MRKORD || getParam.I_NO_MRKORD || "";
        					me[w].value = v.trim();
        				}
        				if(w === "buyerName"){
        					var v = getParam.NM_PCHR || getParam.NM_CONS || getParam.I_NM_INQ || "";
        					me[w].value = v.trim();        					
        				}
        				if(w === "admin"){
        					var v = (!getParam.NO_ORDDTRM) ? "" : getParam.NO_ORDDTRM;
        					me[w].value = v.trim();
        				}
        				if(w === "cancelStatusMo"){
        					me[w] = getParam.CD_CCLSTAT;
        				}
        				if(w === "cancelStatusOp"){
    				   		me[w].setSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
    				   		me[w].allSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
        				}
        				if(w === "echgStatusMo"){
        					me[w] = getParam.CD_ECHGSTAT;
        				}
        				if(w === "cdTkbkstatMo"){
        					me[w] = getParam.CD_TKBKSTAT;
        				}
        				if(w === "csMrkNameMo"){
        					me[w] = getParam.I_NO_MRK;
        				}        				
        				if(w === "csStatusMo"){
        					me[w] = getParam.I_CD_INQSTAT;
        				}      				
        				if(w === "csQuestionCodeMo"){
        					me[w].value = getParam.I_NM_INQCLFT;
        				}
        				if(w === "csMrkNameOp"){
        					me[w].setSelectNames = getParam.CS_NM_MRK_SELCT_INDEX;
        			   		me[w].allSelectNames = getParam.CS_NM_MRK_SELCT_INDEX;
        				}
        				if(w === "csStatusOp"){
        					me[w].setSelectNames = getParam.CS_NM_ORDSTAT_SELCT_INDEX;
        					me[w].allSelectNames = getParam.CS_NM_ORDSTAT_SELCT_INDEX;
        				}        				
            			//me.setting.allCheckYn = 'N';
        			}
    				me.inQuiry();
        		};
			};
			
			//로컬 스토리지			
			this.localStorage = {
				setItem: function(name, data) {
					var user = $rootScope.webApp.user,	
						noC = user.NO_C,
						noEmp = user.NO_EMP,
						key = noC+noEmp+name;
					$window.localStorage.setItem(key, JSON.stringify(data));
				},				
				getItem: function(name) {					
					var user = $rootScope.webApp.user,
						noC = user.NO_C,
					    noEmp = user.NO_EMP,
					    key = noC+noEmp+name,
						result = $window.localStorage.getItem(key);
					if (!user){
						return '';
					};
					if (result) {
						result = JSON.parse(result);
					}					
					return result;
				},                
                removeItem: function(name) {  
                	var user = $rootScope.webApp.user,
                		noC = user.NO_C,
						noEmp = user.NO_EMP,
						key = noC+noEmp+name;              
                    $window.localStorage.removeItem(key);
                }
			};
			
			this.storedDatesettingLoad = function(name, vo){
				var storedData = this.localStorage.getItem(name);
								
				if(storedData){					
					return storedData.DTS_SELECTED; 
				}else{
					return "1Week";
				}
			};
		}
	]);
}());