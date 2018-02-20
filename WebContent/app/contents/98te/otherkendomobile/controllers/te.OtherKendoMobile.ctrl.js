(function () {
    "use strict";

    /**
     * Mobile Test
     */
    angular.module("te.Mobile.controller")
        .controller("te.MobileCtrl", ["$scope", "$q", "sy.CodeSvc", "te.MobileSvc", "resData", "Page", "$state", 'MenuSvc', "$location", "$window", "UtilSvc", "APP_CODE", "APP_SA_MODEL", "sa.OrdShpAllSvc", "$timeout", "Util03saSvc",  
            function ($scope, $q, SyCodeSvc, MobileSvc, resData, Page, $state, MenuSvc, $location, window, UtilSvc, APP_CODE, APP_SA_MODEL, saOrdShpAllSvc, $timeout, Util03saSvc) {
	        	var page  = $scope.page = new Page({ auth: resData.access }),
	            	today = edt.getToday();

	        	var teMobileVO = $scope.teMobileVO = {
	        		boxTitle : "Mobile Top",
	        		setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
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
	        		shipStatusOp : []
		        };
	        	
	        	teMobileVO.grdField =  {
                    NO_ORD         : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL        : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK         : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD      : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    NO_MRKITEM     : { type: APP_SA_MODEL.NO_MRKITEM.type     , editable: false, nullable: false},
                    NO_MRKREGITEM  : { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NO_MRKITEMORD  : { type: APP_SA_MODEL.NO_MRKITEMORD.type  , editable: false, nullable: false },
                    NM_MRKITEM     : { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: false, nullable: false },
                    NM_MRKOPT      : { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },
                    QT_ORD         : { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    AM_ORDSALEPRC  : { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    NM_PCHR        : { type: APP_SA_MODEL.NM_PCHR.type        , editable: false, nullable: false },
                    NM_CONS        : { type: APP_SA_MODEL.NM_CONS.type        , editable: false, nullable: false },
                    NO_PCHRPHNE    : { type: APP_SA_MODEL.NO_PCHRPHNE.type    , editable: false, nullable: false },
                    DC_PCHREMI     : { type: APP_SA_MODEL.DC_PCHREMI.type     , editable: false, nullable: false },
                    NO_CONSPHNE    : { type: APP_SA_MODEL.NO_CONSPHNE.type    , editable: false, nullable: false },
                    DC_CONSNEWADDR : { type: APP_SA_MODEL.DC_CONSNEWADDR.type , editable: false, nullable: false },
                    DC_CONSOLDADDR : { type: APP_SA_MODEL.DC_CONSOLDADDR.type , editable: false, nullable: false },
                    CD_ORDSTAT     : { type: APP_SA_MODEL.CD_ORDSTAT.type     , editable: false, nullable: false },
                    DC_SHPWAY      : { type: APP_SA_MODEL.DC_SHPWAY.type      , editable: false, nullable: false },
                    DTS_ORD        : { type: APP_SA_MODEL.DTS_ORD.type        , editable: false, nullable: false },
                    DTS_ECHGAPPRRJT: { type: APP_SA_MODEL.DTS_ECHGAPPRRJT.type, editable: false, nullable: false },
                    NO_INVO        : { type: APP_SA_MODEL.NO_INVO.type        , editable: false, nullable: false },
                    NM_PARS        : { type: APP_SA_MODEL.NM_PARS.type        , editable: false, nullable: false },
                    DTS_ORDDTRM    : { type: APP_SA_MODEL.DTS_ORDDTRM.type    , editable: false, nullable: false },
                    NO_CONSHDPH    : { type: APP_SA_MODEL.NO_CONSHDPH.type    , editable: false, nullable: false },
                    AM_PCHSPRC     : { type: APP_SA_MODEL.AM_PCHSPRC.type     , editable: false, nullable: false },
                    DT_SND         : { type: APP_SA_MODEL.DT_SND.type         , editable: false, nullable: false },                    
                    DC_PCHRREQCTT  : { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false },
                    YN_DEL  	   : { type: APP_SA_MODEL.YN_DEL.type  		  , editable: false, nullable: false },
                    AM_CJM		   : { type: APP_SA_MODEL.AM_CJM.type  		  , editable: false, nullable: false }
	            };
	        	
	        	APP_SA_MODEL.CD_ORDSTAT.fNm  = "teMobileVO.ordStatusOp";
                
                var grdCol = [[{field:"hierarchy"}],
                              [APP_SA_MODEL.NO_ORD       ,[APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK       , APP_SA_MODEL.NO_MRKITEMORD ],
                              [APP_SA_MODEL.NO_MRKITEM   , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM   , APP_SA_MODEL.NM_MRKOPT     ],
                              [APP_SA_MODEL.AM_ORDSALEPRC, APP_SA_MODEL.AM_CJM    	  ],
                              [APP_SA_MODEL.NM_PCHR      , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.NO_PCHRPHNE  , APP_SA_MODEL.NO_CONSHDPH   ],
                              [APP_SA_MODEL.DC_PCHREMI   , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.DC_PCHRREQCTT, APP_SA_MODEL.DC_CONSOLDADDR],
                              [APP_SA_MODEL.CD_ORDSTAT   , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORDDTRM  , APP_SA_MODEL.DTS_ORD       ],
                              [APP_SA_MODEL.NM_PARS      , APP_SA_MODEL.NO_INVO       ],
                              [APP_SA_MODEL.DT_SND       , APP_SA_MODEL.QT_ORD        ]
                             ],
                    grdDetOption      = {},
                    grdRowTemplate    = "<tr class=\"k-master-row\" data-uid=\"#= uid #\">\n",
                    grdAltRowTemplate = "<tr class=\"k-master-row k-alt\" data-uid=\"#= uid #\">\n",
                    grdCheckOption    = {clickNm:"",
                		                 allClickNm:""};
                
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
	        	
                teMobileVO.initLoad = function () {
	            	var me = this;
                	var ordParam = {
        					lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				};
                	var betParam = {
        					lnomngcdhd: "SYCH00055",
        					lcdcls: "SA_000014"
        				};
                    $q.all([
                        UtilSvc.csMrkList().then(function (result) {
                        	return result.data;
            			}),
            			UtilSvc.getCommonCodeList(ordParam).then(function (result) {
            				return result.data;
            			}),
            			UtilSvc.getCommonCodeList(betParam).then(function (result) {
            				return result.data;
            			})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
                        
                    });
                };
                
                //조회
                teMobileVO.inQuiry = function(){
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
    					    NM_MRK_SELCT_INDEX : me.ordMrkNameOp.allSelectNames,
    					    NM_ORDSTAT_SELCT_INDEX : me.ordStatusOp.allSelectNames,
    					    DTS_SELECTED : me.datesetting.selected,
        					DTS_STORAGE_FROM: me.datesetting.period.start,
        					DTS_STORAGE_TO: me.datesetting.period.end,
    					    CASH_PARAM : resData.storageKey
                        };
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.tekg.dataSource.data([]); // 페이지 인덱스 초기화가 제대로 안되서 일케함	
    	            	$scope.tekg.dataSource.page(1);
    	            	//$scope.ordallkg.dataSource.read();	      
    				}	            	
	            };
	            
	            //초기화버튼
	            teMobileVO.inIt = function(){
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
                			        	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.ordallkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            	            
	        	teMobileVO.kGird = {
	        		boxTitle : "Mobile Grid",		
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
                    mobile: "phone",
                    height: "300px",
                    width: "100%",
                    resizable: true,
                    noRecords: true,
                	scrollable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {                				
                				saOrdShpAllSvc.orderList(ordAllDataVO.param).then(function (res) {
            						e.success(res.data);
            					}, function(err){
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
                			ordAllDataVO.dataTotal = data.length;
                		},
                		pageSize: 9,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: teMobileVO.grdField
                			}
                		},
                	}),                	
                	columns: grdDetOption.gridColumn     
	        	};
	        	
	            UtilSvc.gridtooltipOptions.filter = ".k-master-row td div";
	            
	            teMobileVO.initLoad();
        	}
        ]);
}());