(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdInfoCtrl", ["$stateParams", "$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.ShpStdbyOrdSvc", 
            function ($stateParams, $scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, ShpStdbyOrdSvc) {
	            //var page  = $scope.page = new Page({ auth: resData.access }),
		        //    today = edt.getToday();
        	        		
	            //주문상태 드랍 박스 실행	
	            var orderStatus = (function(){
					var param = {
						lnomngcdhd: "SYCH00048",
						lcdcls: "SA_000007"
					};
	    			UtilSvc.getCommonCodeList(param).then(function (res) {
	    				if(res.data){
	    					ordInfoDataVO.ordStatusOp = res.data;
	    				}
	    			});
            	}());
	            
	            var ordInfoDdlChgEvt = function(e){
	            	var cdDef = this.dataItem().CD_DEF,
    					dcRmk1 = this.dataItem().DC_RMK1,
	            	    selectSubCclDDL = angular.element("select[name='CD_CCLLRKRSN']").data("kendoDropDownList");
	            	
	            	if(selectSubCclDDL){
	            		selectSubCclDDL.dataSource.data(ordInfoDataVO.cancelCodeSubOptionsArray.filter(function(ele){
		            		return (ele.DC_RMK2 === cdDef) && (ele.DC_RMK1 === dcRmk1);
		            	}));
	            	}  
	            };	
	               
	            var ordInfoDataVO = $scope.ordInfoDataVO = {
	            	mBoxTitle : "",
	        		kind : "",
	        		no: "",
	        		noOrd : "",
	        		noMrkord : "",
	        		rootMenu : "",
	        		ds : {},
	        		ordStatusOp : {},
	        		cancelCodeOptions : {
	        			dataSource: [],
                		optionLabel : "취소사유코드를 선택해 주세요 ",	 
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        valuePrimitive : true,
                        change : ordInfoDdlChgEvt
	        		},
	        		cancelCodeSubOptions : {
	        			dataSource: [],
                		optionLabel : "하위 취소사유코드를 선택해 주세요 ",	 
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        valuePrimitive : true
	        		},
	        		cancelCodeSubOptionsArray : [],
	        		shpCodeOptions : {
	        			dataSource: {
	        	            transport: {
	        	                read: function(e){
	        	                	var param = {	  
	        	                		NO_ORD : $stateParams.noOrd
                                    };	        	           
	        	                	ShpStdbyOrdSvc.shplistInfo(param).then(function (res) {
	        	                		if(res.data.length > 0){
	        	                			e.success(res.data);    
	        	                		}else{
	        	                			e.error([]);
	        	                			alert("택배사를 설정해 주세요.");
	        	                		}
                        			}, function(err){
                						e.error([]);
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
	        			CD_CCLLRKRSN : "",
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
        	        				if(res.data){
        	        					ordInfoDataVO.cancelCodeOptions.dataSource = res.data.filter(function(ele){
        	        						return (!ele.DC_RMK2);
        	        					});
        	        					ordInfoDataVO.cancelCodeSubOptionsArray = res.data.filter(function(ele){
        	        						return (ele.DC_RMK2);
        	        					});
        	        				}
        	        			});        	        			

            					$timeout(function(){
            						var selectDDL = angular.element("#CD_PARS").data("kendoDropDownList");
            						
            						if(res.data.CD_PARS && selectDDL){        								
            							selectDDL.value(res.data.CD_PARS);
            							selectDDL.trigger("change");
            						}
            					},0); 
        		            });
        	            	cancelReasonCode();        	            	
        				}else{
        					alert("조회된 데이터가 없습니다.");
        				}
        			});	
	            };
	            
	            //송장 출력
	            ordInfoDataVO.shpOutPrint = function(){
	            	if(!this.valid('002')) return;
	            	
	            	if(confirm("송장을 출력 하시겠습니까?")){
	            		var defer = $q.defer(),
	            			param = [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)];
		            		    				        				
	            		ShpStdbyOrdSvc.noout(param).then(function (res) {
            				defer.resolve();            			
            				location.reload();
            			}, function(err){
    						e.error([]);
    					});	            		
            			return defer.promise;
	            	}
	            };
	            
	            //배송정보 등록	
	            ordInfoDataVO.shpInfoReg = function(){
	            	if(!this.valid('003')) return false;
	            	            	
	            	if(confirm("배송정보를 등록 하시겠습니까?")){
	            		var defer = $q.defer(),
	            			param = [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)];
	            		
	            		ShpStdbyOrdSvc.shpInReg(param).then(function (res) {
            				defer.resolve();            		
            				location.reload();
            			}, function(err){
    						e.error([]);
    					});
	        			return defer.promise;
	            	}
	            };
	            
	            //유효성 검사
		        ordInfoDataVO.valid = function(stat){
		        	if(this.ds.CD_ORDSTAT === "002"){
		        		if(!this.ds.CD_PARS){
			        		//angular.element("input[name=CD_PARS]").focus();
		            		return false;
		            	}
		            	if(!this.ds.NO_INVO || this.ds.NO_INVO.length > 20 || this.ds.NO_INVO.length < 8){
		            		//angular.element("input[name=NO_INVO]").focus();
		            	    return false;
		            	}
		            	if(!this.ds.CD_PARS){
		            		return false;
		            	}
		            	if(this.ds.CD_PARS){            			            		
		            		return $scope.myValidatorOptions.rules.reg(angular.element("[name=NO_INVO]")); 
		            	}
		        	}
	            	return true;
		        };
	            
	            ordInfoDataVO.getInitializeOrdInfo = function(){
	            	var me = this;
	            	var menu = "";
	            	
	            	me.kind = $stateParams.kind;
	            	me.noOrd = $stateParams.noOrd;
	            	me.noMrkord = $stateParams.noMrkord;
	            	me.noMrk = $stateParams.noMrk;
	            	me.rootMenu = $stateParams.rootMenu;
	            	
	            	menu = (me.rootMenu === "saOrd") ? "신규주문" : "베송준비";
	            	
	            	me.mBoxTitle = "주문·배송 / "+menu+" 상세";
	            			           
	            	if(me.noOrd && me.noMrkord && me.rootMenu){
	            		me.getInitializeOrdInfoProc();
	            	}else{
	                    me.goBack(me.rootMenu);	                    
	            	}
		        };		        
		        
		        ordInfoDataVO.goBack = function(root) {
		        	if(!root){
		        		root = this.rootMenu;
		        	};		        	
		        	$state.go("app."+root, { kind: null, menu: true, noOrd : null, noMrkord: null});	 
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
		        ordInfoDataVO.ordCancelPopOptionsOpen = function(e){
		        	var win = $scope.win;
		        	
		        	win.center();
	            	win.open();
	            	//ie에서는 택배사와 송장번호 유효성검사가 계속 떠서 아래와 같이 처리함
	            	ordInfoDataVO.ordCancelPopOptionsOpenChk = true;
	            };
	            
	            //pop up close
	            ordInfoDataVO.ordCancelPopOptionsClose = function(){
		        	var win = $scope.win;
		        			        	
		        	win.close();
		        	
		        	this.inputs.cancel_reason_code = "";
		        	this.inputs.cancel_reason_text = "";

		        	this.inputs.DC_CCLRSNCTT = "";
		        	this.inputs.CD_CCLLRKRSN = "";
		        	this.inputs.CD_CCLRSN = "";
		        	
		        	$("span.k-tooltip-validation").hide();
		        	ordInfoDataVO.ordCancelPopOptionsOpenChk = false;
	            };
	            
	            //주문취소
	            ordInfoDataVO.doOrdCancel = function(){
	            	if(!this.inputs.CD_CCLRSN){
	            		//alert("주문취소코드를 선택해주세요.");
	            		return false;
	            	}
	            	if(!this.inputs.CD_CCLLRKRSN.CD_DEF && this.inputs.CD_CCLLRKRSN.NM_DEF){
	            		//alert("하위 주문취소코드를 선택해주세요.");
	            		return false;
	            	}
	            	if(!this.inputs.DC_CCLRSNCTT || this.inputs.DC_CCLRSNCTT.length < 4 || this.inputs.DC_CCLRSNCTT.length > 1000){  
	            		//alert("주문취소사유를 5자 이상 1000자 이하로 작성해 주세요.");
	            	    return false;
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
	            	            
	            ordInfoDataVO.doOrdConfirm = function(){
	            	if(confirm("현재 주문을 확정 하시겠습니까?")){
	            		var defer = $q.defer(),
    			 			param = {
	            				data: [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)] 
	            			};
	            		
	    				saOrdSvc.orderConfirm(param).then(function (res) {
	        				defer.resolve();            			
	        				location.reload();
	        			});
	        			return defer.promise;
	            	}
	            };
	            
	            //주문상태에 따라서 버튼 숨김 유무
	            ordInfoDataVO.buttonHidden = function(code){
	            	if(code === "002" && this.ds.CD_ORDSTAT < code){
	            		return false;
	            	};
	            	if((code === "001" || code === "003" )&& this.ds.CD_ORDSTAT > code){
	            		return false;
	            	};
	            	if(code === "004" && this.ds.CD_ORDSTAT === "001"){
	            		return false;
	            	};
	            	return true;
	            };
	            
	            //validation tooltip
	            $scope.myValidatorOptions = {
            		messages: {                        
                        lengthy: function(input) {
                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.data("lengthy-msg");
                        },
                        required: function(input) {
                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.data("required-msg");
                        },
                        reg: function(input) {
                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.data("reg-msg");
                        } 
                    },
                    rules: {
                    	lengthy: function(input) {
	                        if (input.is("[name=NO_INVO]")) {                 	
	                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : (input.val().length < 20 && input.val().length > 8);
	                        }
	                        if (input.is("[name=DC_CCLRSNCTT]")) {                 	
	                            return (input.val().length < 1000 && input.val().length > 4);
	                        }	        
	                        return true;  
                    	},
                    	required: function(input) {
                    		if (input.is("[name=NO_INVO]")) {                   	
                    			return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.val();
                    		}
                    		if (input.is("[name=CD_PARS]")) {                     	
                    			return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.val();
                    		}
                    		if (input.is("[name=CD_CCLLRKRSN]")) {                   	
                    			return input.val();
                    		}
                    		if (input.is("[name=CD_CCLRSN]")) {                     	
                    			return input.val();
                    		}
                    		if (input.is("[name=DC_CCLRSNCTT]")) {                     	
                    			return input.val();
                    		}                    		
                    		return true;
                        },
                        reg : function(input) {
                        	
                        	if(ordInfoDataVO.ordCancelPopOptionsOpenChk) return true; 
                        	
                        	//var regTest = /^[0-9]{1}[0-9\-]+[0-9]{1}$/;
                        	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
							var valicolunm = "reg";
							var iValue = input.val();
                        	
                        	if (input.is("[name='NO_INVO']") && !regTest.test(input.val())) {
							    return false;
							};															
							if (ordInfoDataVO.ds.CD_PARS && input.is("[name='NO_INVO']") && input.val()) {
								var parsName = ordInfoDataVO.ds.CD_PARS.NM_PARS;
								
								if (parsName == "기타택배") {
									var pattern1 = /^[0-9a-zA-Z]{9,12}$/i;
									var pattern2 = /^[0-9a-zA-Z]{18}$/i;
									var pattern3 = /^[0-9a-zA-Z]{25}$/i;
									
									if (iValue.search(pattern1) == -1 && iValue.search(pattern2) == -1 && iValue.search(pattern3) == -1) {
									   input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
									   return false;
									}
								} else if (parsName === "EMS") {
									   var pattern = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
									   if (iValue.search(pattern) == -1) {
									     input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
									     return false;
									   }	
								} else if (parsName === "한진택배" || parsName == "현대택배") {
										if (!$.isNumeric(iValue)) {
										    input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
										    return false;
										} else if ( iValue.length != 10 && iValue.length != 12 ) {
										    input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호는 10자리 또는 12자리의 숫자로 입력해주세요.");
										    return false;
										}		
								} else if (parsName === "경동택배") {
									    if (!$.isNumeric(iValue)) {
										    input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
										    return false;
									    }else if (iValue.length != 9 && iValue.length != 10 && iValue.length != 11) {
									    	input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 9자리 또는 10자리 또는 11자리의 숫자로 입력해주세요.");
									    	return false;
									    }
								} else if (parsName === "이노지스택배") {
									    if (!$.isNumeric(iValue)) {
										     input.attr("data-"+valicolunm+"-msg", "운송장 번호는 숫자만 입력해주세요.");
										     return false;
									    } else if (iValue.length > 13) {
										    input.attr("data-"+valicolunm+"-msg",parsName+"의 운송장 번호는 최대 13자리의 숫자로 입력해주세요.");
										    return false;
									    }
								} else if (parsName == "TNT Express") {
									var pattern1 = /^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$/;
									var pattern2 = /^[0-9]{9}$/;
									if (iValue.search(pattern1) == -1 && iValue.search(pattern2) == -1) {
										input.attr("data-"+valicolunm+"-msg", parsName+"의 운송장 번호 패턴에 맞지 않습니다.");
										return false;
									}
								};
							}
							return true;
                        }
                    }
	            };
	            	      	            
		        //초기 화면 로드시 조회
		        ordInfoDataVO.getInitializeOrdInfo();
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
		            	var val = scope.val;
		            	
		            	if(!angular.isNumber(val) && !val){
		            		val = 0;
		            	}
		            	
			            $timeout(function() {			            	
			            	element.text(kendo.toString(parseInt(val), scope.decimal));
			            });
		            }
		     };});
}());