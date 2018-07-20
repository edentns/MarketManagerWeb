(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.ShpIng.controller : sa.ShpIngCtrl
     * 상품분류관리
     */
    angular.module("sa.ShpIng.controller")
        .controller("sa.ShpIngCtrl", ["$scope", "$state","$http", "$q", "$log", "sa.ShpIngSvc", "APP_CODE", "APP_MSG", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "sa.OrdCclSvc", "Util03saSvc", "APP_SA_MODEL", "sa.ShpStdbyOrdSvc", 
            function ($scope, $state, $http, $q, $log, saShpIngSvc, APP_CODE, APP_MSG, $timeout, resData, Page, UtilSvc, MenuSvc, saOrdCclSvc, Util03saSvc, APP_SA_MODEL, ShpStdbyOrdSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);	            

            var grdField = {
				ROW_CHK 				: {	type : APP_SA_MODEL.ROW_CHK.type,			editable : true,		nullable : false	},
				Type					: {	type : "string",							editable : true,		nullable : false	},
				NO_ORD 					: {	type : APP_SA_MODEL.NO_ORD.type,			editable : false,		nullable : false	},
				NO_APVL 				: {	type : APP_SA_MODEL.NO_APVL.type,			editable : false,		nullable : false	},
				NM_MRK 					: {	type : APP_SA_MODEL.NM_MRK.type,			editable : false,		nullable : false	},
				NO_MRKORD 				: {	type : APP_SA_MODEL.NO_MRKORD.type,			editable : false,		nullable : false	},
				NO_MRKITEMORD 			: {	type : APP_SA_MODEL.NO_MRKITEMORD.type,		editable : false,		nullable : false	},
				NO_MRKITEM 				: {	type : APP_SA_MODEL.NO_MRKITEM.type,		editable : false,		nullable : false	},
				NO_MRKREGITEM 			: {	type : APP_SA_MODEL.NO_MRKREGITEM.type,		editable : false,		nullable : false	},
				NM_MRKITEM 				: {	type : APP_SA_MODEL.NM_MRKITEM.type,		editable : false,		nullable : false	},
				NM_MRKOPT 				: {	type : APP_SA_MODEL.NM_MRKOPT.type,			editable : false,		nullable : false	},
				AM_ORDSALEPRC 			: {	type : APP_SA_MODEL.AM_ORDSALEPRC.type,		editable : false,		nullable : false	},
				AM_PCHSPRC 				: {	type : APP_SA_MODEL.AM_PCHSPRC.type,		editable : false,		nullable : false	},
				NM_PCHR 				: {	type : APP_SA_MODEL.NM_PCHR.type,			editable : false,		nullable : false	},
				NM_CONS 				: {	type : APP_SA_MODEL.NM_CONS.type,			editable : false,		nullable : false	},
				NO_PCHRPHNE 			: {	type : APP_SA_MODEL.NO_PCHRPHNE.type,		editable : false,		nullable : false	},
				NO_CONSHDPH 			: {	type : APP_SA_MODEL.NO_CONSHDPH.type,		editable : false,		nullable : false	},
				DC_PCHREMI 				: {	type : APP_SA_MODEL.DC_PCHREMI.type,		editable : false,		nullable : false	},
				DC_CONSNEWADDR 			: {	type : APP_SA_MODEL.DC_CONSNEWADDR.type,	editable : false,		nullable : false	},
				DC_CONSOLDADDR 			: {	type : APP_SA_MODEL.DC_CONSOLDADDR.type,	editable : false,		nullable : false	},
				DC_PCHRREQCTT 			: {	type : APP_SA_MODEL.DC_PCHRREQCTT.type,		editable : false,		nullable : false	},
				CD_ORDSTAT 				: {	type : APP_SA_MODEL.CD_ORDSTAT.type,		editable : false,		nullable : false	},
				DC_SHPWAY 				: {	type : APP_SA_MODEL.DC_SHPWAY.type,			editable : false,		nullable : false	},
				DTS_ORD 				: {	type : APP_SA_MODEL.DTS_ORD.type,			editable : false,		nullable : false	},
				DT_SND 					: {	type : APP_SA_MODEL.DT_SND.type,			editable : false,		nullable : false	},
				QT_ORD 					: {	type : APP_SA_MODEL.QT_ORD.type,			editable : false,		nullable : false	},
				CD_SHPSTAT 				: {	type : APP_SA_MODEL.CD_SHPSTAT.type,		editable : false,		nullable : false	},
				CD_PARS 				: {	type : APP_SA_MODEL.CD_PARS.type,			editable : false,		nullable : false	},
				AM_CJM 					: {	type : APP_SA_MODEL.AM_CJM.type,			editable : false,		nullable : false	},
				NM_ORDSTAT				: {	type : APP_SA_MODEL.NM_ORDSTAT.type,		editable : false,		nullable : false	},
				AM_ITEMPRC 				: {	type : "number",							editable : false,		nullable : false	},
				AM_SHPCOST 				: {	type : "number",							editable : false,		nullable : false	},
				AM_TKBKSHP 				: {	type : "number",							editable : false,		nullable : false	},
				SEQ_TKBK				: {	type : "number",							editable : false,		nullable : false	},
				QT_TKBK_OUT				: {	type : "number",							editable : false,		nullable : false	},
				DC_SHPCOSTSTAT 			: {	type : "string",							editable : false,		nullable : false	},				
				YN_CONFIRM 				: {	type : "string",							editable : false,		nullable : false	},	
				DC_SHPCOSTSTAT_TRANS 	: {	type : "string",							editable : false,		nullable : false	},
				DC_SHPCOSTSTAT_TRANS_ETC: {	type : "string",							editable : false,		nullable : false	},
				tkbk_responsibility 	: { type : "string",	   			   			editable : true,		nullable : false	},
				NOW_YN 					: { 
					type : "string",	   			   			
					editable : true,		
					nullable : false
				},
				QT_TKBK 				: {
					type : "number",
					editable : true,
					nullable : false,
					validation : {
						qt_tkbk_inputvalidation : function(input) {
							if (input.is("[name='QT_TKBK']") && !input.val()) {
								input.attr("data-qt_tkbk_inputvalidation-msg", "수량을 선택해 주세요.");
								return false;
							}
							return true;
						}
					}
				},
				CD_TKBKGOODSSTATUS 		: {
					type : "array",
					editable : true,
					nullable : false,
					validation : {
						cd_tkbkgoodsstatus_inputvalidation : function(input) {
							if (input.is("[name='CD_TKBKGOODSSTATUS']") && !input.val()) {
								input.attr("data-cd_tkbkgoodsstatus_inputvalidation-msg", "상품상태를 선택해 주세요.");
								return false;
							}
							return true;
						}
					}
				},
				CD_TKBKHRNKRSN 			: {
					type : "array",
					editable : true,
					nullable : false,
					validation : {
						cd_tkbkhrnkrsn_inputvalidation : function(input) {
							if (input.is("[name='CD_TKBKHRNKRSN']") && !input.val()) {
								input.attr("data-cd_tkbkhrnkrsn_inputvalidation-msg","반품사유를 선택해 주세요.");
								return false;
							}
							return true;
						}
					}
				},
				CD_TKBKLRKRSN 			: {
					type : "array",
					editable : true,
					nullable : false,
					validation : {
						cd_tkbklrkrsn_inputvalidation : function(input) {
							if (input.is("[name='CD_TKBKLRKRSN']") && !input.val()) {
								input.attr("data-cd_tkbklrkrsn_inputvalidation-msg", "반품사유2를 선택해 주세요.");
								return false;
							}
							return true;
						}
					}
				},
				DC_TKBKRSNCTT 			: {
					type : "string",
					editable : true,
					nullable : false,
					validation : {
						dc_tkbkrsnctt_inputvalidation : function(input) {
							if (input.is("[name='DC_TKBKRSNCTT']") && !input.val()) {
								input.attr("data-dc_tkbkrsnctt_inputvalidation-msg","반품상세 사유를 입력해 주세요.");
								return false;
							}
							if (input.is("[name='DC_TKBKRSNCTT']") && input.val() && (input.val().length < 3 || input.val().length > 200)) {
								input.attr("data-dc_tkbkrsnctt_inputvalidation-msg","반품상세 사유를 3자이상 200자 이하로 입력해 주세요.");
								return false;
							}
							return true;
						}
					}
				},
				RECEIVE_SET 			: {
					type : "string",
					editable : true,
					nullable : false,
					validation : {
						receive_setvalidation : function(input) {
							if (input.is("[name=RECEIVE_SET]") && input.attr("required") && input.filter("[type=radio]")) {
								if (!$("#receive-group").find("[type=radio]").is(":checked")) {
									input.attr("data-receive_setvalidation-msg","버튼을 선택해 주세요.");
									return false;
								}else{
									input.parents("ul").find("div").remove();
								}
							};
							return true;
						}
					}
				},
				SFEE_RADIO_SELECTED 	: {
					type : "string",
					editable : true,
					nullable : false,
					validation : {
						sfee_setvalidation : function(input) {
							if (input.is("[name=SFEE_RADIO_SELECTED]") && input.attr("required")) {
								/*if ($("#sfee-group").find("[type=radio]").is(":checked")) {
									Util03saSvc.manualTkbkDataBind($scope.shippingkg, input, "SFEE_RADIO_SELECTED");
									return true;
								} else {
									input.attr("data-sfee_setvalidation-msg","버튼을 선택해 주세요.");
									return false;
								}*/
								
								if (!$("#sfee-group").find("[type=radio]").is(":checked")) {
									input.attr("data-sfee_setvalidation-msg","버튼을 선택해 주세요.");
									return false;
								}else{
									input.parents("ul").find("div").remove();
								}
							};
							return true;
						}
					}
				},
				CD_PARS_INPUT 			: {
					type : "array",
					editable : true,
					nullable : false,
					validation : {
						cd_pars_inputvalidation : function(input) {
							//배송정보 수정 & 스토어팜반품 신청  & 지옥
							if ((input.is("[name='CD_PARS_INPUT']") || input.is("[name='CD_PARS_STORE']") || input.is("[name='CD_PARS_GA']")) && !input.val()) {
								input.attr("data-cd_pars_inputvalidation-msg","택배사를 선택해 주세요.");
								return false;
							}
							/*else if (input.is("[name='CD_PARS_COU']") && !input.val()) {
								var getUid = input.parents("table").attr("data-uid"),
		            		   	   	grid = $scope.shippingkg,
		            		   	   	viewToRow = $("[data-uid='" + getUid + "']", grid.table),
		            		   	   	dataItem = grid.dataItem(viewToRow);
								
								if(dataItem.RECEIVE_SET === 'Y'){
									input.attr("data-cd_pars_inputvalidation-msg","택배사를 선택해 주세요.");
									return false;
								}else{
									return true;
								}
							};*/
							return true;
						}
					}
				},
				NO_INVO_INPUT 			: {
					type : "string",
					editable : true,
					nullable : false,
					validation : {
						no_invo_inputvalidation : function(input) {
							/*if (input.is("[name='NO_INVO_STORE']")) {
								return Util03saSvc.NoINVOValidation(input,'NO_INVO_STORE','no_invo_inputvalidation',0);								
							}
							else if (input.is("[name='NO_INVO_E']")) {
								return Util03saSvc.NoINVOValidation(input,'NO_INVO_E','no_invo_inputvalidation',0);								
							}
							else if (input.is("[name='NO_INVO_GA']")) {
								return Util03saSvc.NoINVOValidation(input,'NO_INVO_GA','no_invo_inputvalidation',0);								
							}
							else if (input.is("[name='NO_INVO_COU']")) {
								*var getUid = input.parents("table").attr("data-uid"),
		            		   	   	grid = $scope.shippingkg,
		            		   	   	viewToRow = $("[data-uid='" + getUid + "']", grid.table),
		            		   	   	dataItem = grid.dataItem(viewToRow);
								if(dataItem.RECEIVE_SET === 'Y'){
									return Util03saSvc.NoINVOValidation(input,'NO_INVO_COU','no_invo_inputvalidation');
								}else{
									return true;
								}
								return Util03saSvc.NoINVOValidation(input,'NO_INVO_COU','no_invo_inputvalidation',0);
							}*/
							if(input.is("[name='NO_INVO_STORE']") || input.is("[name='NO_INVO_E']") || input.is("[name='NO_INVO_GA']") || input.is("[name='NO_INVO_COU']")){
								var getUid = input.parents("table").attr("data-uid"),
		            		   	   	grid = $scope.shippingkg,
		            		   	   	viewToRow = $("[data-uid='" + getUid + "']", grid.table),
		            		   	   	dataItem = grid.dataItem(viewToRow)
	            		   	   	
		            		   	if(!dataItem.CD_PARS_INPUT && input.val()){
		            		   		input.attr("data-no_invo_inputvalidation-msg","택배사를 선택해 주세요.");
									return false;
								}else{
									return Util03saSvc.NoINVOValidation(input,'NO_INVO_GA','no_invo_inputvalidation',0);
								}
							}
							return true;
						}
					}
				},
				NO_INVO 				: {
					type : "string",
					editable : true,
					nullable : false,
					validation : {
						no_invovalidation : function(input) {
							//배송정보 수정
							if (input.is("[name='NO_INVO']")) {
								return Util03saSvc.NoINVOValidation(input,'NO_INVO','no_invovalidation');								
							}
							return true;
						}
					}
				},
			    transform_pay_reason	: {
			    	type: "array",
     			   	editable: true,
     			   	nullable: false,
     			   	validation: {
                		transform_pay_reasonvalidation: function (input) {
                			if(input.is("[name='transform_pay_reason']")){
                				var getUid = input.parents("table").attr("data-uid"),
		            		   	   	grid = $scope.shippingkg,
		            		   	   	viewToRow = $("[data-uid='" + getUid + "']", grid.table),
		            		   	   	dataItem = grid.dataItem(viewToRow),
		            		   	   	tkbkResponsibility = dataItem.tkbk_responsibility === '구매자';
                				
                				if(!input.val() && tkbkResponsibility){
                    				input.attr("data-transform_pay_reasonvalidation-msg", "반품배송비 결제 방법을 선택해 주세요.");
                    				return false;
                				}
                            };
                			return true;
				    	}
     			   }
 				}
			};

            APP_SA_MODEL.CD_ORDSTAT.fNm = "shippingDataVO.ordStatusOp";
            APP_SA_MODEL.CD_SHPSTAT.fNm = "shippingDataVO.shipStatusOp";
                
            var grdCol = [[APP_SA_MODEL.ROW_CHK],                              
                          [APP_SA_MODEL.NO_ORD       , [APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                          [APP_SA_MODEL.NM_MRK       , APP_SA_MODEL.NO_MRKITEMORD ],
                          [APP_SA_MODEL.NO_MRKITEM   , APP_SA_MODEL.NO_MRKREGITEM ],
                          [APP_SA_MODEL.NM_MRKITEM   , APP_SA_MODEL.NM_MRKOPT     ],
                          [APP_SA_MODEL.AM_ORDSALEPRC, APP_SA_MODEL.AM_CJM	      ],
                          [APP_SA_MODEL.NM_PCHR      , APP_SA_MODEL.NM_CONS       ],
                          [APP_SA_MODEL.NO_PCHRPHNE  , APP_SA_MODEL.NO_CONSHDPH   ],
                          [APP_SA_MODEL.DC_PCHREMI   , APP_SA_MODEL.DC_CONSNEWADDR],
                          [APP_SA_MODEL.DC_PCHRREQCTT, APP_SA_MODEL.DC_CONSOLDADDR],
                          [APP_SA_MODEL.NM_ORDSTAT   , APP_SA_MODEL.DC_SHPWAY     ],
                          [APP_SA_MODEL.DTS_ORD      , APP_SA_MODEL.DT_SND        ],
                          [APP_SA_MODEL.CD_PARS      , APP_SA_MODEL.NO_INVO       ],
                          [APP_SA_MODEL.QT_ORD       ]
                         ],
                grdDetOption      = {},
                grdRowTemplate    = "<tr data-uid=\"#= uid #\">\n",
                grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\">\n",
                grdCheckOption    = {clickNm:"onOrdGrdCkboxClick", allClickNm:""};
            
            grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
            grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
            grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
	            
	        var shippingDataVO = $scope.shippingDataVO = {
        		boxTitle : "배송중",
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
        		updateChange : "",
        		dataTotal : 0,
        		resetAtGrd :"",
        		param : "",
        		menualShwWrn : "",
        		curCode : "",
        		tkbkhrnkrsnDs     : [],
        		tkbkhrnkrsnDsGau  : [],
        		tkbkhrnkrsnDsStr  : [],
        		tkbkhrnkrsnDsCou  : [],
        		tkbkhrnkrsnDsCouSub  : [],
        		tkbkhrnkrsnDsEl   : [],
        		tkbkGoodsStatusOp : {
        			 dataSource: []
        			,dataTextField:"NM_DEF"
                    ,dataValueField:"CD_DEF"
        		},
        		tkbkhrnkrsnOp : {
        			 dataTextField:"NM_DEF"
                    ,dataValueField:"CD_DEF"
                    ,optionLabel : "반품사유코드를 선택해 주세요. "
                    /*,enable: false
                    ,valuePrimitive: true*/
        		},
        		cdparsOp : {
        			 dataTextField:"NM_PARS_TEXT"
 	                ,dataValueField:"CD_DEF"
                	,optionLabel : "택배사를 선택해 주세요 "	
        		},
        		tkbkPayRtnMethod : {
       			 	 dataSource: []
       			 	,dataTextField:"NM_DEF"
	                ,dataValueField:"CD_DEF"
	                ,optionLabel : "반품배송비 결제 방법을 선택해 주세요."	
                	,select : function(e){
                		var me = this;
                		saShpIngSvc.tkbkPayRtnMethodSelector(me);                		
                	}
        		}
            };
	            
	        shippingDataVO.initLoad = function () {
            	var me = this;
            	var ordParam = {
            			lnomngcdhd: "SYCH00048",
    					lcdcls: "SA_000007",
    					customnoc : '00000',
    					mid: menuId
    				},
    				betParam = {
    					lnomngcdhd: "SYCH00075",
    					lcdcls: "SA_000030",
    					customnoc : '00000'
    				},
    				shipStsParam = {
    					lnomngcdhd: "SYCH00060",
    					lcdcls: "SA_000019"
            		},
            		tkbkhrnkrsnParam = {
    					lnomngcdhd: "SYCH00050",
    					lcdcls: "SA_000009",
    					customnoc: "00000"
            		},
            		tkbkGoodsStatusParam = {
    					lnomngcdhd: "SYCH00116",
    					lcdcls: "SA_000033",
    					customnoc: "00000"
            		},
            		tkbkPayRtnMethod = {
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
        			//배송 상태 디렉시브	
        			UtilSvc.getCommonCodeList(shipStsParam).then(function (res) {
        				return res.data;
        			}),
        			//반품 사유 코드 
        			UtilSvc.getCommonCodeList(tkbkhrnkrsnParam).then(function (res) {
        				return res.data;
        			}),
        			//상품 상태	
        			UtilSvc.getCommonCodeList(tkbkGoodsStatusParam).then(function (res) {
        				return res.data;
        			}),
        			//교환배송비 전달 방법
        			UtilSvc.getCommonCodeList(tkbkPayRtnMethod).then(function (res) {
        				return res.data;
        			})
                ]).then(function (result) {
                    me.ordMrkNameOp = result[0];
                    me.ordStatusOp = result[1];
                    me.betweenDateOptionOp = result[2];
                    me.betweenDateOptionMo = result[2][0].CD_DEF; 
                    me.shipStatusOp = result[3];
                    me.tkbkhrnkrsnDs = result[4];
                    me.tkbkGoodsStatusOp.dataSource = result[5];
                    me.tkbkPayRtnMethod.dataSource = result[6];
                    
                    saShpIngSvc.tkbkhrnkrsnBind(me);
                    
                    $timeout(function(){
                    	shippingDataVO.isOpen(false);
        				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                    },0);
                });
            };
                
	        //조회
            shippingDataVO.inQuiry = function(){
            	var me = this;
            	me.param = {
				    NM_MRKITEM : me.procName.value,
				    NO_MRK : me.ordMrkNameMo, 
				    CD_ORDSTAT : me.ordStatusMo,
				    NO_MRKORD : me.orderNo.value,      
				    NM_PCHR : me.buyerName.value,					    
				    DTS_CHK : me.betweenDateOptionMo,  
				    DTS_FROM : new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
				    DTS_TO : new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
				    DTS_SELECTED : me.datesetting.selected,
					DTS_STORAGE_FROM: me.datesetting.period.start,
					DTS_STORAGE_TO: me.datesetting.period.end,
				    NM_MRK_SELCT_INDEX : me.ordMrkNameOp.allSelectNames,
				    NM_ORDSTAT_SELCT_INDEX : me.ordStatusOp.allSelectNames,
				    CASH_PARAM : resData.storageKey
                };   
				if(Util03saSvc.readValidation(me.param)){
					$scope.shippingkg.dataSource.data([]);  
	            	$scope.shippingkg.dataSource.page(1);  // 페이지 인덱스 초기화              
	            	//$scope.shippingkg.dataSource.read();			        				  
				};
            };
	            		        
            //초기화버튼
            shippingDataVO.inIt = function(){
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
            	me.resetAtGrd = $scope.shippingkg;
            	me.resetAtGrd.dataSource.data([]);
            	me.curCode = ""
            };
            
            //kendo grid 체크박스 옵션
            $scope.onOrdGrdCkboxClick = function(e){
            	saShpIngSvc.grdChkBoxClk(e, $scope.shippingkg);
            };
            //반응형 그리드
            shippingDataVO.isOpen = function (val) {
            	Util03saSvc.isOpen($scope.shippingkg, shippingDataVO, grdShippngVO, val);
            };
	            
            //검색 그리드
	        var grdShippngVO = $scope.grdShippngVO = {
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
                collapse: function(e) {
                    this.cancelRow();
                },       
                editable: {
                	mode: "popup",
            		window : {
            	        title: ""
            	    },
            		template: kendo.template($.trim(angular.element("#shipping_popup_common_template").html())),
            		confirmation: false
                },
                edit: function(e){
                	var model = e.model,
                	    vo = shippingDataVO,
            			selector = e.container,
                	    pickShippingList = {};
                	
                	if(model.Type === "001"){
        				pickShippingList.shpList = Util03saSvc.shppingList().query({shippingType:"001", mrkType:model.NO_MRK});
        				pickShippingList.mrks = model.NO_MRK;
        				pickShippingList.selector = selector;
        				pickShippingList.kg = $scope.shippingkg;
        				pickShippingList.val = model.TEMP_CD_PARS;
        				pickShippingList.txtFld = "NM_PARS_TEXT";
        				pickShippingList.valFld = "CD_PARS";
        				pickShippingList.findEle = "CD_PARS_INPUT";            				

            			saShpIngSvc.shpList(pickShippingList);
    				}else{
    					saShpIngSvc.grdEdit(model, vo, selector, $scope.shippingkg);
    				}
                },
            	scrollable: true,
            	resizable: true,
            	rowTemplate: kendo.template($.trim(grdRowTemplate)),
            	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
            	height: 616,
            	navigatable: true, //키보드로 그리드 셀 이동 가능
            	toolbar: [{template: kendo.template($.trim(angular.element("#shipping_toolbar_template").html()))}],
            	dataSource: new kendo.data.DataSource({
            		transport: {
            			read: function(e) {
            				saShpIngSvc.orderList(shippingDataVO.param).then(function (res) {
        						e.success(res.data);			                   				                    					
        					}, function(err){
        						e.error([]);
        					});
            			},
            			update: function(e){
            				var vo = shippingDataVO;
            				saShpIngSvc.grdUpdate(e.data.models).then(function(res){
     							alert(res.msg);
            					Util03saSvc.storedQuerySearchPlay(vo, resData.storage);
            				}, function(err){
            					if(err.msg === "not equal"){
         	            			vo.menualShwWrn = err.val; //송장번호 틀렷을 경우 에러 메세지
            					}
            					else if(err === "cancel row"){
            						$scope.shippingkg.cancelChanges();
            					}
            					else{
            						alert(err.msg);
            					}
            					e.error([]);
            				});
            			},                			
            			parameterMap: function(e, operation) {
            				if(operation !== "read" && e.models) {
            					return {models:kendo.stringify(e.models)};
            				}
            			}
            		},
            		change: function(e){
            			var data = this.data();
            			shippingDataVO.dataTotal = data.length;
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
	        grdShippngVO.tooltipOptions = UtilSvc.gridtooltipOptions;		        
	            
	        $scope.$on("kendoWidgetCreated", function(event, widget){
	        	var grd = $scope.shippingkg;
	        	
	            if (widget === grd){
	            	//배송정보 수정
	            	widget.element.find(".k-grid-shpping").on("click", function(e){
	            		if(grd.element.find(".k-grid-content input:checked").length != 1){
	            			alert(APP_MSG.caseOneMoreThanOrdChk);
	            			return false;
	            		};	                		
	            		
	            		var chked = grd.element.find(".k-grid-content input:checked"),
	            			dataItem = grd.dataItem(chked.closest("tr"));
	            		
	            		var widgetPopupOpen = function(px, code){	 
	            			shippingDataVO.inputPopupHeaderTitle = Util03saSvc.popupHeaderTitle(code, dataItem.NM_MRK, "shpping");
	        				dataItem.Type = code;		            				 
	            			grd.options.editable.window.width = px;		            			
	            			grd.editRow(chked.closest("tr"));	         	
	            		};
					
	    				if($(this).hasClass("edit") && saShpIngSvc.widgetValidation(1, dataItem)){
	    					widgetPopupOpen("605px", "001");
	                    }
	                    else if($(this).hasClass("request") && saShpIngSvc.widgetValidation(2, dataItem)){
	                    	widgetPopupOpen("605px", "002");
	                    };
	            	});
	            }
	        });  
	            
	        shippingDataVO.initLoad();
        }]);    
}());