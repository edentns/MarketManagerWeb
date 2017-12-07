(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.controller : sa.TkbkReqCtrl
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.controller")
        .controller("sa.TkbkReqCtrl", ["$scope", "$http", "$q", "$log", "sa.TkbkReqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "$window", "Util03saSvc", "APP_SA_MODEL",
            function ($scope, $http, $q, $log, saTkbkReqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, $window, Util03saSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
            		//마켓명 드랍 박스 실행	
            	var	mrkName = (function(){
            			UtilSvc.csMrkList().then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.ordMrkNameOp = res.data;
            				}
            			});
    	            }()),	
    	            //주문상태 드랍 박스 실행
    	            orderStatus = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.ordStatusOp = res.data;
            				}
            			});
    	            }()),
    	            //기간 상태 드랍 박스 실행
    	            betweenDate = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00064",
        					lcdcls: "SA_000023"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.betweenDateOptionOp = res.data;
            					tkbkDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
            				}
            			});
    	            }()),
    	            //반품 사유 코드
    	            cdTkbkrsn = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00050",
        					lcdcls: "SA_000009"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.cdTkbkrsnOp.dataSource = res.data;
            				}
            			});
    	            }()),
    	            //반품 거부 코드
    	            cdTkbkrjt = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00065",
        					lcdcls: "SA_000024",
	    					customnoc: "00000"        						
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.cdTkbkrjtOp.dataSource = res.data;
            				}
            			});
    	            }()),
    	            //지마켓 보류 사유 코드
    	            gHoldCode = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00074",
        					lcdcls: "SA_000029"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.gHoldCode = res.data;
            				}
            			});
    	            }()),
    	            //반품 상태 코드
    	            cdTkbkstat = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00066",
        					lcdcls: "SA_000025"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.cdTkbkstat = res.data;
            				}
            			});
    	            }());

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
                    CODE			 	: { type: "string"								, editable: false, nullable: false },
                    NO_MNGMRK		 	: { type: "string"								, editable: false, nullable: false },
                    CD_PARS_TKBK	 	: { type: "string"								, editable: false, nullable: false },
                    NO_INVO_TKBK	 	: { type: "string"								, editable: false, nullable: false },
                    AM_TKBKSHP			: { type: "number"								, editable: false, nullable: false },
				    NOW_YN		 		: { type: "boolean"								, editable: true,  nullable: false },
				    RECEIVE_SET  		: {
							                   	 type: "string"
							                   	,editable: true
							                   	,nullable: false
							                   	,validation: {
							                   		receive_setvalidation: function (input) {
							                   			if(tkbkDataVO.gCode.indexOf(tkbkDataVO.marketDivisionCode) > -1){
															if (input.is("[name=RECEIVE_SET]") && input.attr("required")) {			
																input.attr("data-receive_setvalidation-msg", "반품상품접수 여부를 선택해 주세요.");
																manualDataBind(input, "RECEIVE_SET");															
																return $("#receive-group").find("[type=radio]").is(":checked");															
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
														if (input.is("[name='DC_TKBKRJTCTT']") && input.val() !== "" && input.val().length > 1000) {
															input.attr("data-dc_tkbkrjtcttvalidation-msg", "반품거부사유를 1000자 이내로 입력해 주세요.");
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
							                		   if(tkbkDataVO.sCode.indexOf(tkbkDataVO.marketDivisionCode) > -1 && tkbkDataVO.updateChange === '003'){
													    	if (input.is("[name='CD_PARS']") && input.val() === "") {
							                                	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
							                                    return false;
							                                }
													    	/*if(input.is("[name='CD_PARS']") && input.val() != ""){					    		
													    		manualDataBind(input, "CD_PARS");
													    	};*/
							                		   };
							                		   return true;
											    	}
												}
	                    				  },	
	                NO_INVO				: {
						                    	type: APP_SA_MODEL.NO_INVO.type  
								     		   ,editable: true
								     		   ,nullable: false
								               ,validation: {
								            	   no_invovalidation: function (input) {								            		   
								            		   if(tkbkDataVO.sCode.indexOf(tkbkDataVO.marketDivisionCode) > -1 && tkbkDataVO.updateChange === '003'){
								            			  if (input.is("[name='NO_INVO']")) {
								            				  var result =  Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invovalidation');
								            				  if(result){
								            					  manualDataBind(input, "NO_INVO");
								            				  }
								            				  return result;
							                              }
								            		   };
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
													    	/*if(input.is("[name='CD_HOLD']") && input.val() != ""){										    		
													    		manualDataBind(input, "CD_HOLD");
													    	};*/
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
								            			   if (input.is("[name='CD_HOLD_FEE']") && (!input.val() || input.val()) < 1 && tkbkDataVO.etcCostCode === 'Y') {
							                                	input.attr("data-cd_hold_feevalidation-msg", "반품비를 입력해 주세요.");
							                                    return false;
							                               };
													      /* if(input.is("[name='CD_HOLD_FEE']") && input.val() != 0 && input.val()){										    		
													    		manualDataBind(input, "CD_HOLD_FEE");
													       };*/
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
							selected   : '1Week',
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
		        		userInfo : JSON.parse($window.localStorage.getItem("USER")).NM_EMP,
		        		updateChange : "",
		        		dataTotal : 0,
		        		resetAtGrd : "",
		        		param : "",
		        		shipList : "",
		        		gCode : ['170104','170102'],
		        		eCode : ['170106'],
		        		sCode : ['170103'],
		        		cCode : ['170902'],
		        		etcCostName : "",
		        		etcCostCode : "",
		        		gHoldCode : "",
		        		receiveCheckCode : 'Y',
		        		marketDivisionCode : ""
		        };   

                APP_SA_MODEL.CD_TKBKRSN.fNm  = "tkbkDataVO.cdTkbkrsnOp.dataSource";
                APP_SA_MODEL.CD_ORDSTAT.fNm  = "tkbkDataVO.ordStatusOp";
                APP_SA_MODEL.CD_TKBKSTAT.fNm = "tkbkDataVO.cdTkbkstat";
                APP_SA_MODEL.CD_PARS_TKBK.fNm  = "tkbkDataVO.shipList";
                
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
                              [APP_SA_MODEL.CD_TKBKRSN       , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.CD_ORDSTAT       , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD          , APP_SA_MODEL.DTS_TKBKREQ   ],
                              [APP_SA_MODEL.DTS_TKBKAPPRRJT  , APP_SA_MODEL.NO_TKBKAPPRRJT],
                              [APP_SA_MODEL.DTS_TKBKCPLT_VIEW, APP_SA_MODEL.NO_TKBKCPLT   ],
                              [APP_SA_MODEL.YN_CONN          , APP_SA_MODEL.CD_TKBKSTAT   ]
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
	            var manualDataBind = function(input, target){
	            	var getUid = input.parents("table").attr("data-uid"),
	            	    grid = $scope.tkbkkg,
	            	    viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	            	    dataItem = grid.dataItem(viewToRow);				                	    
	            	
	            	if(target === "CD_PARS" || target === "CD_HOLD"){
	            		var i, chosenPureData = input.data().handler.dataSource.data();
	            		for(i=0; i<chosenPureData.length; i++){
	            			if(chosenPureData[i]["CD_DEF"] === input.val()){
	            				dataItem[target] = chosenPureData[i];
	            			}
	            		};
	            	}else if(target === "NOW_YN"){
	            		dataItem[target] = input.is(":checked");	            		
	            	}else if(target === "RECEIVE_SET"){
	            		dataItem[target] = $("#receive-group").find("[type=radio]:checked").val();
	            	}else{
	            		dataItem[target] = input.val();
	            	};
	            },	            
	            ngIfdata = $scope.ngIfdata = function(input, eqInput){
	            	tkbkDataVO.marketDivisionCode = eqInput;
	            	return input.indexOf(eqInput) > -1;
	            },	            
	            receiveCheckClickEvent = $scope.receiveCheckClickEvent = function(e){
	            	var element = $(e.currentTarget),
                		checked = element.val();
	            	
	            	if(checked === 'N'){
	            		tkbkDataVO.receiveCheckCode = checked;
	            	}else{
	            		tkbkDataVO.ngIfinIt();
	            		
                		var ddl = element.parents("table").find("select[name=CD_HOLD]").data("kendoDropDownList"),
                			nutxt = element.parents("table").find("input[name=CD_HOLD_FEE]").data("kendoNumericTextBox");
                		
                		ddl.select(0);
                		ddl.trigger("change");
                		ddl.select(0);
                		
        				nutxt.value(0);
        				nutxt.trigger("change");
        				nutxt.value(0);
	            	};	            	
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
    				    NM_MRKITEM : tkbkDataVO.procName.value,
					    NO_MRK : tkbkDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : tkbkDataVO.ordStatusMo,
					    CD_TKBKSTAT : tkbkDataVO.cdTkbkstatMo,
					    NO_MRKORD : tkbkDataVO.orderNo.value,      
					    NM_PCHR : tkbkDataVO.buyerName.value,
					    DTS_CHK : tkbkDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(tkbkDataVO.datesetting.period.start.y, tkbkDataVO.datesetting.period.start.m-1, tkbkDataVO.datesetting.period.start.d).dateFormat("YmdHis"),           
					    DTS_TO : new Date(tkbkDataVO.datesetting.period.end.y, tkbkDataVO.datesetting.period.end.m-1, tkbkDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
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
	            tkbkDataVO.ngIfinIt = function(){
            		var me  = this;
            		
                	me.etcCostCode = "";                	
                	me.etcCostName = "";
                	me.receiveCheckCode = 'Y';                	
	            };	
		                  
	            tkbkDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.tkbkkg.wrapper.height(616);
	            		$scope.tkbkkg.resize();
	            		if(tkbkDataVO.param !== "") grdTkbkVO.dataSource.pageSize(9);
	            	}
	            	else {
	            		$scope.tkbkkg.wrapper.height(798);
	            		$scope.tkbkkg.resize();
	            		if(tkbkDataVO.param !== "") grdTkbkVO.dataSource.pageSize(12);
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
                    	    code = e.model.CODE;                    	
                    	
                    	// 반품 완료              	
                    	if(tkbkDataVO.updateChange === "001"){
                    		
                    	// 반품 거절
                    	}else if(tkbkDataVO.updateChange === "002"){
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
                    	}else if(tkbkDataVO.updateChange === "003"){
                    		var selector = e.container,
                    			ddlHoldReasonCodeSel = e.container.find("select[name=CD_HOLD]");
                    		
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
                    				var deliverDS = dataVo.shipList.filter(function(ele){
    	    	            			return ele.DC_RMK1 === e.model.NO_MRK;
    	    	            		});	            				
                    				e.container.find("select[name=CD_PARS]").kendoDropDownList({
    	    	            			dataSource : deliverDS,
    	    	                		dataTextField : "NM_PARS_TEXT",
    	    	                		dataValueField : "CD_DEF",
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
    	    	                		}
    	    	            		});
                    				break;
                    			}
                    			default : {
                    				break;
                    			}
                    		}
                    	}                  	
                    },
                    cancel: function(e) {                    	
                    	tkbkDataVO.ngIfinIt();
                    	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
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
                        						return;
                        					};
                        					
                        					param[0].DTS_TKBKCPLT = kendo.toString(new Date(param[0].DTS_TKBKCPLT), "yyyyMMddHHmmss");                                			
                        					
                        					saTkbkReqSvc.tkbkCompleted(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품완료 되었습니다.");
                        							$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품완료가 실패하였습니다.");
                        							e.error();
                        						}
                        					},function(err){
                        						e.error([]);
                        					});
        		                			return defer.promise;
                    	            	}else{
                    	            		tkbkGrd.cancelRow();
                    	            		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                    	            	}
                						break;
                					}
                					case '002' : {
                						if(confirm("선택하신 주문을 반품 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "" && whereIn.indexOf(ele.CD_ORDSTAT) > -1);
                								});                             					
                        					if(param.length !== 1){
                        						alert("주문 상태를 확인해 주세요.");
                        						return;
                        					};  
                        					saTkbkReqSvc.tkbkReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품거부 하였습니다.");
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					},function(err){
                        						e.error([]);
                        					}); 
        		                			return defer.promise;
                						}else{
                    	            		tkbkGrd.cancelRow();
                    	            		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                    	            	}
                						break;
                					}
                					case '003' : {
                						if(confirm("선택하신 주문을 처리하시겠습니까?")){
                							var defer = $q.defer(),
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "" && whereIn.indexOf(ele.CD_ORDSTAT) > -1);
                								});                 							
                							if(e.data.models.length !== param.length){
                								alert("배송처리 된 반품요청 주문만 승인 처리 할 수 있습니다.");
                        						return;
                							};
                							saTkbkReqSvc.tkbkConfirm(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품처리 하였습니다.");
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품처리를 실패하였습니다.");
                        							e.error();
                        						}
                        					},function(err){
                        						e.error([]);
                        					}); 
                							return defer.promise;
                						}else{
                    	            		tkbkGrd.cancelRow();
                    	            		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                    	            	}
                						break;
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
                
                var clickEventValidNprocess = function(grd, code, px){
            		var	chked = grd.element.find(".k-grid-content input:checked"),
    			    	grdItem = grd.dataItem(chked.closest("tr")),
    			    	chkedLeng = grd.element.find(".k-grid-content input:checked").length,
    			    	cdDelivred = ['004','005'],
    			    	tkbkcd = ['002','005'];
                	
                	if(chkedLeng != 1){
        				alert("한 건의 주문을 선택해 주세요");	
        				return false;
        			};
    			
    				switch(code){
	                	case '002' : {
	            			if(tkbkDataVO.gCode.indexOf(grdItem.CODE) > -1){
	            				alert("지마켓,옥션은 거부 기능을 사용할 수 없습니다.");
	            				return false;
	            			};
	            			if(tkbkDataVO.cCode.indexOf(grdItem.CODE) > -1){
	            				alert("쿠팡은 거부 기능을 사용할 수 없습니다.");
	            				return false;
	            			};   			
						};
                		case '003' : {
                			if(grdItem.CD_TKBKSTAT !== "001" || cdDelivred.indexOf(grdItem.CD_ORDSTAT) < 0){
                				alert("주문상태를 확인해 주세요.");
                				return false;
                			}
                			break;
                		};
						case '001' : {
                			if(tkbkcd.indexOf(grdItem.CD_TKBKSTAT) < 0){
                				alert("반품처리 된 주문만 완료 처리 할 수 있습니다.");
                				return false;
                			};
                			grdItem.DTS_TKBKCPLT = new Date();
							break;
						};
						default : {
							return false;
							break;
						}
    				};

        			grd.options.editable.window.width = px;
            		tkbkDataVO.updateChange = code;
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
	                }
                });
	            
            }]);
}());
