(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    		
    angular.module("sa.ShpStdbyOrd.controller")
        .controller("sa.ShpStdbyOrdInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "sa.ShpStdbyOrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.OrdSvc",
            function ($stateParams, $scope, $state, $http, $q, $log, ShpStdbyOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, saOrdSvc) {	            
        	    		
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
	            
            	//취소 사유 코드 드랍 박스 실행	
            	var cancelReasonCode = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00056",
    					lcdcls: "SA_000015"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordInfoDataVO.cancelCodeOptions.dataSource = res.data;
        					ordInfoDataVO.inputs.CD_CCLRSN = res.data[0];
        				}
        			});
	            }());       
            	
	            var ordInfoDataVO = $scope.ordInfoDataVO = { 	
	        		kind : "",
	        		no: "",
	        		noOrd : "",
	        		noMrkord : "",
	        		noMrk : "",
	        		ds : {},
	        		ordStatusOp : {},
	        		cancelCodeOptions : {
	        			dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF"
	        		},
	        		shpCodeOptions : {
	        			dataSource: {
	        	            transport: {
	        	                read: function(e){
	        	                	var param = {	  
	        	                		NO_MRK: $stateParams.noMrk
                                    };
	        	                	ShpStdbyOrdSvc.shplist(param).then(function (res) {
	        	                		if(res.data.length >= 1){  
	        	                			e.success(res.data);    
	        	                		}
                        			});
	        	                }
	        	              }
	        	        },
	        			dataTextField: "NM_PARS_TEXT",
                        dataValueField: "CD_PARS",
                    	valuePrimitive: false,
                    	autoBind: true
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
	            	
	            	ShpStdbyOrdSvc.shpbyordInfo(param).then(function (res) {   		
        				if(res.data.NO_ORD){        					
        					ordInfoDataVO.ds = res.data;
        					
        					$timeout(function(){
        						if(res.data.CD_PARS){
    								var selectDDL = angular.element("#CD_PARS").data("kendoDropDownList");
        							selectDDL.value(res.data.CD_PARS);
        							selectDDL.trigger("change");
	    						}
        					},0);        					
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
	            	me.noMrk = $stateParams.noMrk;
		           
	            	if(me.noOrd && me.noMrkord){
	            		me.getInitializeOrdInfoProc();
	            	}else{
	                    me.goBack();	                    
	            	}
		        };
		        
		        ordInfoDataVO.goBack = function() {
		        	$state.go("app.saShpStdbyOrd", { kind: null, menu: true, noOrd : null, noMrkord: null, noMrk: null});	 
		        };		        		  
	            	      	            
		        //초기 화면 로드시 조회
		        ordInfoDataVO.getInitializeOrdInfo();
		        
		        //유효성 검사
		        ordInfoDataVO.valid = function(stat){
		        	if(!this.ds.CD_PARS){
		        		angular.element("input[name=CD_PARS]").focus();
	            		return false;
	            	}
	            	if(!this.ds.NO_INVO || this.ds.NO_INVO.length > 100){
	            		angular.element("input[name=NO_INVO]").focus();
	            	    return false;
	            	}
	            	/*if(this.ds.CD_ORDSTAT !== stat){
	            		alert('주문 상태를 확인 후 등록을 해주세요.');
	            	    return false;
	            	}*/	            	
	            	if(!this.ds.NO_APVL){
            			alert('마켓 결제번호가 있는 주문만 전송 가능합니다.');
            			return false;
	            	}
	            	return true;
		        };
		        
		        //송장 출력
	            ordInfoDataVO.shpOutPrint = function(){
	            	if(!this.valid('002')) return;
	            	
	            	if(confirm("송장을 출력 하시겠습니까?")){
	            		var defer = $q.defer(),
	            			param = [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)];
		            		
	            		//console.log(param);
    				        				
	            		ShpStdbyOrdSvc.noout(param).then(function (res) {
            				defer.resolve();            			
            				location.reload();
            			});	            		
            			return defer.promise;
	            	}
	            };
	            
	            //배송정보 등록	
	            ordInfoDataVO.shpInfoReg = function(){
	            	if(!this.valid('003')) return;
	            	
	            	if(confirm("배송정보를 등록 하시겠습니까?")){
	            		var defer = $q.defer(),
	            			param = [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)];
	            		
	            		ShpStdbyOrdSvc.shpInReg(param).then(function (res) {
            				defer.resolve();            		
            				location.reload();
            			});
	        			return defer.promise;
	            	}
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
		            		alert("주문취소 코드를 선택해주세요.");
		            		return;
		            	}
		            	if(this.inputs.DC_CCLRSNCTT === "" || this.inputs.DC_CCLRSNCTT.length > 1000){ 
		            		alert("주문취소 사유를 확인해주세요.");
		            	    return;
		            	}
		            	if(confirm("현재 주문을 취소 하시겠습니까?")){
		            		var defer = $q.defer(),
	        			 		param = $.extend(ordInfoDataVO.inputs, ordInfoDataVO.ds);
	    				
	        				saOrdSvc.orderCancel(param).then(function (res) {
	            				defer.resolve();            				
	            				ordInfoDataVO.ordCancelPopOptionsClose();
	            				location.reload();
	            			});
	            			return defer.promise;
		            	}
		            };
	            
	            //주문상태에 따라서 버튼 숨김 유무
	            /*ordInfoDataVO.buttonHidden = function(code){
	            	if(this.ds.CD_ORDSTAT === code){
	            		return true;
	            	}
	            	return false;
	            };
	            */
	            
	            //validation tooltip
	            $scope.myValidatorOptions = {
            		messages: {
            			lengthy: function(input) {
                            return input.data("lengthy-msg");
                        },
                        required: function(input) {
                            return input.data("required-msg");
                        },
                        reg: function(input) {
                            return input.data("reg-msg");
                        } 
                    },
                    rules: {
                    	lengthy: function(input) {
	                        if (input.is("[name=NO_INVO]")) {                 	
	                            return (input.val().length < 100 && input.val().length > 2);
	                        }	                        
	                        return true;
                    	},
                    	required: function(input) {
                    		if (input.is("[name=NO_INVO]")) {                   	
                    			return input.val();
                    		}
                    		if (input.is("[name=CD_PARS]")) {                     	
                    			return input.val();
                    		}
                    		return true;
                        },
                        reg : function(input) {
                        	//var regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
                        	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
                        	
                        	if (input.is("[name='NO_INVO']") && !regTest.test(input.val())) {
							    return false;
							};
							return true;
                        }
                    }
	            };
            }])
            
            //currency util
		    .directive('kendoCustomCurrencyDirective', function($timeout) {
		        return {
		            restrict: 'E',
		            scope:{
	                	val: '@',
	                	decimal: '@'	
	                },
		            link: function (scope, element) {
			            $timeout(function() {			            	
			            	element.text(kendo.toString(parseInt(scope.val), scope.decimal));
			            });
		            }
		     };});
}());
