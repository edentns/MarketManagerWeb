(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', '$timeout', 'APP_CONFIG', 'MenuSvc', 'UtilSvc',
		function ($rootScope, $state, $window, $http, $timeout, APP_CONFIG, MenuSvc, UtilSvc) {
		
			//popup insert & update Validation
            this.readValidation = function(idx){
            	var result = true;
        		if(!idx.NM_MRK_SELCT_INDEX.length){ alert("마켓명을 입력해 주세요."); result = false; return; };
        		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); result = false; return;};
        		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); result = false; return;};			 
        		if(idx.DTS_TO < idx.DTS_FROM){ alert("조회기간을 올바르게 선택해 주세요."); result = false; return;};	
        		if(idx.CD_CCLSTAT === null || idx.CD_CCLSTAT === ""){ alert("취소상태를 선택해 주세요."); return false;};
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
				   			
					me.datesetting.selected = getParam.DTS_SELECTED;
    				me.betweenDateOptionMo = getParam.DTS_CHK;
    				
			   		me.ordMrkNameOp.setSelectNames = getParam.NM_MRK_SELCT_INDEX;
        			me.ordStatusOp.setSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;

			   		me.ordMrkNameOp.allSelectNames = getParam.NM_MRK_SELCT_INDEX;
        			me.ordStatusOp.allSelectNames = getParam.NM_ORDSTAT_SELCT_INDEX;
        			//me.setting.allCheckYn = 'N';
        			
    				me.ordMrkNameMo = getParam.NM_MRK || getParam.NO_MRK; 
        			me.ordStatusMo = getParam.CD_ORDSTAT;        			                			
    				me.procName.value = getParam.NM_MRKITEM;
        			me.orderNo.value = getParam.NO_MRKORD;
        			me.buyerName.value = getParam.NM_PCHR || getParam.NM_CONS; 
        			
    				//me.datesetting.period.start.y = df.substring(0,4);
        			//me.datesetting.period.start.m = df.substring(4,6);
        			//me.datesetting.period.start.d = df.substring(6,8); 					    
        			//me.datesetting.period.end.y = dt.substring(0,4);
				   	//me.datesetting.period.end.m = dt.substring(4,6); 
				   	//me.datesetting.period.end.d = dt.substring(6,8);
				   	
				   	if(me.admin){
				   		var a = me.admin; 
				   		a.value = (!getParam.NO_ORDDTRM) ? "" : getParam.NO_ORDDTRM;
				   	};
				   	if(me.cancelStatusMo){
				   		me.cancelStatusMo = getParam.CD_CCLSTAT;
				   		me.cancelStatusOp.setSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
				   		me.cancelStatusOp.allSelectNames = getParam.CD_CCLSTAT_SELCT_INDEX;
				   	}
				   	if(me.echgStatusMo){
				   		me.echgStatusMo = getParam.CD_ECHGSTAT;
				   	}
				   	if(me.cdTkbkstatMo){
				   		me.cdTkbkstatMo = getParam.CD_TKBKSTAT;
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