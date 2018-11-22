(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdInfoCtrl", ["$stateParams", "$window", "$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "APP_MSG", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.ShpStdbyOrdSvc", "Util03saSvc",  
            function ($stateParams, $window, $scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, APP_MSG, $timeout, resData, Page, UtilSvc, MenuSvc, ShpStdbyOrdSvc, Util03saSvc) {
	            //var page  = $scope.page = new Page({ auth: resData.access }),
		        //    today = edt.getToday();
	            
	            //취소사유 마켓에 맞게 드랍다운리스트로 정렬해줌
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
	        	                	if($stateParams.rootMenu !== "saOrd"){
		        	                	ShpStdbyOrdSvc.shplistInfo(param).then(function (res) {
		        	                		if(res.data.length > 0){
		        	                			e.success(res.data);
		        	                		}else{
		        	                			if(confirm("택배사를 등록해 주세요.\n확인을 누르시면 택배사 관리페이지로 이동합니다.")){
		        	                				//$state.go("app.syPars", { menu: true, ids: null });
		        	                				$state.go("app.syPars", { mrk: ordInfoDataVO.noMrk, menu: true, ids: null });
		        	                			}else{
		        	                				e.success([]);
		        	                				e.success([{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}]);
		        	                			}
		        	                		}
	                        			}, function(err){
	                        				alert("택배사 로딩 오류");
	                						e.error([]);
	                					});	        	                		
	        	                	}else{
	        	                		e.success([]);
	        	                	}
	        	                }
	        	           }
	        	        },
	        			dataTextField: "NM_PARS_TEXT",
                        dataValueField: "CD_PARS",
                    	valuePrimitive: false,
                    	optionLabel : "-- 택배사를 선택해 주세요 --",
                        change : function(e){
                        	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
                        		//$state.go("app.syPars", { menu: true, ids: null });
                        		$state.go("app.syPars", { mrk: ordInfoDataVO.noMrk, menu: true, ids: null });
                        	}
                        }
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
	        		},
	        		resChk : true 
		        };
	            	            	            
	            //초기화시 취소사유코드 설정
	            ordInfoDataVO.getInitializeOrdInfoProc = function(){
	            	var	self = this, 
	            		param = { NO_ORD: this.noOrd },
    					cclRsnParam = {
	    					lnomngcdhd: "SYCH00056",
	    					lcdcls: "SA_000015",
	    					customnoc: "00000"
    	    			};
	            	
	            	saOrdSvc.orderInfo(param).then(function (res) {
        				if(res.data.NO_ORD){
        					self.ds = res.data;
        					self.noMrk = self.ds.NO_MRK;
        					cclRsnParam.mid = self.ds.NO_MNGMRK;
        	            	//취소 사유 코드 드랍 박스 실행	
    	        			UtilSvc.getCommonCodeList(cclRsnParam).then(function (res) {
    	        				if(res.data){
    	        					self.cancelCodeOptions.dataSource = res.data.filter(function(ele){
    	        						return (!ele.DC_RMK2);
    	        					});
    	        					self.cancelCodeSubOptionsArray = res.data.filter(function(ele){
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
        				}else{
        					alert("조회된 데이터가 없습니다.");
        				}
        			});	
	            };
	            	            
	            //유효성 검사
		        ordInfoDataVO.valid = function(stat){
		        	var me = this;
		        	if(me.ds.CD_ORDSTAT === "002" || me.ds.CD_ORDSTAT === "003"){
		        		if(!me.ds.CD_PARS){
			        		//angular.element("input[name=CD_PARS]").focus();
		            		return false;
		            	}
		            	if(!me.ds.NO_INVO || this.ds.NO_INVO.length > 30 || this.ds.NO_INVO.length < 3){
		            		//angular.element("input[name=NO_INVO]").focus();
		            	    return false;
		            	}
		            	if(!me.ds.CD_PARS){
		            		return false;
		            	}
		            	if(me.ds.CD_PARS){
		            		return $scope.myValidatorOptions.rules.reg(angular.element("[name=NO_INVO]")); 
		            	}
		        	}
	            	return true;
		        };
	            
		        //초기화 
	            ordInfoDataVO.getInitializeOrdInfo = function(){
	            	var me = this, 
	            		menu = "",
	            		param = {
							lnomngcdhd: "SYCH00048",
							lcdcls: "SA_000007",
    	    				customnoc: "00000"
						};
	            		            	
	            	me.kind = $stateParams.kind;
	            	me.noOrd = $stateParams.noOrd;
	            	me.noMrkord = $stateParams.noMrkord;
	            	//me.noMrk = $stateParams.noMrk;
	            	me.rootMenu = $stateParams.rootMenu;
	            	
	            	//주문상태 드랍 박스 실행	
	    			UtilSvc.getCommonCodeList(param).then(function (res) {
	    				if(res.data){
	    					ordInfoDataVO.ordStatusOp = res.data;
	    				}
	    			});
	    			
	            	menu = (me.rootMenu === "saOrd") ? "신규주문" : "베송준비";
	            	
	            	me.mBoxTitle = "주문·배송 / "+menu+" 상세";
	            			           
	            	if(me.noOrd && me.rootMenu){
	            		me.getInitializeOrdInfoProc();
	            	}else{
	                    me.goBack(me.rootMenu);	                    
	            	};
		        };		        
		        
		        //잘못된 주문정보로 들어왔을때 뒤로가기
		        ordInfoDataVO.goBack = function(root) {
		        	if(!root){
		        		root = this.rootMenu;
		        	};		        	
		        	$state.go("app."+root, { kind: null, menu: true, noOrd : null, noMrkord: null});	 
		        };
		        		        		        	
		        //팝업창 옵션 설정
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
		        
		        //주문 취소시 팝업 오픈 
		        ordInfoDataVO.ordCancelPopOptionsOpen = function(e){
		        	var win = $scope.win;
		        	
		        	win.center();
	            	win.open();
	            	//ie에서는 택배사와 송장번호 유효성검사가 계속 떠서 아래와 같이 처리함
	            	ordInfoDataVO.ordCancelPopOptionsOpenChk = true;
	            };

	            //팝업창 닫고 변수들 초기화
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
	            	var me = this;       	
	            	saOrdSvc.orderInfoCancel($q.defer(), me).then(function (res){
            			if(res){
            				alert(res);
            			};
            		});
	            };
	            	            
	            //주문확정
	            ordInfoDataVO.doOrdConfirm = function(){
	            	var me = this;
	            	if(confirm("현재 주문을 확정 하시겠습니까?")){
	            		var param = {
	            				data: [$.extend({ROW_CHK: true}, ordInfoDataVO.ds)] 
	            			};
	            		
	    				saOrdSvc.orderConfirm(param).then(function (res) {
	        				//location.reload();
	    					$state.go("app.saOrd", { kind: null, menu: null, rootMenu : "saShpStdbyOrd", noOrd : param.data[0].NO_ORD, noMrkord: param.data[0].NO_MRKORD });	    						   
	        			});
	            	};
	            };

	            //배송정보 등록	
	            ordInfoDataVO.shpInfoReg = function(){
	            	var me = this, rtnMsg = "";
	            	
	            	if(!me.valid('003')){
	            		return false;
	            	}
	            	else if(confirm("배송정보를 등록 하시겠습니까?")){
	            		saOrdSvc.orderInfoShipInfoReg($q.defer(), me).then(function (res){
	            			if(res){
	            				alert(res);
	            			};
	            		});
	            	};
	            };
	            
	            //주문상태에 따라서 버튼 숨김 유무
	            ordInfoDataVO.buttonHidden = function(code){
	            	var me = this;
	            	if(code === "002" && me.ds.CD_ORDSTAT !== "002"){
	            		return false;
	            	};
	            	if((code === "001" || code === "003" )&& me.ds.CD_ORDSTAT > code){
	            		return false;
	            	};
	            	if(code === "004" && (me.ds.CD_ORDSTAT === "001" || me.ds.CD_ORDSTAT === "006")){
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
                        },
                        response: function(input) {
                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.data("response-msg");
                        }
                    },
                    rules: {
                    	lengthy: function(input) {
	                        if (input.is("[name=NO_INVO]")) {                 	
	                            return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : (input.val().length < 31 && input.val().length > 3);
	                        }
	                        if (input.is("[name=DC_CCLRSNCTT]")) {
	                            return (input.val().length < 1000 && input.val().length > 4);
	                        }	        
	                        return true;
                    	},
                    	required: function(input) {
                    		if (input.is("[name=NO_INVO]")) {                   	
                    			return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.val().trim();
                    		};
                    		if (input.is("[name=CD_PARS]")) { 	
                    			return (ordInfoDataVO.ordCancelPopOptionsOpenChk) ? true : input.val().trim();
                    		};
                    		if (input.is("[name=CD_CCLLRKRSN]")) {       	
                    			return input.val().trim();
                    		};
                    		if (input.is("[name=CD_CCLRSN]")) {
                    			return input.val().trim();
                    		};
                    		if (input.is("[name=DC_CCLRSNCTT]")) {
                    			return input.val().trim();
                    		};
                    		return true;
                        },
                        reg : function(input) {
                        	if(ordInfoDataVO.ordCancelPopOptionsOpenChk) return true; 
                        	                        	
                        	var regTest = /^(([\d]+)\-|([\d]+))+(\d)+$/;
                        	var iValue = input.val().trim();
             			         
                    		if (input.is("[name='NO_INVO']") && iValue && !regTest.test(iValue.trim())) {
             				    return false;
             				};
							return true;
                        },
                        response : function(input){
                        	var iValue = input.val().trim();
                        	
                        	if (input.is("[name='NO_INVO']") && iValue && !ordInfoDataVO.resChk) {
             				    return false;
             				};
             				return true;
                        }
                    }
	            };
	            	      	            
		        //초기 화면 로드시 조회
		        ordInfoDataVO.getInitializeOrdInfo();
            }]);
}());