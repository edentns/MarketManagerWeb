(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.controller : sa.TkbkReqCtrl
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.controller")
        .controller("sa.TkbkReqCtrl", ["$scope", "$state", "$http", "$q", "$log", "$timeout", "$window", "sa.TkbkReqSvc", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc", "APP_CODE", "APP_SA_MODEL", "APP_MSG",
            function ($scope, $state, $http, $q, $log, $timeout, $window, saTkbkReqSvc, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_CODE, APP_SA_MODEL, APP_MSG) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

	            var grdField =  {
                    ROW_CHK       		: { type: APP_SA_MODEL.ROW_CHK.type        		, editable: true , nullable: false },
                    NO_ORD        		: { type: APP_SA_MODEL.NO_ORD.type         		, editable: false, nullable: false },
                    NO_APVL       		: { type: APP_SA_MODEL.NO_APVL.type        		, editable: false, nullable: false },
                    NM_MRK        		: { type: APP_SA_MODEL.NM_MRK.type         		, editable: false, nullable: false },
                    NO_MRKORD     		: { type: APP_SA_MODEL.NO_MRKORD.type      		, editable: false, nullable: false },  
                    NO_MRKITEMORD       : { type: APP_SA_MODEL.NO_MRKITEMORD.type      	, editable: false, nullable: false },
                    NO_MRKITEM    		: { type: APP_SA_MODEL.NO_MRKITEM.type     		, editable: false, nullable: false},
                    NO_MRKREGITEM 		: { type: APP_SA_MODEL.NO_MRKREGITEM.type  		, editable: false, nullable: false },
                    NM_MRKITEM    		: { type: APP_SA_MODEL.NM_MRKITEM.type     		, editable: true , nullable: false },
                    NM_MRKOPT     		: { type: APP_SA_MODEL.NM_MRKOPT.type      		, editable: false, nullable: false },                    
                    AM_ORDSALEPRC 		: { type: APP_SA_MODEL.AM_ORDSALEPRC.type  		, editable: false, nullable: false },
                    NM_PCHR       		: { type: APP_SA_MODEL.NM_PCHR.type        		, editable: true , nullable: false },
                    NM_CONS       		: { type: APP_SA_MODEL.NM_CONS.type        		, editable: false, nullable: false },
                    NO_PCHRPHNE   		: { type: APP_SA_MODEL.NO_PCHRPHNE.type    		, editable: false, nullable: false },                    
                    DC_PCHREMI    		: { type: APP_SA_MODEL.DC_PCHREMI.type     		, editable: false, nullable: false },
                    DC_CONSNEWADDR		: { type: APP_SA_MODEL.DC_CONSNEWADDR.type 		, editable: false, nullable: false },
                    DC_PCHRREQCTT 		: { type: APP_SA_MODEL.DC_PCHRREQCTT.type 		, editable: false, nullable: false },                    
                    CD_ORDSTAT    		: { type: APP_SA_MODEL.CD_ORDSTAT.type     		, editable: false, nullable: false },
                    DC_SHPWAY     		: { type: APP_SA_MODEL.DC_SHPWAY.type      		, editable: false, nullable: false },
                    DTS_ORD       		: { type: APP_SA_MODEL.DTS_ORD.type        		, editable: false, nullable: false },
                    QT_ORD        		: { type: APP_SA_MODEL.QT_ORD.type         		, editable: false, nullable: false },                    
                    DTS_TKBKREQ   		: { type: APP_SA_MODEL.DTS_TKBKREQ.type    		, editable: false, nullable: false },
                    NO_UPDATE     		: { type: APP_SA_MODEL.NO_UPDATE.type      		, editable: false, nullable: false },
                    YN_CONN       		: { type: APP_SA_MODEL.YN_CONN.type        		, editable: false, nullable: false },   
                    CD_TKBKRSN    		: { type: APP_SA_MODEL.CD_TKBKRSN.type     		, editable: false, nullable: false },
                    DC_APVLWAY    	  	: { type: APP_SA_MODEL.DC_APVLWAY.type     		, editable: false, nullable: false },        
                    NO_TKBKCPLT   		: { type: APP_SA_MODEL.NO_TKBKCPLT.type    		, editable: false, nullable: false },
                    QT_TKBK       		: { type: APP_SA_MODEL.QT_TKBK.type        		, editable: false, nullable: false },
                    NO_INSERT     		: { type: APP_SA_MODEL.NO_INSERT.type      		, editable: false, nullable: false },
                    CD_TKBKSTAT   		: { type: APP_SA_MODEL.CD_TKBKSTAT.type    		, editable: false, nullable: false },
                    NO_TKBKREQ    		: { type: APP_SA_MODEL.NO_TKBKREQ.type     		, editable: false, nullable: false },
                    NO_MRK        		: { type: APP_SA_MODEL.NO_MRK.type         		, editable: false, nullable: false },
                    DTS_TKBKAPPRRJT 	: { type: APP_SA_MODEL.DTS_TKBKAPPRRJT.type		, editable: false, nullable: false },
                    NO_TKBKAPPRRJT 		: { type: APP_SA_MODEL.NO_TKBKAPPRRJT.type		, editable: false, nullable: false },
                    DTS_TKBKCPLT_VIEW 	: { type: APP_SA_MODEL.DTS_TKBKCPLT.type		, editable: false, nullable: false },
                    NM_TKBKSTAT   		: { type: APP_SA_MODEL.NM_TKBKSTAT.type    		, editable: false, nullable: false },
                    NM_ORDSTAT   		: { type: APP_SA_MODEL.NM_ORDSTAT.type    		, editable: false, nullable: false },
                    NM_TKBKHRNKRSN 		: { type: "string"								, editable: false, nullable: false },
                    NM_TKBKLRKRSN 		: { type: "string"								, editable: false, nullable: false },
                    DC_TKBKRSNCTT 		: { type: "string"								, editable: false, nullable: false },
                    CODE			 	: { type: "string"								, editable: false, nullable: false },
                    NO_MNGMRK		 	: { type: "string"								, editable: false, nullable: false },
                    CD_PARS_TKBK	 	: { type: "string"								, editable: false, nullable: false },
                    NO_INVO_TKBK	 	: { type: "string"								, editable: false, nullable: false },
                    AM_TKBKSHP			: { type: "number"								, editable: false, nullable: false },
				    NOW_YN		 		: { type: "boolean"								, editable: true,  nullable: false },
				    DTS_RECE	 		: { type: "string"								, editable: false, nullable: false },
				    NO_RECER	 		: { type: "string"								, editable: false, nullable: false },
				    DC_TKBKSHPCOSTAPVL  : { type: "string"								, editable: false, nullable: false },
				    YN_TKBKTRNAS  		: { type: "string"								, editable: false, nullable: false },
				    DC_ECHGRSNCTT		: { 
						                   	 	type: "string" 
						                   	   ,editable: true 
						                   	   ,nullable: false
						                   	   ,validation: {
						                   		   dc_echgrsncttvalidation: function (input) {
						                   			   if(["004"].indexOf(tkbkDataVO.updateChange) > -1 && input.is("[name='DC_ECHGRSNCTT']")){
						                   				   if (!input.val()) {
						                   					   input.attr("data-dc_echgrsncttvalidation-msg", "교환변경 상세사유를 입력해 주세요.");
						                   					   return false;
						                   				   };
						                   				   if (input.val() && input.val().length > 200) {
						                   					   input.attr("data-dc_echgrsncttvalidation-msg", "교환변경 상세사유를 200자 이내로 입력해 주세요.");
						                   					   return false;
						                   				   };
						                   				   Util03saSvc.manualTkbkDataBind($scope.tkbkkg, input, "DC_ECHGRSNCTT");	
						                   			   }	
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
					                    			   if(tkbkDataVO.eCode.indexOf(tkbkDataVO.marketDivisionCode) > -1 && ["004"].indexOf(tkbkDataVO.updateChange) > -1 && input.is("[name='transform_pay_reason']")){
					                    				   if (!Util03saSvc.manualTkbkDataBind($scope.tkbkkg, input, "transform_pay_reason")) {
					                    					   input.attr("data-transform_pay_reasonvalidation-msg", "(교환,반품)배송비 전달방법을 선택해 주세요.");
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
							                   			if((tkbkDataVO.gCode.indexOf(tkbkDataVO.marketDivisionCode) > -1
							                   				&&	["003","004"].indexOf(tkbkDataVO.updateChange) > -1) ||
							                   				(tkbkDataVO.sCode.indexOf(tkbkDataVO.marketDivisionCode) > -1
									                   		&&	tkbkDataVO.updateChange === "004")		
							                   			){
															if (input.is("[name=RECEIVE_SET]") && input.attr("required")) {
																if($("#receive-group").find("[type=radio]").is(":checked")){
																	Util03saSvc.manualTkbkDataBind($scope.tkbkkg, input, "RECEIVE_SET");	
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
                    DTS_TKBKCPLT		: {
						                    	 type: APP_SA_MODEL.DTS_TKBKCPLT.type   
						                    	,editable: true 
						                    	,nullable: false
						                    	,validation: {
													dts_tkbkcpltvalidation: function (input) {
														if (input.is("[data-role=datetimepicker]")) {
															input.attr("data-dts_tkbkcpltvalidation-msg", "반납상품접수일자를 정확히 입력해 주세요.");			                                                        	
														    return input.data("kendoDateTimePicker").value();
														};
														return true;
													}
												}
					    	              },
                    DC_TKBKRJTCTT 		: { 
						                    	 type: APP_SA_MODEL.DC_TKBKRJTCTT.type  
						                    	,editable: true 
						                    	,nullable: false
						                    	,validation: {
													dc_tkbkrjtcttvalidation: function (input) {
														if (input.is("[name='DC_TKBKRJTCTT']") && input.val() === "") {
															input.attr("data-dc_tkbkrjtcttvalidation-msg", "반품거부사유를 입력해 주세요.");
														    return false;
														};
														if (input.is("[name='DC_TKBKRJTCTT']") && input.val() !== "" && input.val().length > 200) {
															input.attr("data-dc_tkbkrjtcttvalidation-msg", "반품거부사유를 200자 이내로 입력해 주세요.");
														    return false;
														};
														return true;
													}
												} 
					    	              },
                    CD_TKBKRJT   		: { 
						                    	 type: "string"
						                    	,editable: true 
						                    	,nullable: false
						                    	,validation: {
													cd_tkbkrjtvalidation: function (input) {
														if (input.is("[name='CD_TKBKRJT']") && input.val() === "") {
															input.attr("data-cd_tkbkrjtvalidation-msg", "반품거부코드를 입력해 주세요.");
														    return false;
														};
														return true;
													}
												}
				                   		  },             		  
				    CD_PARS				: {
						                    	type: "array"  
							     			   ,editable: true
							     			   ,nullable: false
							                   ,validation: {
							                	   cd_parsvalidation: function (input) { 
							                		   if(input.is("[name='CD_PARS']") && ["003","004"].indexOf(tkbkDataVO.updateChange)>-1){
							                			   return saTkbkReqSvc.chkCdparsAndNoInvo(tkbkDataVO.marketDivisionCode, tkbkDataVO.updateChange, input);
							                		   }
							                		   return true;
											       }
												}
	                    				  },	
	                NO_INVO				: {
						                    	type: "string" 
								     		   ,editable: true
								     		   ,nullable: false
								               ,validation: {
								            	   no_invovalidation: function (input) {
								            		   if(input.is("[name='NO_INVO']") && ["003","004"].indexOf(tkbkDataVO.updateChange)>-1){
									            		   return saTkbkReqSvc.chkCdparsAndNoInvo(tkbkDataVO.marketDivisionCode, tkbkDataVO.updateChange, input, $scope.tkbkkg);
								            		   }
								            		   return true;
											       }
								               }
	                    				  },     		  
	                PICK_CD_PARS		: {
						                    	type: "array"  
							     			   ,editable: true
							     			   ,nullable: false
							                   ,validation: {
							                	   pick_cd_parsvalidation: function (input) { 
							                		   if(input.is("[name='PICK_CD_PARS']") && ["004"].indexOf(tkbkDataVO.updateChange)>-1){
							                			   return saTkbkReqSvc.chkCdparsAndNoInvo(tkbkDataVO.marketDivisionCode, tkbkDataVO.updateChange, input);
							                		   }
							                		   return true;
											       }
												}
                    				      },	
                    PICK_NO_INVO		: {
                    							type: "string" 
								     		   ,editable: true
								     		   ,nullable: false
								               ,validation: {
								            	   pick_no_invovalidation: function (input) {
								            		   if(input.is("[name='PICK_NO_INVO']") && ["004"].indexOf(tkbkDataVO.updateChange)>-1){
									            		   return saTkbkReqSvc.chkCdparsAndNoInvo(tkbkDataVO.marketDivisionCode, tkbkDataVO.updateChange, input, $scope.tkbkkg);
								            		   }
								            		   return true;
											       }
								               }
                    					   },
	                CD_HOLD				: {
							                	type: "array"  
									     	   ,editable: true
									     	   ,nullable: false
									           ,validation: {
									        	   cd_holdvalidation: function (input) {
									        		   if(tkbkDataVO.gCode.indexOf(tkbkDataVO.marketDivisionCode) > -1 && tkbkDataVO.updateChange === '003'){
									        			   if (input.is("[name='CD_HOLD']") && input.val() === "" && tkbkDataVO.receiveCheckCode === 'N') {
							                                	input.attr("data-cd_holdvalidation-msg", "보류사유를 입력해 주세요.");
							                                    return false;
							                                };
									        		   };
									        		   return true;
											    	}
								               }
	               						  },
	                CD_HOLD_FEE			: {
							                	type: "number"  
								     		   ,editable: true
								     		   ,nullable: false
								               ,validation: {
								            	   cd_hold_feevalidation: function (input) {
								            		   if(tkbkDataVO.gCode.indexOf(tkbkDataVO.marketDivisionCode) > -1 && tkbkDataVO.updateChange === '003'){
								            			   if (input.is("[name='CD_HOLD_FEE']") && (!input.val() || input.val() < 1) && tkbkDataVO.etcCostCode === 'Y') {
							                                	input.attr("data-cd_hold_feevalidation-msg", "반품비를 입력해 주세요.");
							                                    return false;
							                               };
								            		   };
												    	return true;
											    	}
								               }
	               						  }     				 
                };
	            
	            var tkbkDataVO = $scope.tkbkDataVO = {
            		boxTitle : "반품요청",
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
	        		cdTkbkstatMo : "001",
	        		cdTkbkstat : [],
	        		cdTkbkrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdTkbkrjtOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
	                    valuePrimitive: true
	        		},
	        		dateOptions : {										//DATE PICKER
	        			parseFormats: ["yyyyMMddHHmmss"], 				//이거 없으면 값이 바인딩 안됨
        	            animation: {
        	                close: {
        	                    effects: "fadeOut zoom:out",
        	                    duration: 300
        	                },
        	                open: {
        	                    effects: "fadeIn zoom:in",
        	                    duration: 300
        	                }
        	            }
	        		},
	        		cdHoldFee : {
	        			min : "0", 
	        			max : "1000000",
	        			format : "C0",
	        			step : 100
	        		},
	        		userInfo : JSON.parse($window.localStorage.getItem("USER")).NM_EMP,
	        		updateChange : '',
	        		dataTotal : 0,
	        		resetAtGrd : '',
	        		param : '',
	        		shipList : '',
	        		gCode : ['170104','170102'],
	        		eCode : ['170106'],
	        		sCode : ['170103'],
	        		cCode : ['170902'],
	        		etcCostName : '',
	        		etcCostCode : '',
	        		gHoldCode : '',
	        		receiveCheckCode : '',
	        		marketDivisionCode : '',
	        		menualShwWrn: '',
	        		ddlDefaultOp : {
	        			enable : false
	        		},
	        		inputPopupHeaderTitle : ''
		        };   
	            
	            tkbkDataVO.alertMsg = {
            		qikShpYn : "빠른 환불 요청건은 교환으로 변경 처리가 진행 되지 없습니다.",
					cltImpo : "반품상품이 수거되지 않으면 교환으로 변경 처리가 진행 되지 없습니다.",
					procYn : "주문상태를 확인해 주세요.",
					returnToExchangeFail : "교환으로 변경처리 실패 하였습니다.\n관리자에게 문의해 주세요.",
					returnToExchangeOky : "교환으로 변경처리 하였습니다.\n처리된 주문은 교환관리에서 확인해주세요.",
					notPossibleReturnToExchange : "이미 교환에서 반품으로 변경된 주문입니다.\n교환으로 변경 처리를 할수 없습니다.",
					plzChkOneOrd : "한 건의 주문을 선택해 주세요"
	            };
	            
	            tkbkDataVO.initLoad = function () {
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00064",
        					lcdcls: "SA_000023",
	    					customnoc: "00000"   
        				},
        				/*cdTkbkrsnParm = {
        					lnomngcdhd: "SYCH00050",
        					lcdcls: "SA_000009"
                		},*/
                		cdTkbkrjtParm = {
        					lnomngcdhd: "SYCH00065",
        					lcdcls: "SA_000024",
	    					customnoc: "00000"    
                		},
                		gHoldCodeParm = {
        					lnomngcdhd: "SYCH00074",
        					lcdcls: "SA_000029",
	    					customnoc: "00000"
                		},
                		cdTkbkstat = {
        					lnomngcdhd: "SYCH00066",
        					lcdcls: "SA_000025",
	    					customnoc: "00000"
                		},
                		cd11stShippingFee = {
                			lnomngcdhd: "SYCH00092",
        					lcdcls: "SA_000031",
	    					customnoc: "00000"
                		}
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
            			//반품 사유 코드
            		/*	UtilSvc.getCommonCodeList(cdTkbkrsnParm).then(function (res) {
            				return res.data;
            			}),*/
        	            //반품 거부 코드
            			UtilSvc.getCommonCodeList(cdTkbkrjtParm).then(function (res) {
            				return res.data;
            			}),
        	            //지마켓 보류 사유 코드
            			UtilSvc.getCommonCodeList(gHoldCodeParm).then(function (res) {
            				return res.data;
            			}),
        	            //반품 상태 코드
            			UtilSvc.getCommonCodeList(cdTkbkstat).then(function (res) {
            				return res.data;
            			}),
        	            //11번가 배송비 결제 구분
            			UtilSvc.getCommonCodeList(cd11stShippingFee).then(function (res) {
            				return res.data;
            			})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF; 
                        
                        //me.cdTkbkrsnOp.dataSource = result[3];
                        me.cdTkbkrjtOp.dataSource = result[3];
                        me.gHoldCode = result[4];
                        me.cdTkbkstat = result[5];
                        me.cd11stShippingFee = result[6];
                        
                        $timeout(function(){
                        	tkbkDataVO.isOpen(false);
            				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                        },0);    
                    });
                };

                APP_SA_MODEL.CD_TKBKRSN.fNm = "tkbkDataVO.cdTkbkrsnOp.dataSource";
                //APP_SA_MODEL.CD_ORDSTAT.fNm = "tkbkDataVO.ordStatusOp";
                //APP_SA_MODEL.CD_TKBKSTAT.fNm = "tkbkDataVO.cdTkbkstat";
                APP_SA_MODEL.CD_PARS_TKBK.fNm = "tkbkDataVO.shipList";
                
                var grdCol = [[APP_SA_MODEL.ROW_CHK],
                              [APP_SA_MODEL.NO_ORD           ,[APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK           , APP_SA_MODEL.NO_MRKITEMORD ],
                              [APP_SA_MODEL.NO_MRKITEM       , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM		 , APP_SA_MODEL.NM_MRKOPT	  ],
                              [APP_SA_MODEL.QT_ORD           , APP_SA_MODEL.QT_TKBK       ],
                              [APP_SA_MODEL.NM_PCHR          , APP_SA_MODEL.AM_ORDSALEPRC ],
                              [APP_SA_MODEL.NO_PCHRPHNE      , APP_SA_MODEL.AM_TKBKSHP    ],
                              [APP_SA_MODEL.CD_PARS_TKBK     , APP_SA_MODEL.NO_INVO_TKBK  ],                              
                              [APP_SA_MODEL.DC_PCHREMI       , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.NM_TKBKHRNKRSN   , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.NM_ORDSTAT       , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD          , APP_SA_MODEL.DTS_TKBKREQ   ],
                              [APP_SA_MODEL.DTS_TKBKAPPRRJT  , APP_SA_MODEL.NO_TKBKAPPRRJT],
                              [APP_SA_MODEL.DTS_RECE		 , APP_SA_MODEL.NO_RECER   	  ],
                              [APP_SA_MODEL.YN_CONN          , APP_SA_MODEL.NM_TKBKSTAT   ]
                             ],
                    grdDetOption      = {},
                    grdRowTemplate    = "<tr data-uid=\"#= uid #\">\n",
                    grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\">\n",
                    grdCheckOption    = {clickNm:"onOrdGrdCkboxClick",
                		                 allClickNm:"onOrdGrdCkboxAllClick"};
                
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;	 
                	            
		        //팝업에 입력창들이 NG-IF 인하여 데이터 바인딩이 안되서 수동으로 데이터 바인딩을 함
	            var ngIfdata = $scope.ngIfdata = function(input, eqInput){
	            	tkbkDataVO.marketDivisionCode = eqInput;
	            	return input.indexOf(eqInput) > -1;
	            },	    
	            
	            receiveCheckClickEvent = $scope.receiveCheckClickEvent = function(e, code, cdParsTkbk){
	            	saTkbkReqSvc.receiveCheckClickEvent(tkbkDataVO, e, code, cdParsTkbk);
	            },	   
	            
	            nowYnCheckClickEvent = $scope.nowYnCheckClickEvent = function(e){
	                var element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	getUid = element.parents("table").attr("data-uid"),
	                	grid = $scope.tkbkkg,
	                	viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	                	dataItem = grid.dataItem(viewToRow);	       
	                	
	                dataItem.NOW_YN = checked;
	                dataItem.dirty = checked;
                };
	            
	            //조회
	            tkbkDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
    				    NM_MRKITEM : self.procName.value,
					    NO_MRK : self.ordMrkNameMo, 
					    CD_ORDSTAT : self.ordStatusMo,
					    CD_TKBKSTAT : self.cdTkbkstatMo,
					    NO_MRKORD : self.orderNo.value,      
					    NM_PCHR : self.buyerName.value,
					    DTS_CHK : self.betweenDateOptionMo,  
					    DTS_FROM : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d).dateFormat("YmdHis"),           
					    DTS_TO :new Date(self.datesetting.period.end.y, self.datesetting.period.end.m-1, self.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
					    NM_MRK_SELCT_INDEX : self.ordMrkNameOp.allSelectNames,
					    NM_ORDSTAT_SELCT_INDEX : self.ordStatusOp.allSelectNames,
					    DTS_SELECTED : self.datesetting.selected,
    					DTS_STORAGE_FROM: self.datesetting.period.start,
    					DTS_STORAGE_TO: self.datesetting.period.end,
					    CASH_PARAM : resData.storageKey
                    };	            	
    				if(Util03saSvc.readValidation(self.param)){
    					$scope.tkbkkg.dataSource.data([]);
    	            	$scope.tkbkkg.dataSource.page(1);  // 페이지 인덱스 초기화        			 
    				}
	            };
		            
	            //초기화버튼
	            tkbkDataVO.inIt = function(){
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
                			        	
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.tkbkkg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	me.ngIfinIt();
	            };	
	            
	            //ng if 초기화버튼
	            tkbkDataVO.ngIfinIt = function(yn){
            		var me  = this;
            		
                	me.etcCostCode = "";                	
                	me.etcCostName = "";                	
                	me.receiveCheckCode = (yn)? yn : '';            
                	
                	kendo.ui.progress(angular.element($(".k-widget")), false);
	            };	
		            
	            //그리드 크기 조절
	            tkbkDataVO.isOpen = function(val){
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 9 : 12;
	            	
	            	$scope.tkbkkg.wrapper.height(settingHeight);
            		$scope.tkbkkg.resize();
            		if(tkbkDataVO.param !== "") {
            			grdTkbkVO.dataSource.pageSize(pageSizeValue);
            		}
	            };	                
	            
                //검색 그리드
	            var grdTkbkVO = $scope.grdTkbkVO = {
            		autoBind: false,
                    messages: {                        	
                        requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "닫기"
                        }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                	boxTitle : "주문 목록",
                	pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataBound: function(e) {
                        //this.expandRow(this.tbody.find("tr.k-master-row").first());
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },       
                    editable: {
                    	mode: "popup",
                		window : {
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#tkbk_popup_template").html())),
                		confirmation: false
                    },
                    edit: function(e){
                    	var dataVo = $scope.tkbkDataVO,                    	                      	
                    	    code = e.model.CODE,
                    	    Type = tkbkDataVO.updateChange,
                    		selector = e.container;                    	
                    	
                    	// 반품 완료              	
                    	if(Type === "001"){
                    		
                    	// 반품 거절
                    	}else if(Type === "002"){
                    		// 나중에 댑스 생기면 주석 풀기
                    		/*var chosenDS = tkbkDataVO.cdTkbkrjtOp.filter(function(ele){
    	            			return (ele.DC_RMK1 === e.model.NO_MNGMRK);
    	            		});*/
                			                    		                    		
		            		$timeout(function(){
		                    	var ddlRjt = e.container.find("select[name=CD_TKBKRJT]").data("kendoDropDownList");            
		                    	ddlRjt.select(0);
		                    	ddlRjt.trigger("change");                			
		                	},50);		            		
		            	// 반품 승인	
                    	}else if(Type === "003"){
                    		var	ddlHoldReasonCodeSel = e.container.find("select[name=CD_HOLD]");
                    		
                    		switch(code){
                    			case '170104':
                    			case '170102': {
                    				//창을 한 번 껐다가 키면 잔상이 남아 있으서 초기화 시켜줌
                            		//비동기로 안하면 멍청이가 됨
                            		if(ddlHoldReasonCodeSel.length > 0 && dataVo.receiveCheckCode === "N"){
                            			$timeout(function(){
                            				dataVo.receiveCheckCode = "Y";
                            			},0);
                            		};                   				
                    				
                    				selector.find("select[name=CD_HOLD]").kendoDropDownList({
        		            			dataSource : tkbkDataVO.gHoldCode,
        		                		dataTextField : "NM_DEF",
        		                		dataValueField : "CD_DEF",
        		                		optionLabel : "보류사유를 선택해 주세요 ",
        		                		change : function(e){
        		                			var nmDef = this.dataItem().NM_DEF,
        		                			    dcRmk2 = this.dataItem().DC_RMK2;
	        		                			if(dcRmk2 != 'Y'){
	    		                    				var nutxt = selector.find("input[name=CD_HOLD_FEE]").data("kendoNumericTextBox");
	    		                    				nutxt.value(0);
	    		                    			}
        		                			$timeout(function(){
        		                    			tkbkDataVO.etcCostCode = dcRmk2;
        		                    			tkbkDataVO.etcCostName = nmDef;
        		                			},0);
        		                		}
        		            		});
                    				break;
                    			}
                    			case '170103' : {
                    				var localNoMrk = e.model.NO_MRK,
                    					cdPars = e.model.CD_PARS,
                    				    deliverDS = dataVo.shipList.filter(function(ele){
    	    	            			return ele.DC_RMK1 === localNoMrk;
    	    	            		});	            	
                    				if(!deliverDS.length){
                    					deliverDS = [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}];
                                	}
                    				e.container.find("select[name=CD_PARS]").kendoDropDownList({
    	    	            			dataSource : deliverDS,
    	    	                		dataTextField : "NM_PARS_TEXT",
    	    	                		dataValueField : "CD_PARS",
    	    	                		optionLabel : "택배사를 선택해 주세요 ",
    	    	                		select : function(e){
    	    	                			var me = this;
    	    	                			$timeout(function(){
    	    	                				//console.log(me.selectedIndex);
    	    	                				//몇번 클릭 하면 change 이벤트가 사라져서 유효성 검사가 저장 누룰때만 됨
    	    	                				//그래서 경고창 있으면 강제로 없애줌
    	    	                				if(me.selectedIndex > 0){
        	    	                				me.element.parents("table").find(".k-invalid-msg").hide();
        	    	                			}
    	    	                			},0);
    	    	                		},
	                                    change : function(e){
	                                    	if(this.text() === "택배사 등록" && this.selectedIndex === 1){
	                                    		$state.go("app.syPars", { mrk: localNoMrk, menu: true, ids: null });
	                                    		$scope.tkbkkg.cancelRow();
	                                    	}
	                                    }
    	    	            		});
                    				
                    				if(cdPars){
                    					var cdParsDdl = e.container.find("select[name=CD_PARS]").data("kendoDropDownList");
                    					  
                    					cdParsTkbkDdl.value(cdPars);
                    					cdParsTkbkDdl.trigger("change"); 
                    				};
                    				break;
                    			}
                    			default : {
                    				break;
                    			}
                    		}
                    	}else if(Type === "004"){
                			var shippingList = Util03saSvc.shppingList().query({shippingType:"003", mrkType:e.model.NO_MRK}),
                			    pickShippingList = Util03saSvc.shppingList().query({shippingType:"002", mrkType:e.model.NO_MRK}),
                			    mrks = e.model.NO_MRK;
                			
                			shippingList.$promise.then(function (data) {
                				var Data = data.length < 1 ? [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}] : data;
                				selector.find("select[name=CD_PARS]").kendoDropDownList({
	    	            			dataSource : Data,
	    	                		dataTextField : "NM_PARS_TEXT",
	    	                		dataValueField : "CD_DEF",
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
                                    		$state.go("app.syPars", { mrk: mrks, menu: true, ids: null });
                                    		$scope.tkbkkg.cancelRow();
                                    	}
                                    }
	    	            		});
                			},function(){
            					$log.info("택배사 조회 실패!");
            					alert("택배사 조회 실패! 관리자에게 문의하세요!");
            				});
                			
                			pickShippingList.$promise.then(function (data) {
                				var Data = data.length < 1 ? [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}] : data;
                				
                				selector.find("select[name=PICK_CD_PARS]").kendoDropDownList({
	    	            			dataSource : Data,
	    	                		dataTextField : "NM_PARS_TEXT",
	    	                		dataValueField : "CD_DEF",
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
                                    		$state.go("app.syPars", { mrk: mrks, menu: true, ids: null });
                                    		$scope.tkbkkg.cancelRow();
                                    	}
                                    }
	    	            		});
                			},function(){
            					$log.info("택배사 조회 실패!");
            					alert("택배사 조회 실패! 관리자에게 문의하세요!");
            				});
                			                    			
                			if(code === dataVo.eCode[0] && (e.model.NM_TKBKLRKRSN === "구매자" || e.model.NM_TKBKLRKRSN === "구매자 귀책")){                    				
                				selector.find("select[name=transform_pay_reason]").kendoDropDownList({
	    	            			dataSource : dataVo.cd11stShippingFee,
	    	                		dataTextField : "NM_DEF",
	    	                		dataValueField : "CD_DEF",
	    	                		optionLabel : "교환배송비 전달방법을 선택해 주세요 ",
	    	                		valuePrimitive: true,
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
                		}
                    },
                    cancel: function(e) {                    	 
                    	tkbkDataVO.ngIfinIt();
                    	saTkbkReqSvc.allChkCcl();
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	height: 616,       
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#tkbk_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var me = tkbkDataVO;
                				
	                			me.ngIfinIt();
	                			
                				saTkbkReqSvc.orderList(me.param).then(function (res) {
                					me.shipList = res.data.queryShipList;
                					e.success(res.data.queryList);
            					},function(err){
            						e.error([]);
            					});                				
                			},
                			update: function(e){
                				var whereIn = ['004','005'],
                				    whereInCp = ['002','005'],
                				    where11stIn = ['004','005','007','008','009'],
                				    tkbkGrd = $scope.tkbkkg;
                				
                				switch(tkbkDataVO.updateChange){
                					case '001' : {
                						if(confirm("반품완료를 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){	                			 	    	         	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && whereInCp.indexOf(ele.CD_TKBKSTAT) >= -1 && (ele.NO_ORD) && ele.NO_ORD !== "") ;
        	                			 	    });	                        						
                        					if(param.length !== 1){
                        						alert("반품승인 된 주문만 접수 처리 할 수 있습니다.");
                        						tkbkDataVO.ngIfinIt();
                        						return false;
                        					};
                        					
                        					param[0].DTS_TKBKCPLT = kendo.toString(new Date(param[0].DTS_TKBKCPLT), "yyyyMMddHHmmss");                                			
                        					
                        					saTkbkReqSvc.tkbkCompleted(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품완료 되었습니다.");
                        							//$scope.tkbkkg.dataSource.read();
                        							Util03saSvc.storedQuerySearchPlay(tkbkDataVO, resData.storage);
                        						}else{
                        							alert("반품완료가 실패하였습니다.");
                        							e.error();
                        						}
                        					},function(err){
                        						e.error([]);
                        					});
        		                			return defer.promise;
                    	            	}else{
                    	            		saTkbkReqSvc.allChkCcl(tkbkGrd);
                    	            		tkbkDataVO.ngIfinIt();
                    	            	}
                						break;
                					}
                					case '002' : {
                						if(confirm("선택하신 주문을 반품거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK && ele.NO_ORD && 
                											((ele.NO_MNGMRK === 'SYMM170101_00005' && ['004','005','007','008','009'].indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_TKBKSTAT === '001') ||
                											(ele.NO_MNGMRK === 'SYMM170101_00002' && ['004','005'].indexOf(ele.CD_ORDSTAT) > -1 && ['001','002'].indexOf(ele.CD_TKBKSTAT) > -1)))
                								});                             					
                        					if(param.length !== 1){
                        						alert("주문 상태를 확인해 주세요.");
                        						tkbkDataVO.ngIfinIt();
                        						return false;
                        					};  
                        					saTkbkReqSvc.tkbkReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품거부 하였습니다.");
            	            						//$scope.tkbkkg.dataSource.read();
                        							Util03saSvc.storedQuerySearchPlay(tkbkDataVO, resData.storage);
                        						}else{
                        							alert("반품거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					},function(err){
                        						e.error([]);
                        					}); 
        		                			return defer.promise;
                						}else{
                							saTkbkReqSvc.allChkCcl(tkbkGrd);
                							tkbkDataVO.ngIfinIt();
                    	            	}
                						break;
                					}
                					case '003' : {
                						if(confirm("선택하신 주문을 반품처리하시겠습니까?")){
                							var defer = $q.defer(),
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "" && 
                											((ele.NO_MNGMRK !== 'SYMM170101_00005' && whereIn.indexOf(ele.CD_ORDSTAT) > -1) || (ele.NO_MNGMRK === 'SYMM170101_00005' && where11stIn.indexOf(ele.CD_ORDSTAT) > -1)));
                								});                 							
                							if(e.data.models.length !== param.length){
                								alert("배송처리 된 반품요청 주문만 승인 처리 할 수 있습니다.");
                								tkbkDataVO.ngIfinIt();
                        						return false;
                							};
                							if(param[0].NO_MNGMRK === "SYMM170101_00002"){
                    							alert(APP_MSG.invcChkMsg);                								
                							};
                							
                							saTkbkReqSvc.tkbkConfirm(param[0]).then(function (res) {
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
                        							alert("반품처리 하였습니다.");
	    	        	            				defer.resolve();		         
	                    							//Util03saSvc.storedQuerySearchPlay(tkbkDataVO, "tkbkDataVO");
	    	        	            				Util03saSvc.storedQuerySearchPlay(tkbkDataVO, resData.storage);
	    	        	            			}else if(falseV.length > 0){
	    	        	            				tkbkDataVO.menualShwWrn = falseV;
	    	        	            				e.error([]);
	    	        	            				defer.resolve();            		
	    	        	            			}else if(allV.length < 1){
                        							alert("반품처리를 실패하였습니다.");
	                    							e.error();
	    	        	            				defer.resolve();            		
	    	        	            			};	
                        						defer.resolve();
                        					},function(err){
                        						e.error([]);
                        					}); 
                							return defer.promise;
                						}else{
                							saTkbkReqSvc.allChkCcl(tkbkGrd);
                							tkbkDataVO.ngIfinIt();
                    	            	}
                						break;
                					}
                					case "004" : {
                						if(confirm("선택하신 주문을 교환으로 변경 처리하시겠습니까?")){
                							var defer = $q.defer(),
            									param = e.data.models.filter(function(ele){
            										return ele.ROW_CHK && ele.NO_ORD && 
            												((ele.NO_MNGMRK === 'SYMM170101_00005' && ['004','005','007','008','009'].indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_TKBKSTAT === '001') ||
            												 (['SYMM170101_00001','SYMM170101_00003'].indexOf(ele.NO_MNGMRK) > -1 && ['004','005'].indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_TKBKSTAT === '001') ||		
                        									 (ele.NO_MNGMRK === 'SYMM170101_00002' && ['004','005'].indexOf(ele.CD_ORDSTAT) > -1 && ['001','002'].indexOf(ele.CD_TKBKSTAT) > -1));
            									});
                							
	            							if(e.data.models.length !== param.length){
	            								alert(tkbkDataVO.alertMsg.procYn);
	                    	            		//saTkbkReqSvc.allChkCcl(tkbkGrd);
	                    	            		tkbkDataVO.ngIfinIt('N');
	                    						return false;
	            							};
	            							if(param[0].YN_TKBKTRANS === 'Y'){
	            								alert(tkbkDataVO.alertMsg.notPossibleReturnToExchange);
	                    	            		//saTkbkReqSvc.allChkCcl(tkbkGrd);
	                    	            		tkbkDataVO.ngIfinIt('N');
	                    						return false;
	            							};
	            							if(tkbkDataVO.gCode.indexOf(param[0].CODE) > -1 && tkbkDataVO.receiveCheckCode === 'N'){
	                							alert(tkbkDataVO.alertMsg.cltImpo);   	                							
	                							//saTkbkReqSvc.allChkCcl(tkbkGrd);
	                							tkbkDataVO.ngIfinIt('N');
	                    	            		return false;
	            							};
	            							if(tkbkDataVO.gCode.indexOf(param[0].CODE) > -1 && param[0].NM_TKBKLRKRSN === "빠른환불"){
	                							alert(tkbkDataVO.alertMsg.qikShpYn);   	                							
	                							//saTkbkReqSvc.allChkCcl(tkbkGrd);
	                							tkbkDataVO.ngIfinIt('N');
	                    	            		return false;
	            							};
	            							if(param[0].CODE !== "170103" || tkbkDataVO.receiveCheckCode === 'Y'){
	            								
	                							alert(APP_MSG.invcChkMsg);
	                							
	                							saTkbkReqSvc.tkbkExchange(param[0]).then(function (res) {
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
	                        							alert(tkbkDataVO.alertMsg.returnToExchangeOky);
		    	        	            				defer.resolve();		         
		    	        	            				Util03saSvc.storedQuerySearchPlay(tkbkDataVO, resData.storage);
		    	        	            			}else if(falseV.length > 0){
		    	        	            				tkbkDataVO.menualShwWrn = falseV;
		    	        	            				e.error([]);
		    	        	            				defer.resolve();            		
		    	        	            			}else if(allV.length < 1){
		    	        	            				alert(tkbkDataVO.alertMsg.returnToExchangeFail);
		                    							e.error();
		    	        	            				defer.resolve();            		
		    	        	            			};	
	                        						defer.resolve();
	                        					},function(err){
	                        						e.error([]);
	                        					}); 
	                							return defer.promise;
	            							}else{
	            								saTkbkReqSvc.tkbkExchangeStoreFarmRequest(param[0]).then(function (res) {	
	                        						if(res.data === "success"){
	                        							alert(tkbkDataVO.alertMsg.returnToExchangeOky);
		    	        	            				defer.resolve();		         
		    	        	            				Util03saSvc.storedQuerySearchPlay(tkbkDataVO, resData.storage);
		    	        	            			}else{
	                        							alert(tkbkDataVO.alertMsg.returnToExchangeFail);
		                    							e.error();
		    	        	            				defer.resolve();            		
		    	        	            			};	
	                        						defer.resolve();
	                        					},function(err){
	                        						e.error([]);
	                        					}); 
	                							return defer.promise;
	            							};
                						}else{
                							saTkbkReqSvc.allChkCcl(tkbkGrd);
                							tkbkDataVO.ngIfinIt();
                						}
                					}
                					default : {
                						break;
                					}
                				}
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			tkbkDataVO.dataTotal = data.length;
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
                	columns: grdDetOption.gridColumn            	          	
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdTkbkVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.tkbkkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.tkbkkg);
                };
                
                $scope.getTdClass = function(index, align){
                	return saTkbkReqSvc.getTdClass(index, align);
                }
				
				var clickEventValidNprocess = function(grd, code, px){
            		var	chked = grd.element.find(".k-grid-content input:checked"),
    			    	grdItem = grd.dataItem(chked.closest("tr")),
    			    	chkedLeng = grd.element.find(".k-grid-content input:checked").length,
    			    	tkbkcd = ['002','005'];
                	
                	if(chkedLeng != 1){
        				alert(tkbkDataVO.alertMsg.plzChkOneOrd);	
        				return false;
        			};
    			
    				switch(code){
						case '001' : {
	            			if(tkbkcd.indexOf(grdItem.CD_TKBKSTAT) < 0){
	            				alert("반품처리 된 주문만 완료 처리 할 수 있습니다.");
	            				return false;
	            			};
	            			grdItem.DTS_TKBKCPLT = new Date();
							break;
						};
	                	case '002' : {
	            			if(tkbkDataVO.gCode.indexOf(grdItem.CODE) > -1){
	            				alert("지마켓,옥션은 거부 기능을 사용할 수 없습니다.");
	            				return false;
	            			};
	            			if(tkbkDataVO.cCode.indexOf(grdItem.CODE) > -1){
	            				alert("쿠팡은 거부 기능을 사용할 수 없습니다.");
	            				return false;
	            			}; 
	            			//11번가
                			if(['170106'].indexOf(grdItem.CODE) > -1 && ['004','005','007','008','009'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_TKBKSTAT !== '001'){			                				
                				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			}//스토어팜
                			if(['170103'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || ['001','002'].indexOf(grdItem.CD_TKBKSTAT) < 0){			                				
                				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			};
						};
                		case '003' : {
                			if(grdItem.CD_TKBKSTAT !== "001" || ['004','005','007','008','009'].indexOf(grdItem.CD_ORDSTAT) < 0){
                				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			}
                			break;
                		};
						case "004" : {
							if(tkbkDataVO.cCode.indexOf(grdItem.CODE) > -1){
	            				alert("쿠팡은 교환으로 변경 기능을 사용할 수 없습니다.");
	            				return false;
	            			}
	            			if(['170104','170102'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_TKBKSTAT !== '001'){
	            				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			}
	            			//11번가
                			if(['170106'].indexOf(grdItem.CODE) > -1 && ['004','005','007','008','009'].indexOf(grdItem.CD_ORDSTAT) < 0 || grdItem.CD_TKBKSTAT !== '001'){			                				
                				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			}
                			//스토어팜
                			if(['170103'].indexOf(grdItem.CODE) > -1 && ['004','005'].indexOf(grdItem.CD_ORDSTAT) < 0 || ['001','002'].indexOf(grdItem.CD_TKBKSTAT) < 0){			                				
                				alert(tkbkDataVO.alertMsg.procYn);
                				return false;
                			};
                			//이미 교환에서 넘어온 주문
                			if(grdItem.YN_TKBKTRANS === 'Y'){
		            			alert(tkbkDataVO.alertMsg.notPossibleReturnToExchange);
		            			return false;
	            			};
	            			//90일 이상 주문건
	            			if(UtilSvc.diffDate(grdItem.DTS_TKBKREQ, new Date()) >= 90){
		            			alert(APP_MSG.caseNinetyDaysAlert);
	            			};
	            			break;
						}
						default : {
							return false;
							break;
						}
    				};
    				
    				if(grdItem.YN_CONN === 'N'){			                				
            			alert(APP_MSG.caseNotReceiveResultOrd);
            		};	
            		
            		tkbkDataVO.popupColumn = [];
            		tkbkDataVO.popupColumn = [
	    		                          	[{name: "마켓",   align : ""},
	    		                          	 {name: grdItem.NM_MRK,     align : ""},
	    		                          	 {name: "상품주문번호", align : ""}, 
	    		                          	 {name: grdItem.NO_MRKITEMORD, align : ""}],
	    		                          	[{name: "상품코드", align : ""}, {
	    		                          	  name: grdItem.NO_MRKITEM, align : ""}],
	    		                          	[{name: "상품명",  align : ""}, 
	    		                          	 {name: grdItem.NM_MRKITEM, align : ""}],
	    		                          	[{name: "구매자",  align : ""}, 
	    		                          	 {name: grdItem.NM_PCHR,    align : ""}, 
	    		                          	 {name: "배송방법",   align : ""}, 
	    		                          	 {name: grdItem.DC_SHPWAY,  align : ""}],
	    		                          	[{name: "구매수량", align : ""}, 
	    		                          	 {name: grdItem.QT_ORD,     align : "ta-r"},
	    		                          	 {name: "반품수량", align : ""}, 
	    		                          	 {name: grdItem.QT_TKBK,  align : "ta-r"}]
            		                    ];            		
        			grd.options.editable.window.width = px;
            		tkbkDataVO.updateChange = code;
            		tkbkDataVO.inputPopupHeaderTitle = Util03saSvc.popupHeaderTitle(code, grdItem.NM_MRK, "tkbk");
            		grd.editRow(chked.closest("tr"));
                };
                         
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var mainGrd = $scope.tkbkkg;
                	
	                if (widget === mainGrd){
	                	//반품처리
	                	widget.element.find(".k-grid-tkbk-confirm").on("click", function(e){		                		
	                		clickEventValidNprocess(mainGrd, "003", "800px"); 
	                		return true;
	                	});
	                	
	                	//반품거부
	                	widget.element.find(".k-grid-tkbk-reject").on("click", function(e){	    
	                		clickEventValidNprocess(mainGrd, "002", "800px");
	                		return true;
	                	});	          
	                	
	                	//반품완료
	                	widget.element.find(".k-grid-tkbk-accept").on("click", function(e){	                		
	                		clickEventValidNprocess(mainGrd, "001", "550px");
                			return true;
	                	}); 
	                	
	                	//교환으로 변경
	                	widget.element.find(".k-grid-tkbk-change").on("click", function(e){	                		
	                		clickEventValidNprocess(mainGrd, "004", "700px");
                			return true;
	                	});
	                }
                });
	            
	            tkbkDataVO.initLoad();
            }]);
}());