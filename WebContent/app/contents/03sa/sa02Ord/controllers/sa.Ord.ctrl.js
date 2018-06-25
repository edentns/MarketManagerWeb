(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdCtrl", ["$scope", "$window", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc", "APP_SA_MODEL", 
            function ($scope, $window, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_SA_MODEL) {	            
		        var today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	            
	            var grdField =  {
                    ROW_CHK       		: { type: APP_SA_MODEL.ROW_CHK.type        , editable: true , nullable: false },
                    NO_ORD        		: { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL       		: { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK        		: { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD     		: { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },                    
                    NO_MRK        		: { type: APP_SA_MODEL.NO_MRK.type         , editable: false, nullable: false },
                    NO_MRKITEM    		: { type: APP_SA_MODEL.NO_MRKITEM.type     , editable: false, nullable: false },
                    NO_MRKREGITEM 		: { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NM_MRKITEM    		: { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: false, nullable: false },
                    NM_MRKOPT     		: { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },                    
                    AM_ORDSALEPRC 		: { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    AM_PCHSPRC    		: { type: APP_SA_MODEL.AM_PCHSPRC.type     , editable: false, nullable: false },
                    NM_PCHR       		: { type: APP_SA_MODEL.NM_PCHR.type        , editable: false, nullable: false },
                    NM_CONS       		: { type: APP_SA_MODEL.NM_CONS.type        , editable: false, nullable: false },
                    NO_PCHRPHNE   		: { type: APP_SA_MODEL.NO_PCHRPHNE.type    , editable: false, nullable: false },                    
                    NO_CONSHDPH   		: { type: APP_SA_MODEL.NO_CONSHDPH.type    , editable: false, nullable: false },
                    DC_PCHREMI    		: { type: APP_SA_MODEL.DC_PCHREMI.type     , editable: false, nullable: false },
                    NO_CONSPOST   		: { type: APP_SA_MODEL.NO_CONSPOST.type    , editable: false, nullable: false },
                    DC_CONSNEWADDR		: { type: APP_SA_MODEL.DC_CONSNEWADDR.type , editable: false, nullable: false },
                    DC_PCHRREQCTT 		: { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false },                    
                    DC_CONSOLDADDR		: { type: APP_SA_MODEL.DC_CONSOLDADDR.type , editable: false, nullable: false },
                    CD_ORDSTAT    		: { type: APP_SA_MODEL.CD_ORDSTAT.type     , editable: false, nullable: false },
                    DC_SHPWAY     		: { type: APP_SA_MODEL.DC_SHPWAY.type      , editable: false, nullable: false },
                    QT_ORD        		: { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    DTS_APVL      		: { type: APP_SA_MODEL.DTS_APVL.type       , editable: false, nullable: false },                    
                    DTS_ORD       		: { type: APP_SA_MODEL.DTS_ORD.type        , editable: false, nullable: false },
                    YN_CONN       		: { type: APP_SA_MODEL.YN_CONN.type        , editable: false, nullable: false },
                    DTS_ORDDTRM   		: { type: APP_SA_MODEL.DTS_ORDDTRM.type    , editable: false, nullable: false },
                    AM_ITEMPRC    		: { type: APP_SA_MODEL.AM_ITEMPRC.type     , editable: false, nullable: false },
                    AM_CMS    	     	: { type: APP_SA_MODEL.AM_CMS.type     	 , editable: false, nullable: false },
                    AM_SHPCOST    	 	: { type: APP_SA_MODEL.AM_SHPCOST.type     , editable: false, nullable: false },
                    AM_CJM		  	 	: { type: APP_SA_MODEL.AM_CJM.type     	 , editable: false, nullable: false },	 		
                    AM_CUSTOM_SALES  	: { type: APP_SA_MODEL.AM_CUSTOM_SALES.type        , editable: false, nullable: false },
                    NO_MRKITEMORD    	: { type: APP_SA_MODEL.NO_MRKITEMORD.type          , editable: false, nullable: false },                    
                    DC_SHPCOSTSTAT		: { type: "string" , editable: false, nullable: false },
                    NO_MNGMRK	  		: { type: "string" , editable: false, nullable: false },	                                        
                    CD_CCLRSN     		: { 
		                    				  type: "string",  
		                    				  editable: true, 
		                    				  nullable: false,
						                      validation: {
						                            cd_cclrsnvalidation: function (input) {
						                            	if (input.is("[name='CD_CCLRSN']") && input.val() === "") {
						                                    input.attr("data-cd_cclrsnvalidation-msg", "취소 사유코드를 입력해 주세요.");
						                                    return false;
						                                };
						                                return true;
						                            }
						                        }
		                                   },                          
                    CD_CCLLRKRSN 		:  { 
		                    				  type: "string",  
		                    				  editable: true, 
		                    				  nullable: false,
						                      validation: {
						                    	  cd_ccllrkrsnvalidation: function (input) {
						                            	if (input.is("[name='CD_CCLLRKRSN']") && input.val() === "") {
						                                    input.attr("data-cd_ccllrkrsnvalidation-msg", "하위 취소 사유코드를 입력해 주세요.");
						                                    return false;
						                                };
						                                return true;
						                            }
						                        }
		                                   },
                    DC_CCLRSNCTT 		:  { 
		                    				  type: APP_SA_MODEL.DC_CCLRSNCTT.type, 
		                    				  editable: true, 
		                    				  nullable: false,
						                      validation: {
						                            dc_cclrsncttvalidation: function (input) {
						                            	if (input.is("[name='DC_CCLRSNCTT']") && !input.val()) {
						                            		input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 입력해 주세요.");
							                                return false;
						                                }
						                            	if(input.is("[name='DC_CCLRSNCTT']") && (input.val().length > 1000 || input.val().length < 8)){
						                            		input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 8자 이상 1000자 이내로 입력해 주세요.");
						                                    return false;
						                                }
						                                return true;
						                            }
						                        }
		                                     }
                },
                
                grdCol = [[APP_SA_MODEL.ROW_CHK],
                              [APP_SA_MODEL.NO_ORD       , [APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK       , APP_SA_MODEL.NO_MRKITEMORD  ],
                              [APP_SA_MODEL.NO_MRKITEM   , APP_SA_MODEL.NO_MRKREGITEM  ],
                              [APP_SA_MODEL.NM_MRKITEM   , APP_SA_MODEL.NM_MRKOPT      ],                               
                              [APP_SA_MODEL.AM_ORDSALEPRC, APP_SA_MODEL.AM_CMS		   ],                              
                              [APP_SA_MODEL.AM_SHPCOST	 , APP_SA_MODEL.AM_CJM		   ],                              
                              [APP_SA_MODEL.AM_ITEMPRC	 , APP_SA_MODEL.QT_ORD		   ],                              
                              [APP_SA_MODEL.NM_PCHR      , APP_SA_MODEL.NM_CONS        ],
                              [APP_SA_MODEL.NO_PCHRPHNE  , APP_SA_MODEL.NO_CONSHDPH    ],
                              [APP_SA_MODEL.DC_PCHREMI   , APP_SA_MODEL.DC_CONSNEWADDR ],
                              [APP_SA_MODEL.DC_PCHRREQCTT, APP_SA_MODEL.AM_PCHSPRC     ],
                              [APP_SA_MODEL.CD_ORDSTAT   , APP_SA_MODEL.DC_SHPWAY      ],
                              [APP_SA_MODEL.DTS_ORD      , APP_SA_MODEL.DTS_APVL       ],
                              [APP_SA_MODEL.DTS_ORDDTRM  , APP_SA_MODEL.YN_CONN        ]
                             ],
                grdDetOption      = {},
                grdRowTemplate    = "<tr data-uid=\"#= uid #\" ng-dblclick=\"grdDblClickGo('#: NO_ORD #','#: NO_MRKORD #',$event)\">\n",
                grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\" ng-dblclick=\"grdDblClickGo('#: NO_ORD #','#: NO_MRKORD #',$event)\">\n",
                grdCheckOption    = {clickNm:"onOrdGrdCkboxClick", allClickNm:"onOrdGrdCkboxAllClick"};

                APP_SA_MODEL.CD_ORDSTAT.fNm = "ordDataVO.ordStatusOp";
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
                
	            var ordDataVO = $scope.ordDataVO = {
	            	boxTitle : "주문",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month', 'range'],
						selected   : resData.selected,
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		procName : { value: "" , focus: false },
	        		buyerName: { value: "" , focus: false },
	        		orderNo : { value: "" , focus: false },
	        		admin : { value: "" , focus: false },
	        		ordMrkNameOp : [],
	        		ordMrkNameMo : "*",
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		cancelCodeOp : [],
	        		cancelCodeSel : [],
	        		cancelCodeLowOp : [],
	        		cancelCodeLowSel : [],
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",
	        		cancelCodeMo : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : "" 
		        };	           
	            
	            ordDataVO.initLoad = function () {
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007",
        					mid: menuId
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00055",
        					lcdcls: "SA_000014"
        				},
        				cclCodeParam = {
                			lnomngcdhd: "SYCH00056",
        					lcdcls: "SA_000015",
	    					customnoc: "00000"
                		},
                		externalParam = "app/contents/03sa/sa02Ord/templates/sa.OrdCclPop.tpl.html";
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
            			//취소 사유 코드 드랍 박스 실행	
            			UtilSvc.getCommonCodeList(cclCodeParam).then(function (res) {
            				return res.data;
            			}),
    	            	Util03saSvc.externalKmodalPopup(externalParam).then(function (res) {
    	            		return res.data;
    	            	})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF; 
                        me.cancelCodeOp = result[3].filter(function(ele){
    						return (!ele.DC_RMK2);
    					});
                        me.cancelCodeLowOp = result[3].filter(function(ele){
    						return (ele.DC_RMK2);
    					});
                        
                        $timeout(function(){
            				Util03saSvc.storedQuerySearchPlay(me, resData.storage);
                        },0);    
                    });
                };
	            
	            //조회
            	ordDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {
    				    NM_MRKITEM : me.procName.value,
					    NM_MRK : me.ordMrkNameMo,
					    NM_MRK_SELCT_INDEX : me.ordMrkNameOp.allSelectNames,
					    CD_ORDSTAT : me.ordStatusMo,
					    NM_ORDSTAT_SELCT_INDEX : me.ordStatusOp.allSelectNames,
					    NO_MRKORD : me.orderNo.value,      
					    NM_PCHR : me.buyerName.value,
					    NO_ORDDTRM : me.admin.value,  
					    DTS_CHK : me.betweenDateOptionMo,  
					    DTS_FROM : new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
					    DTS_SELECTED : me.datesetting.selected,	
    					DTS_STORAGE_FROM: me.datesetting.period.start,
    					DTS_STORAGE_TO: me.datesetting.period.end,		
					    CASH_PARAM : resData.storageKey
                    };
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.ordkg.dataSource.read();
    				};     					    				
	            };
	            
	            //초기화버튼
	            ordDataVO.inIt = function(){
            		var me  = this;
                	
	            	me.procName.value = "";
                	me.buyerName.value = "";
                	me.orderNo.value = "";
                	me.admin.value = "";
                	me.betweenDateOptionMo = me.betweenDateOptionOp[0].CD_DEF;
                	               			        	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			
                	me.ordStatusOp.bReset = true;
                	me.ordMrkNameOp.bReset = true;
                	                	
                	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.ordkg;
                	me.resetAtGrd.dataSource.data([]);	            		            	
	            };
	            
	            ordDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.ordkg.wrapper.height(616);
	            		$scope.ordkg.resize();
	            		grdOrdVO.dataSource.pageSize(9);
	            	}else {
	            		$scope.ordkg.wrapper.height(798);
	            		$scope.ordkg.resize();
	            		grdOrdVO.dataSource.pageSize(12);
	            	};
	            };
                
		        //주문 검색 그리드
	            var grdOrdVO = $scope.gridOrdVO = {
            		autoBind: false,
                    messages: {                        	
                        requestFailed: "주문정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: { update: "저장", canceledit: "닫기" }
                        ,noRecords: "검색된 데이터가 없습니다."
                    },
                	boxTitle : "주문 목록",
                	/*sortable: true,   윗 컬럼으로 소트가 되지 않아서 빼버림    
            	    columnMenu: {
            		    sortable: false
            		},*/                	
                    pageable: {
                    	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var pager = {
		                					PAGE: parseInt(e.data.page),
		                					PAGE_SIZE: parseInt(e.data.pageSize)
                						},
                					searchParam = $.extend(ordDataVO.param, pager);
        					     
                				saOrdSvc.orderList(searchParam).then(function (res) {
                					e.success(res.data);
                    			}, function(err){
            						e.error([]);
            					});
                			},
                			update: function(e){
                				if(confirm("주문 취소 하시겠습니까?")){
                					var defer = $q.defer(),
	                			 	param = e.data.models[0];
                				
                					if(param.CD_ORDSTAT === '006'){
                						alert('이미 취소된 주문입니다.');
                						return;
                					}
	                				saOrdSvc.orderCancel(param).then(function (res) {
		                				defer.resolve(); 
		                				e.success(res.data.results);
		                				$scope.ordkg.dataSource.read();
		                			}, function(err){
                						e.error([]);
                					});
		                			return defer.promise;
            	            	}else{
            	            		$scope.ordkg.cancelRow();
            	            		angular.element($("#grid_chk_master")).prop("checked",false);
                        			//angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
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
                			ordDataVO.dataTotal = $scope.ordkg.dataSource.total();
                			angular.element($("#grid_chk_master")).prop("checked",false);
                		},
                		serverPaging: true,
                		page: 1,   		
                		pageSize: 9,
                		batch: true,
                		schema: {
                			data: "queryList",
                            total: "total",
                			model: {
                    			id: "NO_ORD",
                				fields: grdField
                			}
                		},
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ord-toolbar-template").html()))}],
                	columns: grdDetOption.gridColumn,
                    collapse: function(e) {
                        this.cancelRow();
                    },    
                	editable: {
                		mode: "popup",
                		window : {
                	        title: "",
                        	close : function(e){
                        		angular.element($("#grid_chk_master")).prop("checked",false);                        		
                        	}
                	    },
                		template: function(data){
                			return kendo.template($.trim($("#ord-cclpop-template").html()))(data);
                		},
                		confirmation: false
                	},
                	edit: function(e){
                		var sf = e.container.find("select[name=CD_CCLRSN]"),
                		    lf = e.container.find("select[name=CD_CCLLRKRSN]"),
                		    tx = e.container.find("[name=DC_CCLRSNCTT]"),
                		    lfData = "";
                		               		
                		if(lf.length > 0){
                			lf.kendoDropDownList({
                				dataSource : [],
    		        			dataTextField : "NM_DEF",
    		                    dataValueField : "CD_DEF",
    	                		optionLabel : "하위 취소사유코드를 선택해 주세요 ",	                    
    		                    valuePrimitive : true
    	            		}); 
                			
                			lfData = lf.data("kendoDropDownList");
                		}
                		
                		sf.kendoDropDownList({
            				dataSource : ordDataVO.cancelCodeSel,
		        			dataTextField : "NM_DEF",
		                    dataValueField : "CD_DEF",
	                		optionLabel : "취소사유코드를 선택해 주세요 ",	                    
		                    valuePrimitive : true,
		                    change : function(e){
		                    	var cdDef = this.dataItem().CD_DEF,
		                    		dcRmk1 = this.dataItem().DC_RMK1;
		                    	
		                    	if(lfData){
		                    		lfData.dataSource.data(ordDataVO.cancelCodeLowSel.filter(function(ele){
		                    			return (ele.DC_RMK2 === cdDef) && (ele.DC_RMK1 === dcRmk1);
		                    		}));
		                    	}
		                    }
	            		});  
                		
                		if(tx.length){
                			tx.val("");
                		}
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	//detailTemplate : kendo.template($.trim($("#ord_detail_template").html())),
                	height: 616
                	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
                	//rowTemplate을 사용한 colunm은 lock을 사용할 수 없음	                    	
	        	};
	            	            
	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdOrdVO.tooltipOptions = UtilSvc.gridtooltipOptions;
		        
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.ordkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.ordkg);
                };	
	                            
                $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.ordkg;
                	
	                if (widget === grd){
	                	//Switches the table row which is in edit mode and saves any changes made by the user.
	                	//즉  주문확정은 그리드에 표시되는 내용이 수정되는게 아니라서, 그리드의 update, save를 타지 않음 그래서 따로 이벤트를 만듦 
	                	//또한 editable이 false인 경우 그리드의 update, save를 타지 않음
	                	widget.element.find(".k-grid-ord").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	            				chkedLeng = grd.element.find(".k-grid-content input:checked").length,
	            				element = $(event.currentTarget),
	            				row = element.parents("div").find(".k-grid-content input:checked"),
	            				grid = $scope.ordkg,
	            				dataItem = grid.dataItems(row);

		                	//주문취소 팝업 가져오기		                	
		                	if($(this).hasClass("cancel")){
		                		if(chkedLeng === 1){
			                    	var noMngmrk = grid.dataItem(chked.closest('tr'));
			                    	
			                		ordDataVO.cancelCodeSel = ordDataVO.cancelCodeOp.filter(function(ele){
				            			return (ele.DC_RMK1 === noMngmrk.NO_MNGMRK);
				            		});
			                		
			                		ordDataVO.cancelCodeLowSel = ordDataVO.cancelCodeLowOp.filter(function(ele){
				            			return (ele.DC_RMK1 === noMngmrk.NO_MNGMRK);
				            		});   			
			                				                		
			                		grd.editRow(chked.closest('tr'));		        
			                	}else if(chkedLeng > 1){
			                		alert("취소할 주문을 1개만 선택해 주세요!");
		                    		return false;
			                	}else if(chkedLeng < 1){
			                		alert("취소할 주문을 선택해 주세요!");
		                    		return false;
			                	}
		                    }
		                    else if($(this).hasClass("save")){		                    	
	            				var param = {
		                			data: []
		                		};           			
	                		
		                		if(chkedLeng < 1){
		                			alert("확정할 주문을 선택해 주세요!");
			                	}else{
			                		angular.forEach(grd.dataSource.data(), function(val, idx){             			
			                			if(val.ROW_CHK === true && val.CD_ORDSTAT === "001"){
			                				param.data.push(val);
			                			}
			                		});
			                		
			                		if(confirm("총 "+chkedLeng+"건의 주문을 확정 하시겠습니까?")){
			                			if(param.data.length !== chkedLeng){
			                				alert("신규주문만 주문 확정 처리 할 수 있습니다.");	
			                			}else{
			                				saOrdSvc.orderConfirm(param).then(function (res) {
			                					$timeout(function(){
			                						$scope.ordkg.dataSource.read();	  
			            						}, 0);
			                    			}, function(err){
		                						$log.error(err);
		                					});
			                			}
			                		}
			                	};
		                    };
	                	});
	                };
                });                         
                
                $scope.grdDblClickGo = function(noOrd, noMrkord, ev){
                	var getCurrentCell = "";
		       		
		       		getCurrentCell = $(ev.target).is("td") ? $(ev.target) : $(ev.target).parents("td");
		       		
		       		//체크박스 체크다가 넘어 가면 짜증나니까 체크박스에선 막음
		       		if(getCurrentCell.find(".k-checkbox").length){
		       			return false;
		       		}
                	$state.go("app.saOrd", { kind: "", menu: null, rootMenu : "saOrd",  noOrd : noOrd, noMrkord: noMrkord});
                };
                
                ordDataVO.initLoad();
            }]);
}());