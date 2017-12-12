(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",
            function ($stateParams, $scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            //var page  = $scope.page = new Page({ auth: resData.access }),
		        //    today = edt.getToday();
        	        		
	            //주문상태 드랍 박스 실행	
	            var orderStatus = (function(){
					var param = {
						lnomngcdhd: "SYCH00048",
						lcdcls: "SA_000007"
					};
	    			UtilSvc.getCommonCodeList(param).then(function (res) {
	    				if(res.data.length >= 1){
	    					ordInfoDataVO.ordStatusOp = res.data;
	    				}
	    			});		
            	}());
	               
	            var ordInfoDataVO = $scope.ordInfoDataVO = {       	
	        		kind : "",
	        		no: "",
	        		noOrd : "",
	        		noMrkord : "",
	        		ds : {},
	        		ordStatusOp : {},
	        		cancelCodeOptions : {
	        			dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF"
	        		},
	        		orderInfo : { boxTitle : "주문 정보" },
	        		procInfo : { boxTitle : "제품 정보" },
	        		buyerInfo : { boxTitle : "구매자 정보" },
	        		receiveInfo : { boxTitle : "수령인 정보" },
	        		deliveryInfo : { boxTitle : "배송 정보" },
	        		inputs: {
	        			CD_CCLRSN : "",
	        			DC_CCLRSNCTT : ""
	        		}
		        };
	            	            	            
	            ordInfoDataVO.getInitializeOrdInfoProc = function(){
	            	var param = {
    					NO_ORD: this.noOrd
    				};
	            	saOrdSvc.orderInfo(param).then(function (res) {
        				if(res.data.NO_ORD){
        					ordInfoDataVO.ds = res.data;
        					
        	            	//취소 사유 코드 드랍 박스 실행	
        	            	var cancelReasonCode = (function(){
        	    				var param = {
        	    					lnomngcdhd: "SYCH00056",
        	    					lcdcls: "SA_000015",
        	    					customnoc: "00000",
        	    					mid: ordInfoDataVO.ds.NO_MNGMRK
        	    				};
        	        			UtilSvc.getCommonCodeList(param).then(function (res) {
        	        				if(res.data.length >= 1){
        	        					ordInfoDataVO.cancelCodeOptions.dataSource = res.data;
        	        					ordInfoDataVO.inputs.CD_CCLRSN = res.data[0];
        	        				}
        	        			});
        		            }());  
        				}else{
        					alert("조회된 데이터가 없습니다.");
        				}
        			});	
	            };
	            
	            ordInfoDataVO.getInitializeOrdInfo = function(){
	            	var me = this;
	            	
	            	me.kind = $stateParams.kind;
	            	me.noOrd = $stateParams.noOrd;
	            	me.noMrkord = $stateParams.noMrkord;
		           
	            	if(me.noOrd && me.noMrkord){
	            		me.getInitializeOrdInfoProc();
	            	}else{
	                    me.goBack();	                    
	            	}
		        };
		        
		        ordInfoDataVO.goBack = function() {
		        	$state.go("app.saOrd", { kind: null, menu: true, noOrd : null, noMrkord: null});	 
		        };
		        		        		        		     
		        ordInfoDataVO.ordCancelPopOptions = {
		        	actions: [ "Minimize", "Maximize", "Close"],
	            	height : "500",
	            	visible : false,
	            	modal : true,
	            	title : "",
	            	content : {
	            		template : kendo.template($.trim($("#ordinfo_popup_template").html()))
	            	}
		        };
		        //pop up open
		        ordInfoDataVO.ordCancelPopOptionsOpen = function(){
		        	var win = $scope.win;
		        	
		        	win.center();
	            	win.open();
	            };
	            //pop up close
	            ordInfoDataVO.ordCancelPopOptionsClose = function(){
		        	var win = $scope.win;
		        			        	
		        	win.close();
		        	
		        	this.inputs.cancel_reason_code = "";
		        	this.inputs.cancel_reason_text = "";
		        	$("span.k-tooltip-validation").hide();
	            };
	            //주문취소
	            ordInfoDataVO.doOrdCancel = function(){
	            	if(this.inputs.CD_CCLRSN === ""){
	            		return;
	            	}
	            	if(this.inputs.DC_CCLRSNCTT === "" || this.inputs.DC_CCLRSNCTT.length < 10){  
	            		alert("주문취소사유가 없거나 10미만입니다.")
	            	    return;
	            	}
	            	if(confirm("현재 주문을 취소 하시겠습니까?")){
	            		var defer = $q.defer(),
        			 		param = $.extend(ordInfoDataVO.inputs, ordInfoDataVO.ds);
    				    param.CD_CCLRSN = param.CD_CCLRSN.CD_DEF;
    				    
        				saOrdSvc.orderCancel(param).then(function (res) {
            				defer.resolve();            				
            				ordInfoDataVO.ordCancelPopOptionsClose();
            				location.reload();
            			});
            			return defer.promise;
	            	}
	            };
	            	            
	            ordInfoDataVO.doOrdConfirm = function(){
	            	if(confirm("현재 주문을 확정 하시겠습니까?")){
	            		var defer = $q.defer(),
    			 			param = {
	            				data: [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)] 
	            			}
	            		
	    				saOrdSvc.orderConfirm(param).then(function (res) {
	        				defer.resolve();            			
	        				location.reload();
	        			});
	        			return defer.promise;
	            	}
	            };
	            
	            //주문상태에 따라서 버튼 숨김 유무
	            ordInfoDataVO.buttonHidden = function(code){
	            	if(code == '006' && this.ds.NO_MRK == 'SYMM170901_00001'){
	            		return false;
	            	}
	            	if(this.ds.CD_ORDSTAT < code){
	            		return true;
	            	}
	            	return false;
	            };
	            
	            //validation tooltip
	            $scope.myValidatorOptions = {
            		messages: {
            			lengthy: function(input) {
                            return input.data("lengthy-msg");
                        },
                        required: function(input) {
                            return input.data("required-msg");
                        }                        
                    },
                    rules: {
                    	lengthy: function(input) {
	                        if (input.is("[name=DC_CCLRSNCTT]")) {                   	
	                            return input.val().length < 1000;
	                        }
	                        return true;
                    	},
                    	required: function(input) {
                    		if (input.is("[name=DC_CCLRSNCTT]")) {                   	
                    			return input.val() !== "";
                    		}
                    		if (input.is("[name=CD_CCLRSN]")) {                     	
                    			return input.val() !== "";
                    		}
                    		return true;
                        }
                    }
	            };
	            	      	            
		        //초기 화면 로드시 조회
		        ordInfoDataVO.getInitializeOrdInfo();
            }]);
}());