(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 상품 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util03saSvc', ['$rootScope', '$state', '$window', '$http', '$timeout', 'APP_CONFIG', 'MenuSvc', 'UtilSvc',
		function ($rootScope, $state, $window, $http, $timeout, APP_CONFIG, MenuSvc, UtilSvc) {
			/*var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;*/
						
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
            
            //송장번호 유효성검사
            this.NoINVOValidation = function(input, colunm, valicolunm){
            	//var regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
            	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
            	var iValue = input.val().trim(); 
 			    
			    if (input.is("[name='"+colunm+"']") && !iValue) {
                 	input.attr("data-"+valicolunm+"-msg", "송장번호를 입력해 주세요.");
                    return false;
                };
			    if(input.is("[name='"+colunm+"']") && iValue && (iValue.trim().length > 20 || iValue.trim().length < 8)){
			    	input.attr("data-"+valicolunm+"-msg", "송장번호를 8자 이상 20자 이내로 입력해 주세요.");
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
					
					if(dataItem.CD_PARS || dataItem.CD_PARS_INPUT){
						cdName = dataItem.CD_PARS || dataItem.CD_PARS_INPUT;
						parsName = cdName.NM_PARS || dataItem.CD_PARS;
						
						if (parsName === "기타택배") {
							var pattern1 = /^[0-9a-zA-Z]{9,12}$/i;
							var pattern2 = /^[0-9a-zA-Z]{18}$/i;
							var pattern3 = /^[0-9a-zA-Z]{25}$/i;
							if(iValue.search(pattern1) === -1 && iValue.search(pattern2) === -1 && iValue.search(pattern3) === -1) {
							   input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
							   return false;
							}
						} else if (parsName === "EMS") {
							var pattern = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
							if(iValue.search(pattern) === -1) {
								input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
							    return false;
							}
						} else if (parsName === "한진택배" || parsName === "현대택배") {
								if(!$.isNumeric(iValue)) {
								    input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								    return false;
								}else if( iValue.length != 10 && iValue.length != 12 ) {
								    input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호는 10자리 또는 12자리의 숫자로 입력해주세요.");
								    return false;
								}
						} else if (parsName === "경동택배") {
							    if(!$.isNumeric(iValue)) {
								    input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								    return false;
							    }else if(iValue.length != 9 && iValue.length != 10 && iValue.length != 11) {
								    input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 9자리 또는 10자리 또는 11자리의 숫자로 입력해주세요.");
								    return false;
							    }
						} else if (parsName === "이노지스택배") {
							    if(!$.isNumeric(iValue)) {
								    input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
								    return false;
							    }else if(iValue.length > 13) {
								    input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 최대 13자리의 숫자로 입력해주세요.");
								    return false;
							    }
						} else if (parsName === "TNT Express") {
								var pattern1 = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
								var pattern2 = /^[0-9]{9}$/;
								if(iValue.search(pattern1) === -1 && iValue.search(pattern2) === -1) {
								   input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
								   return false;
								}
						};
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
        			
    				me.datesetting.period.start.y = df.substring(0,4);
        			me.datesetting.period.start.m = df.substring(4,6);
        			me.datesetting.period.start.d = df.substring(6,8); 					    
        			me.datesetting.period.end.y = dt.substring(0,4);
				   	me.datesetting.period.end.m = dt.substring(4,6); 
				   	me.datesetting.period.end.d = dt.substring(6,8);
				   	
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
					$window.localStorage.setItem(name, JSON.stringify(data));
				},
				
				getItem: function(name) {
					var result = $window.localStorage.getItem(name);
					
					if (result) {
						result = JSON.parse(result);
					}					
					return result;
				},
                
                removeItem: function(name) {                    
                    $window.localStorage.removeItem(name);
                }
			};
		}
	]);
}());