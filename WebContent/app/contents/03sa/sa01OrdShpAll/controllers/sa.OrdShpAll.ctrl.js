(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdShpAll.controller : sa.OrdShpAllCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdShpAll.controller")
        .controller("sa.OrdShpAllCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdShpAllSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "Util03saSvc", "APP_SA_MODEL", 
            function ($scope, $http, $q, $log, saOrdShpAllSvc, APP_CODE, $timeout, resData, Page, UtilSvc, Util03saSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var searchBox = {
            		//마켓명 드랍 박스 실행	
            		mrkName : (function(){
            			UtilSvc.csMrkList().then(function (res) {
            				if(res.data.length >= 1){
            					ordAllDataVO.ordMrkNameOp = res.data;
            				}
            			});
    	            }()),	
    	            //주문상태 드랍 박스 실행
    	            orderStatus : (function(){
        				var param = {
        					lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordAllDataVO.ordStatusOp = res.data;
            				}
            			});
    	            }()),
    	            //기간 상태 드랍 박스 실행
    	            betweenDate : (function(){
        				var param = {
        					lnomngcdhd: "SYCH00055",
        					lcdcls: "SA_000014"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordAllDataVO.betweenDateOptionOp = res.data;
            					ordAllDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
            				}
            			});
    	            }())
	            };

	            var grdField =  {
                    NO_ORD         : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL        : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK         : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD      : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    NO_MRKITEM     : { type: APP_SA_MODEL.NO_MRKITEM.type     , defaultValue: "", nullable: false},
                    NO_MRKREGITEM  : { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NO_MRKITEMORD  : { type: APP_SA_MODEL.NO_MRKITEMORD.type  , editable: false, nullable: false },
                    NM_MRKITEM     : { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: true , nullable: false },
                    NM_MRKOPT      : { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },
                    QT_ORD         : { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    AM_ORDSALEPRC  : { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    NM_PCHR        : { type: APP_SA_MODEL.NM_PCHR.type        , editable: true , nullable: false },
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
                    DC_PCHRREQCTT  : { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false }
                };

                APP_SA_MODEL.CD_ORDSTAT.fNm  = "ordAllDataVO.ordStatusOp";
                
                var grdCol = [[{field:"hierarchy"}],
                              [APP_SA_MODEL.NO_ORD       ,[APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK       , APP_SA_MODEL.NO_MRKITEMORD ],
                              [APP_SA_MODEL.NO_MRKITEM   , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM   , APP_SA_MODEL.NM_MRKOPT     ],
                              [APP_SA_MODEL.AM_ORDSALEPRC, APP_SA_MODEL.AM_PCHSPRC    ],
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
	            
	            var ordAllDataVO = $scope.ordAllDataVO = {
            		boxTitle : "주문/배송종합",
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
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd : "",
	        		param : ""
	            };   
			            
	            //조회
	            ordAllDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {
    				    NM_MRKITEM : ordAllDataVO.procName.value,
					    NO_MRK : ordAllDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : ordAllDataVO.ordStatusMo,
					    NO_MRKORD : ordAllDataVO.orderNo.value,      
					    NM_PCHR : ordAllDataVO.buyerName.value,
					    DTS_CHK : ordAllDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(ordAllDataVO.datesetting.period.start.y, ordAllDataVO.datesetting.period.start.m-1, ordAllDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(ordAllDataVO.datesetting.period.end.y, ordAllDataVO.datesetting.period.end.m-1, ordAllDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                    };
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.ordallkg.dataSource.data([]); // 페이지 인덱스 초기화가 제대로 안되서 일케함	
    	            	$scope.ordallkg.dataSource.page(1);
    	            	//$scope.ordallkg.dataSource.read();
    				}	            	              	
	            };
		            
	            //초기화버튼
	            ordAllDataVO.inIt = function(){      	
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

	            ordAllDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.ordallkg.wrapper.height(616);
	            		$scope.ordallkg.resize();
	            		if(ordAllDataVO.param !== "") {
	            			grdOrdAllVO.dataSource.pageSize(9);
	            		}
	            	}
	            	else {
	            		$scope.ordallkg.wrapper.height(798);
	            		$scope.ordallkg.resize();
	            		if(ordAllDataVO.param !== "") {
	            			grdOrdAllVO.dataSource.pageSize(12);
	            		}
	            	}
	            };
	            	            
	            //detail Grid
	            var gridDetailOptions = $scope.gridDetailOptions = (function(e){
	            	var detailRow = e.detailRow,
	            	    noOrd = e.data.NO_ORD;            		            	

	                detailRow.find("#detailGrid").kendoGrid({
	                	dataSource: {
                            transport: {
                            	read: function(e) {
                    				var param = {
                    				    NO_ORD : noOrd
                                    };                   				
                					saOrdShpAllSvc.orderDetailList(param).then(function (res) {
	            						e.success(res.data);			                   				                    					
                					});         
                    			},
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                            }
                        },
                        messages: {                        	
                            requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",                          
                            noRecords: "검색된 데이터가 없습니다."
                        },
                        noRecords: true,
                        height: "300px",
                        scrollable: true,
                        sortable: true,
                        columns: [
                            { 	width: "30px" },      
                            {
                            	field: "NM_STAT", 	
                            	title:"상태",		 
                            	width: "110px",
                            	headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                            },
                            { 
                            	field: "DT_STAT", 	
                            	title:"상태변경일자", 
                            	width: "110px",
                            	headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                            },
                            { 
                            	field: "NO_INSERT",	
                            	title:"수정자",	 
                            	width: "110px",
                            	headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}	
                            },
                            { 
                            	field: "DC_STAT", 	
                            	title:"비고", 
                            	headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                           	}
                          ]
	                });
                });    
	            
	            //검색 그리드
	            var grdOrdAllVO = $scope.grdOrdAllVO = {	            		
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
                       // this.expandRow(this.tbody.find("tr.k-master-row").first()); //상세 테이블 볼때 첫번째 클릭되서 조회됨
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	scrollable: true,
                	resizable: true,
                	detailInit: gridDetailOptions,
                	/*detailCollapse: function(e) {
                	    console.log(e.masterRow, e.detailRow);	//줄일때
                	},
                	detailExpand: function(e) {
                		console.log(e.masterRow, e.detailRow);	// 확장할떄
                	},*/
                	detailTemplate: kendo.template($("#ordall_detail_template").html()),
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ordall_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {                				
                				saOrdShpAllSvc.orderList(ordAllDataVO.param).then(function (res) {
            						e.success(res.data);
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
                				fields: grdField
                			}
                		},
                	}),                	
                	columns: grdDetOption.gridColumn              	          	
	        	};
	            
	            UtilSvc.gridtooltipOptions.filter = ".k-master-row td div";
	            grdOrdAllVO.tooltipOptions = UtilSvc.gridtooltipOptions;
		        
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.ordallkg;
                	
	                if (widget === grd){	                	
	                	//
	                	widget.element.find(".k-grid-ordall-delay").on("click", function(e){
	                		alert("배송지연은 [공사중]입니다.");
	                	});
	                	//
	                	widget.element.find(".k-grid-ordall-cencel").on("click", function(e){
	                		alert("주문취소는 [공사중]입니다.");
	                	});
	                	//
	                	widget.element.find(".k-grid-ordall-output").on("click", function(e){
	                		alert("송장출력은 [공사중]입니다.");
	                	});	                		                	
	                	//
	                	widget.element.find(".k-grid-ordall-send").on("click", function(e){
	                		alert("배송정보 전송하기는 [공사중]입니다.");
	                	});
	                }
                });    
            }]);
}());