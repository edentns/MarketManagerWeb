(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.service : sa.TkbkReqSvc
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.service")
        .factory("sa.TkbkReqSvc", ["$rootScope", "APP_CONFIG", "$http", "UtilSvc", "Util03saSvc", "$log", "$timeout", function ($rootScope, APP_CONFIG, $http, UtilSvc, Util03saSvc, $log, $timeout) {
            return {
            	
            	/**
				 * 주문 목록 
				 */
            	orderList : function (param) {
					return $http({
						method	: "GET",
						url		: APP_CONFIG.domain +"/tkbk/ordlist?"+ $.param(param),
					}).success(function (data, status, headers, config) {
						if(data !== ""){
							
						}else{
							alert("주문목록을 불러오는데 실패 하였습니다.");
						}
					}).error(function (data, status, headers, config) {
						alert("시스템 오류 관리자에게 문의 하세요.");
					});
				},
				
				/**
				 * 반품 승인
				 */
            	tkbkConfirm : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/tkbk/confirm",
						data	: param 
					});
				},
				
				/**
				 * 반품 거부
				 */
            	tkbkReject : function (param) {					
					return $http({
						method	: "PUT",
						url		: APP_CONFIG.domain +"/tkbk/reject",
						data	: param 
					});
				},
				
				/**
				 * 반품 완료
				 */
            	tkbkCompleted : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/tkbk/completed",
						data	: param 
					});
				},
				
				/**
				 * 교환으로 변경
				 */
            	tkbkExchange : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/tkbk/exchange",
						data	: param 
					});
				},
				
				/**
				 * 교환으로 변경(스토어팜 요청 전용)
				 */
            	tkbkExchangeStoreFarmRequest : function (param) {					
					return $http({
						method	: "POST",
						url		: APP_CONFIG.domain +"/tkbk/exchange-s",
						data	: param 
					});
				},
					            
	            receiveCheckClickEvent : function(model, e, code, cdParsTkbk){
	            	var element = $(e.currentTarget),
            			checked = element.val(), 
            			type = model.updateChange,
            			msg = "";
            	
	            	if(type === "003"){
	            		if(checked === 'N'){
		            		model.receiveCheckCode = checked;
		            	}else{
		            		model.ngIfinIt();
		            		
	                		var ddl = element.parents("table").find("select[name=CD_HOLD]").data("kendoDropDownList"),
	                			nutxt = element.parents("table").find("input[name=CD_HOLD_FEE]").data("kendoNumericTextBox");
	                		
	                		ddl.select(0);
	                		ddl.trigger("change");
	                		ddl.select(0);
	                		
	        				nutxt.value(0);
	        				nutxt.trigger("change");
	        				nutxt.value(0);
		            	};
	            	}else if(type === "004"){
	            		if(checked === 'N'){
	            			model.receiveCheckCode = checked;	            			
		            	}else{
		            		model.ngIfinIt('Y');		            		

            				if(cdParsTkbk){
            					var cdParsTkbkDdl = element.parents("table").find("select[name=PICK_CD_PARS]").data("kendoDropDownList");
            					  
            					cdParsTkbkDdl.value(cdParsTkbk);
            					cdParsTkbkDdl.trigger("change"); 
            				};
		            	};
	            	}
	            },
	            
	            chkCdparsAndNoInvo : function(mrkCode, curCode, input, grd){   	
            		if(["003","004"].indexOf(curCode)>-1){
            			var gridPop = angular.element(document.querySelector("div[kendo-grid]")).data("kendoGrid"),
							dataItem = gridPop.dataItem($("[data-uid='" + input.closest("tr").parents("table").attr("data-uid") + "']", gridPop.table));
					            			
            			if((['170104','170102',"170103"].indexOf(mrkCode)>-1 && dataItem.RECEIVE_SET === 'Y' && curCode === "004") ||
	            		    (["170103"].indexOf(mrkCode)>-1 && curCode === "003") ||   
	            		    (['170106'].indexOf(mrkCode)>-1 && curCode === "004")){           				
	                			if(input.is("[name='CD_PARS']") && !input.val()){
	                				input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
	                                return false;
	                			}
	                			else if(input.is("[name='NO_INVO']")){
	                				var result = Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invovalidation', 3);
			            			if(result){
			            				Util03saSvc.manualTkbkDataBind(grd, input, "NO_INVO");
			            			}
			            			return result;
	                			}
            			}
            			if(input.is("[name='PICK_CD_PARS']") && input.val() === "" && (dataItem.RECEIVE_SET === 'Y' || dataItem.DC_TKBKSHPCOSTAPVL === '선결제 완료 (환불완료시 반품배송비 정산이 진행됩니다.)' ) && ['170103'].indexOf(mrkCode)>-1 && curCode === "004"){
            				input.attr("data-pick_cd_parsvalidation-msg", "택배사를 입력해 주세요.");
                            return false;
            			}
            			if(input.is("[name='PICK_NO_INVO']") && (dataItem.RECEIVE_SET === 'Y' || dataItem.DC_TKBKSHPCOSTAPVL === '선결제 완료 (환불완료시 반품배송비 정산이 진행됩니다.)' ) &&['170103'].indexOf(mrkCode)>-1 && curCode === "004"){
            				var result = Util03saSvc.NoINVOValidation(input, 'PICK_NO_INVO', 'pick_no_invovalidation');
	            			if(result){
	            				Util03saSvc.manualTkbkDataBind(grd, input, "PICK_NO_INVO");
	            			}
	            			return result;
            			}
            		}
            		return true;
	            },
	            	            
            	getTdClass : function(index, align){
            		var viewClassName = "border-right-line "+align;
            			
            		if(index%2 === 0){
            			viewClassName = "active border-right-line "+align;
            		}            		
            		return viewClassName;
            	},
            	
            	allChkCcl : function(grd){
            		if(grd){
                		grd.cancelRow();	
            		}
                	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);            		
            	}
            };
        }]);
}());