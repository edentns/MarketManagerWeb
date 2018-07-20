(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.EchgReq.controller : sa.EchgReqCtrl
     * 상품분류관리
     */
    angular.module("sa.EchgReq.controller")
        .controller("sa.EchgReqCtrl", ["$scope", "$state", "$http", "$q", "$log", "sa.EchgReqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "$window",  "Util03saSvc", "APP_MSG",   
            function ($scope, $state, $http, $q, $log, saEchgReqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, $window, Util03saSvc, APP_MSG) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	           
	            var grdField =  {
                    ROW_CHK       		: { type: "bolean"    , editable: true , nullable: false },
                    NO_ORD        		: { type: "string"    , editable: false, nullable: false },
                    NO_APVL       		: { type: "string"    , editable: false, nullable: false },
                    NM_MRK        		: { type: "string"    , editable: false, nullable: false },
                    NO_MRKORD     		: { type: "string"    , editable: false, nullable: false },
                    NO_MRKITEMORD   	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKITEM    		: { type: "string"    , editable: false, nullable: false },
                    NO_MRKREGITEM 		: { type: "string"    , editable: false, nullable: false },
                    NM_MRKITEM    		: { type: "string"    , editable: true , nullable: false },
                    NM_MRKOPT     		: { type: "string"    , editable: false, nullable: false },
                    QT_ORD        		: { type: "number"    , editable: false, nullable: false },
                    QT_ECHG       		: { type: "string"    , editable: false, nullable: false },                    
                    AM_ORDSALEPRC 		: { type: "number"    , editable: false, nullable: false },
                    NM_PCHR       		: { type: "string"    , editable: true , nullable: false },
                    NM_CONS      		: { type: "string"    , editable: false, nullable: false },
                    NO_PCHRPHNE  		: { type: "string"    , editable: false, nullable: false },                    
                    DC_PCHREMI    		: { type: "string"    , editable: false, nullable: false },
                    NO_CONSPHNE   		: { type: "string"    , editable: false, nullable: false },                    
                    DC_CONSNEWADDR		: { type: "string"    , editable: false, nullable: false },                    
                    CD_ORDSTAT    		: { type: "string"    , editable: false, nullable: false },
                    DC_SHPWAY     		: { type: "string"    , editable: false, nullable: false },
                    DTS_ORD       		: { type: "string"    , editable: false, nullable: false },                    
                    DTS_ECHGREQ   		: { type: "string"    , editable: false, nullable: false },
                    DTS_ECHGCPLT  		: { type: "string"    , editable: false, nullable: false },
                    DT_SND        		: { type: "string"    , editable: false, nullable: false },
                    DTS_ECHGAPPRRJT 	: { type: "string"    , editable: false, nullable: false },
                    NO_ECHGAPPRRJT  	: { type: "string"    , editable: false, nullable: false },
                    NO_ECHGCPLT   		: { type: "string"	  , editable: false, nullable: false },                    
                    YN_CONN       		: { type: "string"    , editable: false, nullable: false },
                    CD_ECHGSTAT   		: { type: "string"    , editable: false, nullable: false },
                    NO_ECHGREQ    		: { type: "string"    , editable: false, nullable: false },
                    DC_ECHGRSNCTT 		: { type: "string"    , editable: false, nullable: false },
                    NO_MRK        		: { type: "string"    , editable: false, nullable: false },
                    CODE		  		: { type: "string"	  , editable: false, nullable: false },
                    NO_MNGMRK	  		: { type: "string"	  , editable: false, nullable: false },
                    CD_ECHGHRNKRSN  	: { type: "string"	  , editable: false, nullable: false },
                    NM_ECHGHRNKRSN		: { type: "string"	  , editable: false, nullable: false },
        			CD_ECHGLRKRSN		: { type: "string"	  , editable: false, nullable: false },
        			NM_ECHGLRKRSN		: { type: "string"	  , editable: false, nullable: false },
        			CD_PARS				: { type: "string"	  , editable: false, nullable: false },
        			NO_INVO				: { type: "string"	  , editable: false, nullable: false },
        			CD_PARS_ECHG		: { type: "string"	  , editable: false, nullable: false },
        			NO_INVO_ECHG		: { type: "string"	  , editable: false, nullable: false },      
        			DC_ECHGSHPCOSTAPVL  : { type: "string"	  , editable: false, nullable: false },
        			NM_ORDSTAT    		: { type: "string"    , editable: false, nullable: false },
        			NM_ECHGSTAT    		: { type: "string"    , editable: false, nullable: false },
        			YN_ECHGTRANS   		: { type: "string"    , editable: false, nullable: false },
                    CD_ECHGRJTRSN 		: {
	                    					 type: "string"    
	                    					,editable: true
	                    					,nullable: false
	                    					,validation: {
												cd_echgrjtrsnvalidation: function (input) {
													if(echgDataVO.rejectShowCode.indexOf(echgDataVO.updateChange) > -1 && 
															["170106","170902"].indexOf(echgDataVO.curCode) > -1){
														if (input.is("[name='CD_ECHGRJTRSN']") && !input.val()) {
															input.attr("data-cd_echgrjtrsnvalidation-msg", "교환거부코드를 입력해 주세요.");
														    return false;
														};
													};
													return true;
												}
											}
	                    	              },
	                DTS_RECER 			: {
							            	 type: "date"
										    ,editable: true
										    ,nullable: false
										    ,validation: {
												dts_recervalidation: function (input) {
													if(echgDataVO.completeShowCode.indexOf(echgDataVO.updateChange) > -1){
														if (input.is("[data-role=datepicker]")){
															input.attr("data-dts_recervalidation-msg", "교환상품접수일자를 정확히 입력해 주세요.");
															Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "DTS_RECER");
														    return input.data("kendoDatePicker").value();
														};
													};
													return true;
												}
											}
	                      				  },
                    DC_ECHGRJTCTT 		: {
	                    					 type: "string"
	                    					,editable: true
	                    					,nullable: false
	                    					,validation: {
												dc_echgrjtcttvalidation: function (input) {
													if(echgDataVO.rejectShowCode.indexOf(echgDataVO.updateChange) > -1){
														if (input.is("[name='DC_ECHGRJTCTT']") && input.val() === "") {
															input.attr("data-dc_echgrjtcttvalidation-msg", "교한거부사유를 입력해 주세요.");
														    return false;
														};
														if (input.is("[name='DC_ECHGRJTCTT']") && input.val() !== "" && input.val().length > 200) {
															input.attr("data-dc_echgrjtcttvalidation-msg", "교환거부사유를 200자 이내로 입력해 주세요.");
														    return false;
														};
													};
													return true;
												}
											}
	                                      },
                  	CD_PARS_INPUT		: {
					                    	type: "array"
						     			   ,editable: true
						     			   ,nullable: false
						                   ,validation: {
						                	   cd_pars_inputvalidation: function (input) {
						                		   var getUid = input.parents("table").attr("data-uid"),
						            		   	       grid = $scope.echgkg,
									                   viewToRow = $("[data-uid='" + getUid + "']", grid.table),
								                       dataItem = grid.dataItem(viewToRow),
								                       me = echgDataVO;	
						                		   
						                		   if (input.is("[name='CD_PARS']") && (['170104','170102','170106','170902'].indexOf(me.curCode) > -1 && ["003"].indexOf(me.updateChange) > -1) || 
						            					   (me.sCode[0] === me.curCode && ["001","003"].indexOf(me.updateChange) > -1) ||
						            					   (me.sCode[0] === me.curCode && "004" === me.updateChange && dataItem.DC_ECHGSHPCOSTAPVL === '선결제 완료 (교환완료시 교환배송비 정산이 진행됩니다.)' && !me.receiveChk) ||
						            					   (me.sCode[0] === me.curCode && "004" === me.updateChange && me.receiveChk === true)){
												    	if (input.is("[name='CD_PARS']") && !input.val()) {
						                                	input.attr("data-cd_pars_inputvalidation-msg", "택배사를 입력해 주세요.");
						                                    return false;
						                                }
												    	if (input.is("[name='CD_PARS']") && input.val()) {
												    		Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "CD_PARS_INPUT");
														    return true;
						                                }
						                		   };
						                		   return true;					                		   
										    	}
											}
	                				      },
                	NO_INVO_INPUT		: {
					                    	type: "string"
							     		   ,editable: true
							     		   ,nullable: false
							               ,validation: {
							            	   no_invo_inputvalidation: function (input) {
							            		   var getUid = input.parents("table").attr("data-uid"),
							            		   	   grid = $scope.echgkg,
  									                   viewToRow = $("[data-uid='" + getUid + "']", grid.table),
									                   dataItem = grid.dataItem(viewToRow),
									                   me = echgDataVO;	
								                	
						            			   if (input.is("[name='NO_INVO']") && ((['170104','170102','170106','170902'].indexOf(me.curCode) > -1 && ["003"].indexOf(me.updateChange) > -1) || 
						            					   (me.sCode[0] === me.curCode && ["001","003"].indexOf(me.updateChange) > -1) ||
						            					   (me.sCode[0] === me.curCode && "004" === me.updateChange && dataItem.DC_ECHGSHPCOSTAPVL === '선결제 완료 (교환완료시 교환배송비 정산이 진행됩니다.)' && !me.receiveChk) ||
						            					   (me.sCode[0] === me.curCode && "004" === me.updateChange && me.receiveChk))){
						            				   var result = Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invo_inputvalidation');		
						            				   if(result){
						            					   Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "NO_INVO_INPUT");
						            				   };
						            				   return result;
					                               };	
											       return true;
							            	   	}
							               	 }
	                				       },
                	DC_TKBKRSNCTT		 : { 
							                 type: "string" 
						                 	,editable: true 
						                 	,nullable: false
						                 	,validation: {
						                 		dc_tkbkrsncttvalidation: function (input) {
						                 			if(["004"].indexOf(echgDataVO.updateChange) > -1 && input.is("[name='DC_TKBKRSNCTT']")){
														if (!input.val()) {
															input.attr("data-dc_tkbkrsncttvalidation-msg", "반품변경 상세사유를 입력해 주세요.");
														    return false;
														};
														if (input.val() && input.val().length > 200) {
															input.attr("data-dc_tkbkrsncttvalidation-msg", "반품변경 상세사유를 200자 이내로 입력해 주세요.");
														    return false;
														};
														Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "DC_TKBKRSNCTT");	
						                 			}	
													return true;
												}
											} 
							              },
                	CD_HOLD		     	: {
						                	type: "array"  
								     	   ,editable: true
								     	   ,nullable: false
								           ,validation: {
								        	   cd_holdvalidation: function (input) {
								        		   if(echgDataVO.gCode.indexOf(echgDataVO.curCode) > -1 && ["004"].indexOf(echgDataVO.updateChange) > -1){
								        			   if (input.is("[name='CD_HOLD']") && !input.val() && !echgDataVO.receiveChk) {
						                                	input.attr("data-cd_holdvalidation-msg", "보류사유를 입력해 주세요.");
						                                    return false;
						                                };
								        		   };
								        		   return true;
										    	}
							               }
               						      },
                    CD_HOLD_FEE	  		: {
						                	type: "number"  
							     		   ,editable: true
							     		   ,nullable: false
							               ,validation: {
							            	   cd_hold_feevalidation: function (input) {
							            		   if(echgDataVO.gCode.indexOf(echgDataVO.curCode) > -1 && ["004"].indexOf(echgDataVO.updateChange) > -1){
							            			   if (input.is("[name='CD_HOLD_FEE']") && (!input.val() || input.val() < 1) && echgDataVO.etcCostCode === 'Y') {
							            				   input.attr("data-cd_hold_feevalidation-msg", "반품비를 입력해 주세요.");
						                                   return false;
						                               };
							            		   };
											       return true;
										    	}
							                }
               						      },
               		RECEIVE_SET  		: {
						                   	 type: "string"
						                   	,editable: true
						                   	,nullable: false
						                   	,validation: {
						                   		receive_setvalidation: function (input) {
						                   			if(['170104','170102','170103','170902'].indexOf(echgDataVO.curCode) > -1 && ["003","004"].indexOf(echgDataVO.updateChange) > -1){
														if (input.is("[name=RECEIVE_SET]") && input.attr("required")) {
															if($("#receive-group").find("[type=radio]").is(":checked")){
																Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "RECEIVE_SET");	
																return true;
															}else{
																input.attr("data-receive_setvalidation-msg", "버튼을 선택해 주세요.");																												
																return false;																	
															} 														
										                };
						                   			};
													return true;
												}
						                   	 }	
					              		  },    
					transform_pay_reason: {
						                    	type: "string"  
							     			   ,editable: true
							     			   ,nullable: false
							                   ,validation: {
							                	   transform_pay_reasonvalidation: function (input) {
							                		   if(echgDataVO.eCode[0] === echgDataVO.curCode && "004" === echgDataVO.updateChange && input.is("[name='transform_pay_reason']")){
													    	if (!Util03saSvc.manualTkbkDataBind($scope.echgkg, input, "transform_pay_reason")) {
							                                	input.attr("data-transform_pay_reasonvalidation-msg", "(교환,반품)배송비 전달방법을 선택해 주세요.");
							                                    return false;
							                                };
							                		   };
							                		   return true;
											    	}
												}
						     				  }     
	            						};
	            
	            var echgDataVO = $scope.echgDataVO = {
            		boxTitle : "교환요청",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : resData.selected,
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		procName : { value: "" , focus: false },
	        		buyerName: { value: "" , focus: false },
	        		orderNo : { value: "" , focus: false },
	        		ordMrkNameOp : [],
	        		ordMrkNameMo : "*",
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",
	        		shipStatusOp : [],
	        		echgStatusOp : [],
	        		echgStatusMo : "",
	        		cdHoldFee : {
	        			min : "0", 
	        			max : "1000000",
	        			format : "C0",
	        			step : 100
	        		},
	        		cdEchgrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdParsDDL : {
	        			dataSource : [],
	        			autoBind: false,
                		dataTextField : "NM_PARS_TEXT",
                		dataValueField : "DC_RMK2",
                		optionLabel : "택배사를 선택해 주세요 ",
                		select : function(e){
                			var me = this;
                			$timeout(function(){
                				if(me.selectedIndex > 0){
	                				me.element.parents("table").find(".k-invalid-msg").hide();
	                			}
                			},0);
                		},
                        change : function(e){
                        	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
                        		$state.go("app.syPars", { mrk: echgDataVO.nowMrkName, menu: true, ids: null });
                        		$scope.echgkg.cancelRow();
                        	}
                        }
	        		},
	        		rjtDDL : {
	        			dataSource : [],
	        			autoBind: false,
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                		optionLabel : "교환거부코드를 선택해 주세요 ",	                    
	                    valuePrimitive: true
	        		},
	        		cdEchgrjtOp: [],
	        		dateOptions : {										//DATE PICKER
	        			parseFormats: ["yyyyMMddHHmmss"], 				
        	            animation: {
        	                close: {
        	                    effects: "fadeOut zoom:out",
        	                    duration: 300
        	                },
        	                open: {
        	                    effects: "fadeIn zoom:in",
        	                    duration: 300
        	                }
        	            },
        	            value : new Date()
	        		},
	        		userInfo : JSON.parse($window.localStorage.getItem("USER")).NM_EMP,
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd : "",
	        		param : "",	        		
	        		rejectDetailShowMrkCode : ['170106','170103'],
	        		rejectDivShowMrkCode : ['170106','170902'],
	        		rejectShowCode : ['002'],
	        		procShowMrkCode : ['170103','170104','170102','170902'],
	        		procShowCode : ['001','003','004'],
	        		completeShowMrkCode : ['170104','170102','170106','170103','170902'],
	        		completeShowCode : ['003'],
	        		receiveShowMrkCode : ['170902'],
	        		gCode : ['170104','170102'],
	        		eCode : ['170106'],
	        		sCode : ['170103'],
	        		cCode : ['170902'],
	        		nowMrkName : "",
	        		receiveChk : false,
	        		shpList : "",
	        		curCode : "",
	        		menualShwWrn : "",
	        		gHoldCode : "",
	        		etcCostName : "",
	        		etcCostCode : "",
	        		cd11stShippingFee : "",
	        		ddlDefaultOp : {
	        			enable : false
	        		}
	            };
	            
	            echgDataVO.initLoad = function (){
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00067",
        					lcdcls: "SA_000026",
	    					customnoc: "00000"   
        				},
        				cdEchgrsnParm = {
	    					lnomngcdhd: "SYCH00052",
	    					lcdcls: "SA_000011"
                		},
                		cdEchgrjtParm = {
	    					lnomngcdhd: "SYCH00068",
	    					lcdcls: "SA_000027",
	    					customnoc: "00000"
                		},
                		cdEchgstsParm = {
	    					lnomngcdhd: "SYCH00054",
	    					lcdcls: "SA_000013"
                		},
                		gHoldCodeParm = {
        					lnomngcdhd: "SYCH00074",
        					lcdcls: "SA_000029",
	    					customnoc: "00000"
                    	},
                		cd11stShippingFee = {
                			lnomngcdhd: "SYCH00092",
        					lcdcls: "SA_000031",
	    					customnoc: "00000"
                		};
                    $q.all([
            			UtilSvc.csMrkList().then(function (res) {
            				return res.data;
            			}),	
            			UtilSvc.getCommonCodeList(ordParam).then(function (res) {
            				return res.data;
            			}),
            			UtilSvc.getCommonCodeList(betParam).then(function (res) {
            				return res.data;
            			}),
            			//교환 사유 코드
            			/*UtilSvc.getCommonCodeList(cdEchgrsnParm).then(function (res) {
	        				return res.data;
	        			}),    	   */         
    	            	//교환 거부 코드
	        			UtilSvc.getCommonCodeList(cdEchgrjtParm).then(function (res) {
	        				return res.data;
	        			}),    	            
    	            	//교환 상태 코드
	        			UtilSvc.getCommonCodeList(cdEchgstsParm).then(function (res) {
	        				return res.data;
	        			}),    	            
    	            	//지마켓 보류 상태 
	        			UtilSvc.getCommonCodeList(gHoldCodeParm).then(function (res) {
	        				return res.data;
	        			}),    	            
    	            	//11번가 배송비 전달 방법
	        			UtilSvc.getCommonCodeList(cd11stShippingFee).then(function (res) {
	        				return res.data;
	        			})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF;
                        
                        //me.cdEchgrsnOp.dataSource = result[3];
                        me.cdEchgrjtOp = result[3];
                        me.echgStatusOp = result[4];
                        me.echgStatusMo = result[4][0].CD_DEF;
                        me.gHoldCode = result[5];
                        me.cd11stShippingFee = result[6];
                                                
                        $timeout(function(){
                        	echgDataVO.isOpen(false);
            				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                        },0);    
                    });
                };	        
	            
	            echgDataVO.ngIfdata = function(showCode, eqCode, inCode){
	            	var me = this,
	            	    shkChk = false,
	            	    eqChk = false;	            	   
	            	
	            	shkChk = showCode.indexOf(me.updateChange) > -1;
	            	eqChk = eqCode.indexOf(inCode) > -1;

	            	if(!echgDataVO.receiveChk && inCode === "170902" && me.updateChange !== "002"){
	            		return false;
	            	};	         
	            	return (shkChk && eqChk);
	            };  
	            	            
	            //조회
	            echgDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
    				    NM_MRKITEM : self.procName.value,
					    NO_MRK : self.ordMrkNameMo, 
					    CD_ORDSTAT : self.ordStatusMo,
					    NO_MRKORD : self.orderNo.value,      
					    NM_PCHR : self.buyerName.value,
					    CD_ECHGSTAT : self.echgStatusMo,
					    DTS_CHK : self.betweenDateOptionMo,  
					    DTS_FROM : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(self.datesetting.period.end.y, self.datesetting.period.end.m-1, self.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
					    NM_MRK_SELCT_INDEX : self.ordMrkNameOp.allSelectNames,
					    NM_ORDSTAT_SELCT_INDEX : self.ordStatusOp.allSelectNames,
					    DTS_SELECTED : self.datesetting.selected,
    					DTS_STORAGE_FROM: self.datesetting.period.start,
    					DTS_STORAGE_TO: self.datesetting.period.end,
					    CASH_PARAM : resData.storageKey
	            	};
	            	if(Util03saSvc.readValidation(self.param)){
	            		$scope.echgkg.dataSource.data([]);
		            	$scope.echgkg.dataSource.page(1);
        			};    	         			
	            };
		            
	            //초기화버튼
	            echgDataVO.inIt = function(){
            		var me  = this;
                	
	            	me.procName.value = "";
                	me.buyerName.value = "";
                	me.orderNo.value = "";
                	me.betweenDateOptionMo = me.betweenDateOptionOp[0].CD_DEF;
                	        			
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			
                	me.ordStatusOp.bReset = true;
                	me.ordMrkNameOp.bReset = true;
					me.receiveChk = false;
					me.etcCostCode = "";
                			        
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.echgkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            
	            echgDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 9 : 12;
	            	
	            	$scope.echgkg.wrapper.height(settingHeight);
            		$scope.echgkg.resize();
            		if(echgDataVO.param !== "") {
            			grdEchgVO.dataSource.pageSize(pageSizeValue);
            		}
	            };	            
	            
	            echgDataVO.receiveChkClkEvt = function(e){
	            	var element = $(e.currentTarget),
            			checked = element.val(),
            			self = this;
	            	   
	            	if(checked === 'N'){
		            	self.ngIfinIt(false);
	            	}
	            	else{
		            	self.ngIfinIt(true);
	            	};
	            	element.prop(checked,true);
	            };
		        
	            //ng if 초기화버튼
	            echgDataVO.ngIfinIt = function(yn){
            		var me  = this,
            			ddlHoldReasonCodeSel = angular.element($("select[name=CD_HOLD]"));
            		
                	me.etcCostCode = "";            
                	me.etcCostName = "";
                	me.receiveChk = yn;            
                	
                	kendo.ui.progress(angular.element($(".k-widget")), false);
                	
                	if(ddlHoldReasonCodeSel){            			
            			if(ddlHoldReasonCodeSel.length > 0 && me.receiveChk && ddlHoldReasonCodeSel.data("kendoDropDownList")){
                			$timeout(function(){                				               				
                				ddlHoldReasonCodeSel.data("kendoDropDownList").select(0);
                				ddlHoldReasonCodeSel.data("kendoDropDownList").trigger("change");    
                			},0);
                		};
                	}
	            };
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.echgkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.echgkg);
                };		
                
                $scope.popupUtil = function(e){
                	Util03saSvc.popupUtil.blur(e);
                };
                
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.echgkg;
    				var msg = {
						caseGACProcDisabled: "지마켓, 옥션, 쿠팡은 교환처리 기능을 사용할 수 없습니다.",	                						 
						caseGARjtDisabled: "지마켓, 옥션은 교환거부 기능을 사용할 수 없습니다.",
						caseCTransformDisabled: "쿠팡은 반품으로 변경 기능을 사용할 수 없습니다.",
						caseStatusChkAlert: "주문 상태를 확인해 주세요.",
						caseOneMoreThanOrdChk : "한 건의 주문을 선택해 주세요",
						notPossibleExchangeToReturn : "이미 반품에서 교환으로 변경된 주문입니다.\n반품으로 변경 처리를 할수 없습니다."
    				};
                	
	                if (widget === grd){
	                	widget.element.find(".k-grid-echg").on("click", function(e){
	                		if(grd.element.find(".k-grid-content input:checked").length != 1){
	                			alert(msg.caseOneMoreThanOrdChk);
	                			return false;
	                		};
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
                				grdItem = grd.dataItem(chked.closest("tr")),
	                			vali = function (arg){            			
			                				switch(arg){
			                					//교환 처리	
			                					case 1 : {
			                						if(['170104','170102','170902'].indexOf(grdItem.CODE) > -1){
			    			                    		alert(msg.caseGACProcDisabled);
			    			                    		return false;
			    			                    	}
			                						else if(!(['004','005'].indexOf(grdItem.CD_ORDSTAT) > -1 && grdItem.CD_ECHGSTAT === '001')){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			};			    		                			
			    		                			return true;
			    		                			break;
			                					};
			                					//교환거부
			                					case 2 : {
			                						if(['170104','170102'].indexOf(grdItem.CODE) > -1){
			    			                    		alert(msg.caseGARjtDisabled);
			    			                    		return false;
			    			                    	}
			    			                    	else if(['170104','170102','170902'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_ECHGSTAT !== '001'){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			}
			    		                			else if(['170106'].indexOf(grdItem.CODE) > -1 && ['004','005','007','008','009'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_ECHGSTAT !== '001'){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			}
			    		                			else if(['170103'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || ['001','002'].indexOf(grdItem.CD_ECHGSTAT) < 0){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			};
			    		                			return true;
			    		                			break;
			                					};
			                					//교환완료
			                					case 3 : {
			                						if((['004','005','009'].indexOf(grdItem.CD_ORDSTAT)> -1 && ['002'].indexOf(grdItem.CD_ECHGSTAT) > -1 && ['170103','170106'].indexOf(grdItem.CODE) > -1) || 
			        		                    			(['004','005','009'].indexOf(grdItem.CD_ORDSTAT) > -1 && ['001','005'].indexOf(grdItem.CD_ECHGSTAT) > -1 && ['170104','170102','170902'].indexOf(grdItem.CODE) > -1)){				                			
			        		                    		grdItem.DTS_RECER = new Date();		                    		
			        		                		}
			                						else{
			        		                			alert(msg.caseStatusChkAlert);
			        		                			return false;
			        		                		};
			    		                			return true;
			    		                			break;
			                					};
			                					//반품으로 변경
			                					case 4 : {
			                						if('170902' === grdItem.CODE){
			    			                    		alert(msg.caseCTransformDisabled);
			    			                    		return false;
			    			                    	}//지옥
			                						else if(['170104','170102'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_ECHGSTAT !== '001'){
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			}//11번가
			    		                			else if(['170106'].indexOf(grdItem.CODE) > -1 && ['004','005','007','008','009'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_ECHGSTAT !== '001'){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			}//스토어팜
			    		                			else if(['170103'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || ['001','002'].indexOf(grdItem.CD_ECHGSTAT) < 0){			                				
			    		                				alert(msg.caseStatusChkAlert);
			    		                				return false;
			    		                			};
			    		                			//이미 교환에서 넘어온 주문
			    		                			if(grdItem.YN_ECHGTRANS === 'Y'){
			    			                    		alert(msg.notPossibleExchangeToReturn);
			    			                    		return false;
			    			                    	};
			    			                    	//90일 이상 주문건
			    		                			if(UtilSvc.diffDate(grdItem.DTS_ECHGREQ, new Date()) >= 90){
			    				            			alert(APP_MSG.caseNinetyDaysAlert);
			    			            			};
			    		                			return true;
			    		                			break;
			                					};
			                					default : {
			                						break; 
			                					}
			                				}
	                				}, 
	                			proc = function (px, curCode){
	                				if(grdItem.YN_CONN === 'N'){			                				
			                			alert(APP_MSG.caseNotReceiveResultOrd);
			                		};
				    	            echgDataVO.inputPopupHeaderTitle = Util03saSvc.popupHeaderTitle(curCode, grdItem.NM_MRK, "echg");
	                				grd.options.editable.window.width = px;
		                			echgDataVO.updateChange = curCode;
				                    grd.editRow(chked.closest("tr"));				    	            
	                			};
	                		
		                    if($(this).hasClass("confirm") && vali(1)){			//교환 처리		                    	
		                    	proc("550px", "001");	
		                    }
		                    else if($(this).hasClass("reject") && vali(2)){ 	//교환거부	
		                    	proc("550px", "002");		
		                    }
		                    else if($(this).hasClass("complete") && vali(3)){	//교환완료	
		                		proc("620px", "003");
		                    }  
		                    else if($(this).hasClass("change") && vali(4)){ 	//반품으로 변경	
		                    	proc("600px", "004");
		                    };
	                	});
	                }
                });    
	            
                //검색 그리드
	            var grdEchgVO = $scope.grdEchgVO = {
            		autoBind: false,
                    messages: {
                        requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "닫기"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                	boxTitle : "주문 목록",
                	pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataBound: function(e) {
                        this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음     
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },       
                    editable: {
                    	mode: "popup",
                		window : {
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#echg_popup_template").html())),
                		confirmation: false
                    },
                    edit: function(e){     
                    	var dataVo = $scope.echgDataVO,                    	                      	
	                	    code = e.model.CODE,
	                	    Type = dataVo.updateChange,
	                		selector = e.container;  
                    	
                    	var filterDsFunc = function(shipTypeCode){
        					var ds = "";
        					
                			if(shipTypeCode === 'rjt'){
                				ds = dataVo.cdEchgrjtOp.filter(function(ele){
        	            			return (ele.DC_RMK1 === e.model.NO_MNGMRK);
        	            		});
                				dataVo.rjtDDL.dataSource = ds;
                			}
                			else{
                				ds = dataVo.shpList.filter(function(ele){
	    	            			return (ele.DC_RMK1 === e.model.NO_MRK && ele.DC_RMK3 === shipTypeCode);
	    	            		});
                				dataVo.cdParsDDL.dataSource = !ds.length ? [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}] : ds;
                			}                			
                		};
                		
                    	switch(Type) {
                    		case "001" : {
                    			filterDsFunc('002');
                    			break;
                    		}
                    		case "002" : {
                    			filterDsFunc('rjt');  
                    			break;
                    		}
                    		case "003" : {
                    			filterDsFunc('003');
                    			break;
                    		}
                    		case "004" : {
                        		var	ddlHoldReasonCodeSel = e.container.find("select[name=CD_HOLD]");
                        		                    			
                    			if(ddlHoldReasonCodeSel.length > 0 && !dataVo.receiveChk){
                        			$timeout(function(){
                        				dataVo.receiveChk = true;
                        			},0);
                        		};   
                        		
                        		selector.find("select[name=CD_HOLD]").kendoDropDownList({
    		            			dataSource : dataVo.gHoldCode,
    		                		dataTextField : "NM_DEF",
    		                		dataValueField : "CD_DEF",
    		                		optionLabel : "보류사유를 선택해 주세요 ",
    		                		change : function(e){
    		                			var nmDef = this.dataItem().NM_DEF,
    		                			    dcRmk2 = this.dataItem().DC_RMK2;
    		                			
    		                			if(dcRmk2 !== 'Y'){
		                    				var nutxt = selector.find("input[name=CD_HOLD_FEE]").data("kendoNumericTextBox");
		                    				nutxt.value(0);
		                    			};
    		                			
    		                			$timeout(function(){
    		                				dataVo.etcCostCode = dcRmk2;
    		                				dataVo.etcCostName = nmDef;
    		                			},0);
    		                		}
    		            		});
                        		
                        		if(code === dataVo.eCode[0] && (e.model.NM_ECHGLRKRSN === "구매자" || e.model.NM_ECHGLRKRSN === "구매자 귀책")){                    				
                    				selector.find("select[name=transform_pay_reason]").kendoDropDownList({
    	    	            			dataSource : dataVo.cd11stShippingFee,
    	    	                		dataTextField : "NM_DEF",
    	    	                		dataValueField : "CD_DEF",
    	    	                		valuePrimitive: true,
    	    	                		optionLabel : "교환배송비 전달방법을 선택해 주세요 ",
    	    	                		select : function(e){
    	    	                			var me = this;
    	    	                			$timeout(function(){
    	    	                				if(me.selectedIndex > 0){
        	    	                				me.element.parents("table").find(".k-invalid-msg").hide();
        	    	                			}
    	    	                			},0);
    	    	                		}
    	    	            		});
                    			}                   			
                        		
                    			filterDsFunc('002');
                    			break;
                    		}
                    		default : {
                    			break;
                    		}	
                    	};
                    	
                    	dataVo.curCode = e.model.CODE;
                    	dataVo.nowMrkName = e.model.NO_MRK;
                    },
                    cancel: function(e){
                    	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                    	echgDataVO.receiveChk = false;
                    	echgDataVO.etcCostCode = "";
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#echg_template").html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#echg_template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#echg_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				saEchgReqSvc.orderList(echgDataVO.param).then(function (res) {    						
            						e.success(res.data.queryList);			
            						echgDataVO.shpList = res.data.queryShipList;
            					}, function(err){
            						e.error([]);
            					});                				
                			},
                			update: function(e){
                				var whereIn = ['004','005'],
                					whereInCp = ['002','005'],
                				    where11stIn = ['004','005','007','008','009'],
            				    	echgGrd = $scope.echgkg;
                				
                				switch(echgDataVO.updateChange){
	                				case '001' : {
	            						if(confirm("선택하신 주문을 교환 승인하시겠습니까?")){
	            							var defer = $q.defer(),
	            								param = e.data.models.filter(function(ele){
	            									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
	            								}),
	            								storefarmCode = param[0].CODE; 
	            							
	            							if(e.data.models.length !== param.length){
	            								alert("마켓 및 주문 상태를 확인해 주세요.");
	                    						return;
	            							};
	            							
	            							if(param[0].CD_PARS_INPUT && param[0].NO_INVO_INPUT){
	            								alert(APP_MSG.invcChkMsg);		            								
	            							};
	            							
	            							saEchgReqSvc.echgConfirm(param[0]).then(function (res) {
	                    						var rtnV = res.data,
	                    							allV = rtnV.allNoOrd,
	    	        							    trueV = rtnV.trueNoOrd,	    	        							    
	    	        							    falseV = rtnV.falseNoOrd;
	                    						
	                    						if(storefarmCode === "170103"){
	                    							if(!rtnV){
	                        							alert("실패하였습니다.");
	                        							e.error([]);
	                        							defer.reject(); 
	                        							return false;
	                        						};
	                        						
		    	        	            			if(trueV.length > 0){
		    	        	            				alert("교환승인 하였습니다.");
		    	        	            				defer.resolve();		         
		                    							//Util03saSvc.storedQuerySearchPlay(echgDataVO, "echgDataVO");
		    	        	            				Util03saSvc.storedQuerySearchPlay(echgDataVO, resData.storage);
		    	        	            			}else if(falseV.length > 0){
		    	        	            				echgDataVO.menualShwWrn = falseV;
		    	        	            				e.error([]);
		    	        	            				defer.resolve();            		
		    	        	            			}else if(allV.length < 1){
		    	        	            				alert("교환승인을 실패하였습니다.");
		                    							e.error([]);
		    	        	            				defer.reject();            		
		    	        	            			};	
	                    						}else{
	                    							if(rtnV === "success"){
	                    								alert("교환승인 하였습니다.");
		    	        	            				defer.resolve();		         
		                    							//Util03saSvc.storedQuerySearchPlay(echgDataVO, "echgDataVO");
		    	        	            				Util03saSvc.storedQuerySearchPlay(echgDataVO, resData.storage);
	                    							}else{
	                    								alert("교환승인을 실패하였습니다.");
		                    							e.error([]);
		    	        	            				defer.reject();      
	                    							}
	                    						}	                   						

	    	        							echgDataVO.receiveChk = false;
	                    					}, function(err){
	                    						e.error([]);
	                    					});  
	            							return defer.promise;
	            						}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            							echgDataVO.ngIfinIt(true);
	            							return false;
	            						};
	            						break;
	            					}; 
                					case '002' : {
                						if(confirm("선택하신 주문을 교환 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && 
                											ele.NO_ORD && ele.NO_ORD &&((['SYMM170101_00001','SYMM170101_00003','SYMM170901_00001'].indexOf(ele.NO_MNGMRK) > -1 && ele.CD_ECHGSTAT === "001" && whereIn.indexOf(ele.CD_ORDSTAT) > -1) ||						
        															(ele.NO_MNGMRK === 'SYMM170101_00005' && ele.CD_ECHGSTAT === "001" && where11stIn.indexOf(ele.CD_ORDSTAT) > -1) ||													//11번가는 반품 교환이 여러번 됨
        															(ele.NO_MNGMRK === 'SYMM170101_00002' && ["001","002"].indexOf(ele.CD_ECHGSTAT) > -1 && whereIn.indexOf(ele.CD_ORDSTAT) > -1)));									//스토어팜은 처리 상태에서도 거부 및 전환이 되야함
                								});                             					
                        					if(param.length !== 1){
                        						alert("마켓 및 주문 상태를 확인해 주세요.");
                        						return;
                        					};
                        					saEchgReqSvc.echgReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환거부 하였습니다.");                        					
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환거부를 실패하였습니다.");
                        							e.error();
                        						}
                    							echgDataVO.receiveChk = false;
                        					}, function(err){
                        						alert("실패하였습니다.");
                        						e.error([]);
                        					});                         
        		                			return defer.promise;
                						}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            							echgDataVO.ngIfinIt(true);
	            							return false;
	            						};
                						break;
                					};        
                					case '003' : {
                						if(confirm("교환완료 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){  	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && ['005','004','009'].indexOf(ele.CD_ORDSTAT) > -1 && ['001','002'].indexOf(ele.CD_ECHGSTAT) > -1) ;
        	                			 	    });                        					
                        					if(param.length !== 1){
                        						alert("마켓 및 주문 상태를 확인해 주세요.");
                        						echgGrd.cancelChanges();
                        						return;
                        					};
                        					if(param[0].CODE === "170902" && param[0].RECEIVE_SET !== 'Y'){
                        						alert("상품을 회수되지 않으면 교환이 진행되지 않습니다.");
                        						e.error();
                        						return;
                        					};                        					

                        					if(param[0].CD_PARS_INPUT && param[0].NO_INVO_INPUT){
	            								alert(APP_MSG.invcChkMsg);		            								
	            							};
                        					
                        					param[0].DTS_RECER = kendo.toString(new Date(param[0].DTS_RECER), "yyyyMMddHHmmss");
                        					
                        					saEchgReqSvc.echgCompleted(param[0]).then(function (res) {
                        						var rtnV = res.data,
	                    							allV = rtnV.allNoOrd,
	    	        							    trueV = rtnV.trueNoOrd,
	    	        							    falseV = rtnV.falseNoOrd;
                        						
                        						if(!rtnV){
                        							alert("실패하였습니다.");
                        							e.error([]);
                        							return false;
                        						};	    	        	            			
	    	        	            			if(trueV.length > 0){
                        							alert("교환완료 하였습니다.");
	    	        	            				defer.resolve();		         
	                    							//Util03saSvc.storedQuerySearchPlay(echgDataVO, "echgDataVO");
	    	        	            				Util03saSvc.storedQuerySearchPlay(echgDataVO, resData.storage);
	    	        	            			}else if(falseV.length > 0){
	    	        	            				echgDataVO.menualShwWrn = falseV;
	    	        	            				e.error([]);
	    	        	            				defer.resolve();            		
	    	        	            			}else if(!allV.length < 1){
                        							alert("교환완료를 실패하였습니다.");
	                    							e.error();
	    	        	            				defer.resolve();	
	    	        	            			};
	    	        							echgDataVO.receiveChk = false;
                        					}, function(err){
                        						alert("실패하였습니다.");
                        						e.error([]);
                        					});                         					
        		                			return defer.promise;
                    	            	}else{
	            							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                							echgDataVO.ngIfinIt(true);
	            							return false;
	            						};
                						break;
                					};
                					case "004" : {
                						if(confirm("선택하신 주문을 반품으로 변경 처리하시겠습니까?")){
                							var defer = $q.defer(),
            									param = e.data.models.filter(function(ele){
            										return (ele.ROW_CHK && ele.NO_ORD && ele.NO_MNGMRK !== 'SYMM170901_00001' &&	//쿠팡은 전환이 안됨
															((['SYMM170101_00001','SYMM170101_00003'].indexOf(ele.NO_MNGMRK) > -1 && ele.CD_ECHGSTAT === "001" && whereIn.indexOf(ele.CD_ORDSTAT) > -1) ||						
															(ele.NO_MNGMRK === 'SYMM170101_00005' && ele.CD_ECHGSTAT === "001" && where11stIn.indexOf(ele.CD_ORDSTAT) > -1) ||													//11번가는 반품 교환이 여러번 됨
															(ele.NO_MNGMRK === 'SYMM170101_00002' && ["001","002"].indexOf(ele.CD_ECHGSTAT) > -1 && whereIn.indexOf(ele.CD_ORDSTAT) > -1)));									//스토어팜은 처리 상태에서도 거부 및 전환이 되야함
            									}),
                								alertMsg = {
                									cltImpo : "교환상품이 수거되지 않으면 교환으로 변경 처리가 진행 되지 없습니다.",
                									procYn : "주문상태를 확인해 주세요.",
                									returnToExchangeFail : "반품으로 변경처리가 실패 하였습니다.\n관리자에게 문의해 주세요.",
                									returnToExchangeOky : "반품으로 변경처리 하였습니다.\n처리된 주문은 반품관리에서 확인해주세요."
                								};
                							
	            							if(e.data.models.length !== param.length){
	            								alert(alertMsg.procYn);
		            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	            								echgDataVO.ngIfinIt(true);
	                    						return false;
	            							};
	            							/*if(echgDataVO.gCode.indexOf(param[0].CODE) > -1 && echgDataVO.receiveChk === false){
	                							alert(alertMsg.cltImpo);   	         
	                							echgDataVO.ngIfinIt(false);
	                    	            		return false;
	            							}; 이건 좀 별로다. */
	            							if(param[0].CD_PARS_INPUT && param[0].NO_INVO_INPUT){
	            								alert(APP_MSG.invcChkMsg);		            								
	            							};
	            							if((['170104','170102','170106'].indexOf(param[0].CODE) > -1) || (param[0].CODE === "170103" && echgDataVO.receiveChk === true)){
	                							
	                							saEchgReqSvc.echgReturn(param[0]).then(function (res) {
	                								var rtnV = res.data,
		                    							allV = rtnV.allNoOrd,
		    	        							    trueV = rtnV.trueNoOrd,
		    	        							    falseV = rtnV.falseNoOrd;
	                								
	                								if(!rtnV){
	                        							alert("실패하였습니다.");
	                        							kendo.ui.progress(angular.element($(".k-widget")), false);
	                        							e.error([]);
	                        							return false;
	                        						};
		    	        	            			
		    	        	            			if(trueV.length > 0 && falseV.length === 0){
	                        							alert(alertMsg.returnToExchangeOky);
		    	        	            				defer.resolve();		         
		    	        	            				Util03saSvc.storedQuerySearchPlay(echgDataVO, resData.storage);
		    	        	            			}else if(falseV.length > 0){
		    	        	            				echgDataVO.menualShwWrn = falseV;
		    	        	            				e.error([]);
		    	        	            				defer.resolve();            		
		    	        	            			}else if(allV.length < 1){
		    	        	            				alert(alertMsg.returnToExchangeFail);
		                    							e.error();
		    	        	            				defer.resolve();            		
		    	        	            			};	
	                        						defer.resolve();
	                        					},function(err){
	                        						e.error([]);
	                        					}); 
	                							return defer.promise;
	            							}else if(param[0].CODE === "170103" && echgDataVO.receiveChk === false){
	            								saEchgReqSvc.echgReturnStoreFarmRequest(param[0]).then(function (res) {	
	                        						if(res.data === "success"){
	                        							alert(alertMsg.returnToExchangeOky);
		    	        	            				defer.resolve();		         
		    	        	            				Util03saSvc.storedQuerySearchPlay(echgDataVO, resData.storage);		    	            							
		    	        	            			}else{
	                        							alert(alertMsg.returnToExchangeFail);
		                    							e.error();
		    	        	            				defer.resolve();     		
		    	        	            			};	
	                        						defer.resolve();
	                        					},function(err){
	                        						e.error([]);
	                        					}); 
	                							return defer.promise;
	            							}
	            							else{
	            								alert(alertMsg.procYn);
	            								echgDataVO.ngIfinIt(false);
	                    						return false;
	            							};	 
                						}else{
                							echgGrd.cancelRow();
	            							angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                							echgDataVO.ngIfinIt(true);
                							return false;
                						}
                					}
                					default : {
                						break;
                					};
                				};
    							echgDataVO.receiveChk = false;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			echgDataVO.dataTotal = data.length;
                			angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                		},
                		pageSize: 9,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: grdField
                			}
                		},
                	}),
                	columns: [
              	            {
		                        field: "ROW_CHK",
		                        title: "<input class='ROW_CHK k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onOrdGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",				                        
		                        width: 30,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}			                          
            	            },                        
	                        {	
            	            	field: "NO_ORD",
	                            title: "관리번호",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [	
	                                       		{
													field: "NO_APVL",
													title: "결제번호 / 주문번호",
													width: 100,
													headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
	                            				}	
	                                       ]
	                        },
	                        {
	                        	field: "NM_MRK",	
	                            title: "마켓명",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "NO_MRKITEMORD",
												title: "상품주문번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
                           	{
                                field: "NO_MRKITEM",
                                title: "마켓상품번호",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NO_MRKREGITEM",
												title: "상품번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },		                        
                           	{
                                field: "NM_MRKITEM",
                                title: "상품명",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NM_MRKOPT",
												title: "옵션(상품구성)",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },                   
	                        {
	                        	field: "QT_ORD",
	                            title: "주문수량",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "QT_ECHG",
												title: "교환 요청 수량",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
										]
	                        },
	                        {
	                        	field: "NM_PCHR",
	                            title: "구매자",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "AM_ORDSALEPRC",
												title: "판매가",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}
                                      ]
	                        },
                           	{
                                field: "NO_PCHRPHNE",
                                title: "전화번호",
                                width: 110,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NM_CONS",
												title: "수취인",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },    
                            {
	                        	field: "CD_PARS_ECHG",
	                            title: "반품택배사",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "NO_INVO_ECHG",
												title: "반품송장번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
                            {
	                        	field: "DC_PCHREMI",
	                            title: "이메일",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "NO_CONSPHNE",
												title: "수취인 전화번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
                           	{
                                field: "DC_ECHGRSNCTT",
                                title: "교환사유",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "DC_CONSNEWADDR",
												title: "수취인주소",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
	                        {
	                        	field: "NM_ORDSTAT",
	                            title: "주문상태",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "DC_SHPWAY",
												title: "배송방법",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        }, 
	                        {
	                        	field: "DTS_ORD",
	                            title: "주문일시",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
	                            columns : [
											{
												field: "DTS_ECHGREQ",
												title: "교환요청일시",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
	                        },
                           	{
                                field: "DT_SND",
                                title: "재배송일자",
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "DTS_ECHGAPPRRJT",
												title: "교환요청 처리일시",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            }, 
                            {
                                field: "CD_PARS",
                                title: "재배송 택배사", 
                                width: 100,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NO_INVO",
												title: "재배송 송장번호",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
                                      ]
                            },  
                           	{
                                field: "NO_ECHGCPLT",
                                title: "교환완료자",
                                width: 90,
		                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "DTS_ECHGCPLT",
												title: "교환완료일시",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}
                                     ]
                            },   
	                        {
	                        	field: "YN_CONN",
	                            title: "연동구분",
	                            width: 100,
	                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                        columns : [
											{
												field: "NM_ECHGSTAT",
												title: "교환상태",
												width: 100,
												headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
											}	
										]
	                        }
	                 ]               
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdEchgVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            echgDataVO.initLoad();
            }]);
}());
