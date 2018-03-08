(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.controller : sa.OrdCclCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.controller")
        .controller("sa.OrdCclCtrl", ["$scope", "$state", "$window", "$http", "$q", "$log", "sa.OrdCclSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc", "APP_SA_MODEL",
            function ($scope, $state, $window, $http, $q, $log, saOrdCclSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_SA_MODEL) {
	            var page = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();		            
	            	            
	            var grdField =  {
                    ROW_CHK       : { type: APP_SA_MODEL.ROW_CHK.type        , editable: true , nullable: false },
                    NO_ORD        : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL       : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK        : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD     : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    NO_MRKITEMORD : { type: APP_SA_MODEL.NO_MRKITEMORD.type  , editable: false, nullable: false },
                    
                    NO_MRK        : { type: APP_SA_MODEL.NO_MRK.type         , editable: false, nullable: false },
                    NO_MNGMRK	  : { type: APP_SA_MODEL.NO_MNGMRK.type      , editable: false, nullable: false },	
                    NO_MRKITEM    : { type: APP_SA_MODEL.NO_MRKITEM.type     , editable: false, nullable: false},
                    NO_MRKREGITEM : { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NM_MRKITEM    : { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: true , nullable: false },
                    NM_MRKOPT     : { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },
                    
                    AM_ORDSALEPRC : { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    NM_PCHR       : { type: APP_SA_MODEL.NM_PCHR.type        , editable: true , nullable: false },
                    NM_CONS       : { type: APP_SA_MODEL.NM_CONS.type        , editable: false, nullable: false },
                    NO_PCHRPHNE   : { type: APP_SA_MODEL.NO_PCHRPHNE.type    , editable: false, nullable: false },
                    QT_CCL        : { type: APP_SA_MODEL.QT_CCL.type         , editable: false, nullable: false },
                    
                    DC_PCHREMI    : { type: APP_SA_MODEL.DC_PCHREMI.type     , editable: false, nullable: false },
                    NO_CONSPOST   : { type: APP_SA_MODEL.NO_CONSPOST.type    , editable: false, nullable: false },
                    DC_CONSNEWADDR: { type: APP_SA_MODEL.DC_CONSNEWADDR.type , editable: false, nullable: false },
                    DC_PCHRREQCTT : { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false },
                    DC_CCLCTT     : { type: APP_SA_MODEL.DC_CCLCTT.type      , editable: false, nullable: false },
                    
                    CD_ORDSTAT    : { type: APP_SA_MODEL.CD_ORDSTAT.type     , editable: false, nullable: false },
                    DC_SHPWAY     : { type: APP_SA_MODEL.DC_SHPWAY.type      , editable: false, nullable: false },
                    QT_ORD        : { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    DTS_APVL      : { type: APP_SA_MODEL.DTS_APVL.type       , editable: false, nullable: false },
                    DC_APVLWAY    : { type: APP_SA_MODEL.DC_APVLWAY.type     , editable: false, nullable: false },
                    
                    DTS_ORD       : { type: APP_SA_MODEL.DTS_ORD.type        , editable: false, nullable: false },
                    YN_CONN       : { type: APP_SA_MODEL.YN_CONN.type        , editable: false, nullable: false },
                    CCL_NO_UPDATE : { type: APP_SA_MODEL.CCL_NO_UPDATE.type  , editable: false, nullable: false },
                    DTS_CCLREQ    : { type: APP_SA_MODEL.DTS_CCLREQ.type     , editable: false, nullable: false },
                    NO_CCLREQ     : { type: APP_SA_MODEL.NO_CCLREQ.type      , editable: false, nullable: false },
                    DTS_CCLAPPRRJT: { type: APP_SA_MODEL.DTS_CCLAPPRRJT.type , editable: false, nullable: false },                    
                    CD_CCLSTAT    : { type: APP_SA_MODEL.CD_CCLSTAT.type     , editable: false, nullable: false },
                    CD_CCLHRNKRSN : { type: "array"  					 	 , editable: false, nullable: false },
                    NM_CCLHRNKRSN : { type: APP_SA_MODEL.NM_CCLHRNKRSN.type  , editable: false, nullable: false },
                    NM_CCLLRKRSN  : { type: APP_SA_MODEL.NM_CCLHRNKRSN.type  , editable: false, nullable: false }, 
                    cancel_reject_code : {	
				                    	type: "array"  
				     				   ,editable: true
				     				   ,nullable: false
				     				   ,validation: {
				     					  cancel_reject_codevalidation: function (input) {
												if (input.is("[name='cancel_reject_code']") && input.val() === "") {
													input.attr("data-cancel_reject_codevalidation-msg", "취소거부 구분을 입력해 주세요.");	
													return false;
												};
												return true;
											}
										}
                    				},
                    DTS_RECER 	  : {
				                    	type: "string"  
				     				   ,editable: true
				     				   ,nullable: false
				     				   ,validation: {
											dts_recervalidation: function (input) {
												if (input.is("[data-role=datepicker]")) {
													input.attr("data-dts_recervalidation-msg", "발송일을 정확히 입력해 주세요.");
													saOrdCclSvc.manualDataBind(input, "DTS_RECER", $scope.ordCancelManagementkg);
												    return input.data("kendoDatePicker").value();
												};
												return true;
											}
										}
                    				},
    				DC_CCLRJTCTT  : {
				     					type: APP_SA_MODEL.DC_CCLRJTCTT.type  
				     				   ,editable: true
				     				   ,nullable: false
				                       ,validation: {
				                    	   dc_cclrjtcttvalidation: function (input) {
										    	if (input.is("[name='DC_CCLRJTCTT']") && !input.val()) {
				                                	input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유를 입력해 주세요.");
				                                    return false;
				                                }
										    	if(input.is("[name='DC_CCLRJTCTT']") && input.val().length > 1000){
										    		input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유룰 1000자 이내로 입력해 주세요.");
				                                    return false;
										    	}
										    	if(input.is("[name='DC_CCLRJTCTT']") && input.val() != ""){										    		
										    		saOrdCclSvc.manualDataBind(input, "DC_CCLRJTCTT", $scope.ordCancelManagementkg);
										    	};
				                            	return true;
									    	}
										}
				     	            },	
                    CD_PARS	      : {
				                    	type: "array"  
					     			   ,editable: true
					     			   ,nullable: false
					                   ,validation: {
					                	   cd_parsvalidation: function (input) {
										    	if (input.is("[name='CD_PARS']") && !input.val()) {
				                                	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
				                                    return false;
				                                }
										    	if(input.is("[name='CD_PARS']") && input.val()){										    		
										    		saOrdCclSvc.manualDataBind(input, "CD_PARS", $scope.ordCancelManagementkg);
										    	};
				                            	return true;
									    	}
										}
                    				},	
                    NO_INVO:        {
				                    	type: "string"
						     		   ,editable: true
						     		   ,nullable: false
						               ,validation: {
						            	   no_invovalidation: function (input) {
						            		   if (input.is("[name='NO_INVO']") && !input.val()) {
						            			   input.attr("data-no_invovalidation-msg", "송장번호를 입력해 주세요.");
						            			   return false;
				                               }
						            		   if (input.is("[name='NO_INVO']") && input.val()) {
						            			   var rslt = Util03saSvc.NoINVOValidation(input, 'NO_INVO', 'no_invovalidation');
						            			   if(rslt){
						            				   saOrdCclSvc.manualDataBind(input, "NO_INVO", $scope.ordCancelManagementkg);
						            			   }							            			   
						            			   return rslt; 
				                               }
						            		   return true;
									    	}
						               }
                    				}
                   
                };	            
	            
	            var ngIfdata = $scope.ngIfdata = function(input){
	            	return input.indexOf(ordCancelManagementDataVO.cancelRjCd) > -1;
	            };

                APP_SA_MODEL.CD_CCLHRNKRSN.fNm  = "ordCancelManagementDataVO.cancelCodeOp.dataSource";
                APP_SA_MODEL.CD_ORDSTAT.fNm = "ordCancelManagementDataVO.ordStatusOp";
                APP_SA_MODEL.CD_CCLSTAT.fNm = "ordCancelManagementDataVO.cancelStatusOp";
                
                var grdCol = [[APP_SA_MODEL.ROW_CHK],
                              [APP_SA_MODEL.NO_ORD         , [APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK     	   , APP_SA_MODEL.NO_MRKITEMORD ],
                              [APP_SA_MODEL.NO_MRKITEM     , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM     , APP_SA_MODEL.NM_MRKOPT     ],
                              [APP_SA_MODEL.QT_ORD         , APP_SA_MODEL.QT_CCL        ],
                              [APP_SA_MODEL.NM_PCHR        , APP_SA_MODEL.AM_ORDSALEPRC ],
                              [APP_SA_MODEL.NO_PCHRPHNE    , APP_SA_MODEL.DC_APVLWAY    ],
                              [APP_SA_MODEL.DC_PCHREMI     , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.NM_CCLHRNKRSN  , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.CD_ORDSTAT     , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD        , APP_SA_MODEL.DTS_CCLREQ    ],
                              [APP_SA_MODEL.DTS_CCLAPPRRJT , APP_SA_MODEL.CCL_NO_UPDATE ],                              
                              [APP_SA_MODEL.YN_CONN 	   , APP_SA_MODEL.CD_CCLSTAT]
                             ],
                    grdDetOption      = {},
                    grdRowTemplate    = "<tr data-uid=\"#= uid #\">\n",
                    grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\">\n",
                    grdCheckOption    = {clickNm:"onOrdGrdCkboxClick",
                		                 allClickNm:"onOrdGrdCkboxAllClick"};
                
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
	            
	            var ordCancelManagementDataVO = $scope.ordCancelManagementDataVO = {
            		boxTitle : "주문취소관리",
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : Util03saSvc.storedDatesettingLoad("ordCancelParam"),
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		procName : { value: "" , focus: false },
	        		orderNo: { value: "" , focus: false },
	        		buyerName : { value: "" , focus: false },	        		
	        		ordMrkNameOp : [],	        		
	        		ordMrkNameMo : "*",
	        		ordMrkNameOpSetting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		ordStatusOpSetting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",	        		
	        		cancelStatusOp : [],
	        		cancelStatusMo : "",
	        		cancelStatusOpSetting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		cancelCodeOp : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "NM_DEF",
                        enable: false
    				},   
    				cancelLowCodeOp : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "NM_DEF",
                        enable: false
    				},   
    				dateOptions : {										//DATE PICKER
	        			parseFormats: ["yyyyMMdd"], 					//이거 없으면 값이 바인딩 안됨
	                    value: new Date(),
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
	        		},
	        		menualShwWrn : "",
    				cancelRejectCodeOp : "",
	        		cancelCodeMo : "",
	        		shipCodeTotal : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : "",
	        		shipList : "",
	        		cancelRjCd: "",
	        		cancelRjCdEq : ['001','003','004','005','006'],
	        		cancelRjCdEqCtt : ['002']/*,
	        		cancelRjCdEqDate : ['001']*/
		        };
	            
	            ordCancelManagementDataVO.initLoad = function () {
	            	var me = this;
                	var ordParam = {
                			lnomngcdhd: "SYCH00048",
        					lcdcls: "SA_000007"
        				},
        				betParam = {
        					lnomngcdhd: "SYCH00072",
        					lcdcls: "SA_000028"
        				},
        				cclCodeParam = {
                			lnomngcdhd: "SYCH00056",
        					lcdcls: "SA_000015",
	    					customnoc: "00000"
                		},
                		cclrjtparam = {
        					lnomngcdhd: "SYCH00063",
        					lcdcls: "SA_000022",
        					mid: 'undefined',
        					customnoc: '00000'
            			},
            			cclstsparam = {
        					lnomngcdhd: "SYCH00057",
        					lcdcls: "SA_000016"
                		};;
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
            			//취소 거부 구분 코드 드랍 박스 실행	
            			UtilSvc.getCommonCodeList(cclrjtparam).then(function (res) {
            				return res.data;
            			}),
            			//취소 상태 코드 드랍 박스 실행	
            			UtilSvc.getCommonCodeList(cclstsparam).then(function (res) {
            				return res.data;
            			})
                    ]).then(function (result) {
                        me.ordMrkNameOp = result[0];
                        me.ordStatusOp = result[1];
                        me.betweenDateOptionOp = result[2];
                        me.betweenDateOptionMo = result[2][0].CD_DEF; 
                        me.cancelCodeOp.dataSource = result[3].filter(function(ele){
    						return (!ele.DC_RMK2);
    					});
                        me.cancelLowCodeOp.dataSource = result[3].filter(function(ele){
    						return (ele.DC_RMK2);
    					});
                        me.cancelRejectCodeOp = result[4];
                        me.cancelStatusOp = result[5];
                        
                        $timeout(function(){
            				Util03saSvc.storedQuerySearchPlay(me, "ordCancelParam");
                        },0);    
                    });
                };
	            
	            //조회
	            ordCancelManagementDataVO.inQuiry = function(){
	            	var me = this;
	            	me.cancelRjCd = "";  
	            	me.param = {	  
    				    NM_MRKITEM : me.procName.value.trim(),
					    NM_MRK : me.ordMrkNameMo, 
					    CD_ORDSTAT : me.ordStatusMo,
					    NO_MRKORD : me.orderNo.value,      
					    NM_CONS : me.buyerName.value.trim(),
					    CD_CCLSTAT : me.cancelStatusMo,
					    DTS_CHK : me.betweenDateOptionMo,  
					    DTS_FROM : new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d).dateFormat("Ymd"),           
					    DTS_TO : new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
					    NM_MRK_SELCT_INDEX : me.ordMrkNameOp.allSelectNames,
					    NM_ORDSTAT_SELCT_INDEX : me.ordStatusOp.allSelectNames,
					    CD_CCLSTAT_SELCT_INDEX : me.cancelStatusOp.allSelectNames,
					    DTS_SELECTED : me.datesetting.selected,			
					    CASH_PARAM : "ordCancelParam"
                    }; 
    				if(Util03saSvc.readValidation(me.param)){
    					$scope.ordCancelManagementkg.dataSource.data([]);
    	            	$scope.ordCancelManagementkg.dataSource.page(1);
    	            	//$scope.ordCancelManagementkg.dataSource.read();
    				};	     
	            };
	            		        
	            //초기화버튼
	            ordCancelManagementDataVO.inIt = function(){	
            		var me  = this;
                	
	            	me.procName.value = "";
                	me.orderNo.value = "";
                	me.buyerName.value = "";
                	
                	me.betweenDateOptionMo = me.betweenDateOptionOp[0].CD_DEF;
                	               			        	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0); 
                	
                	me.ordStatusOp.bReset = true;
                	me.ordMrkNameOp.bReset = true;
                	me.cancelStatusOp.bReset = true;
		        	                	                	
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.ordCancelManagementkg;
                	me.resetAtGrd.dataSource.data([]);	 
                	me.cancelRjCd = "";                	
	            };	

	            ordCancelManagementDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.ordCancelManagementkg.wrapper.height(616);
	            		$scope.ordCancelManagementkg.resize();
	            		if(ordCancelManagementDataVO.param !== "") grdOrdCancelManagementVO.dataSource.pageSize(9);
	            	}
	            	else {
	            		$scope.ordCancelManagementkg.wrapper.height(798);
	            		$scope.ordCancelManagementkg.resize();
	            		if(ordCancelManagementDataVO.param !== "") grdOrdCancelManagementVO.dataSource.pageSize(12);
	            	}
	            };
	            	            	            
	            //주문 검색 그리드
	            var grdOrdCancelManagementVO = $scope.grdOrdCancelManagementVO = {
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
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				saOrdCclSvc.ocmList(ordCancelManagementDataVO.param).then(function (res) {
                					$scope.ordCancelManagementDataVO.shipList = res.data.queryShipList;
                					e.success(res.data.querylist);
                    			}, function(err){
            						e.error([]);
            					});
                			},
                			update: function(e){
                				var grd = $scope.ordCancelManagementkg,
                				 	defer = $q.defer();
                				
        						if(confirm("취소거부 하시겠습니까?")){  
        							alert("송장번호 체크로 인하여 처리시간이 다소 소요 될수 있습니다.");
        							var param = e.data.models[0],
                						viewName = "",
                						rejectCode = param.cancel_reject_code.CD_DEF,
                						choView = ["003","004","005","006"];
                					
        							if(choView.indexOf(rejectCode) > -1){
        								viewName = "ocmRejectNormal";
        							}else if("001".indexOf(rejectCode) > -1){
        								viewName = "ocmRejectDate";
        							}else if("002".indexOf(rejectCode) > -1){
        								viewName = "ocmRejectCtt";
        							}else{
        								alert("데이터가 정확하지 않습니다.");
        								grd.cancelRow();
                	            		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                	            		return false;
        							};   
                					 
                                    if(param.CD_PARS){
                                    	saOrdCclSvc[viewName](param).then(function (res) {
                                    		if(res.data === "success"){
                    							alert("취소거부 처리 되었습니다.");
                                    			defer.resolve({result: "success"});
                                    			Util03saSvc.storedQuerySearchPlay(ordCancelManagementDataVO, "ordCancelParam");
                                    		}else if(res.data === "parsreject"){
                                    			ordCancelManagementDataVO.menualShwWrn = [res.data];
                                    			e.error([]);
                                    			defer.resolve({result: "success"});
                                    		}else{
                    							alert("취소거부 실패 하였습니다.");
                                    			e.error([]);
    	        	            				defer.resolve();
                                    		}
    		                			}, function(err){    		                				
    		                				saOrdCclSvc.afterErrProc(err);
    		            					e.error([]);
    		            					defer.reject(err.data);
    	            					});                                          	
                                    }else{
	                                	saOrdCclSvc[viewName](param).then(function (res) {			                				
			                				e.success();
			                				defer.resolve({result: "success"});
			                				ordCancelManagementDataVO.inQuiry();
			                			}, function(err){
			                				saOrdCclSvc.afterErrProc(err);
			            					e.error([]);
			            					defer.reject(err.data);
		            					}); 
                                    }
            	            	}else{
            	            		grd.cancelRow();
            	            		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
            	            		return false;
            	            	};
	                			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		change: function(e){
                			var data = this.data();
                			ordCancelManagementDataVO.dataTotal = data.length;
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
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ocm-toolbar-template").html()))}],
                	columns: grdDetOption.gridColumn,
                    collapse: function(e) {
                        this.cancelRow();
                    },    
                	editable: {
                		mode: "popup",
                		window : {
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#ocm_popup_template").html())),
                		confirmation: false            
                	},
                	edit: function(e){
                		var dataVo = $scope.ordCancelManagementDataVO,
                			noMngmrk = e.model.NO_MNGMRK,
                			noMrk = e.model.NO_MRK,
                			cdPars = e.model.CD_PARS,
                			noInvo = e.model.NO_INVO,
                			ddlRejectCodeSel = e.container.find("select[name=cancel_reject_code]"),
                			ddlCancelReason = e.container.find("select[name=NM_CCLHRNKRSN]").data("kendoDropDownList"),
                			ddlCancelLowReason = e.container.find("select[name=NM_CCLLRKRSN]").data("kendoDropDownList"),
                			inputDataSource = "",
                			rejectCodeDS = "";
                		                		
                		//창을 한 번 껐다가 키면 잔상이 남아 있으서 초기화 시켜줌
                		//비동기로 안하면 멍청이가 됨
                		if(ddlRejectCodeSel.length > 0 && dataVo.cancelRjCd !== ""){
                			$timeout(function(){
                				dataVo.cancelRjCd = "";
                			},0);
                		};
                		
                		ddlCancelReason.dataSource.data(dataVo.cancelCodeOp.dataSource.filter(function(ele){
                			return ele.DC_RMK1 === noMngmrk;
                		}));
                		
        				if(ddlCancelLowReason){
        					var dclr = ddlCancelLowReason.dataSource;
        					dclr.data(dataVo.cancelLowCodeOp.dataSource.filter(function(ele){
                    			return ele.DC_RMK1 === noMngmrk;
                    		}));
        				};
        				
                		inputDataSource = dataVo.shipList.filter(function(ele){
                			return ele.DC_RMK1 === noMrk;
                		});
                		
                		rejectCodeDS = dataVo.cancelRejectCodeOp.filter(function(ele){
                			return ele.DC_RMK1 === noMngmrk;
                		});
                		                		
                		ddlRejectCodeSel.kendoDropDownList({
                			dataSource : rejectCodeDS,
                    		dataTextField : "NM_DEF",
                    		dataValueField : "CD_DEF",
                    		optionLabel : "취소거부구분를 선택해 주세요 ",
                    		change: function(e){
                    			var code = this.dataItem().CD_DEF;
                    			$timeout(function(){
                    				dataVo.cancelRjCd = code;
                    				if(dataVo.cancelRjCdEq.indexOf(dataVo.cancelRjCd) >= 0){
                        				$timeout(function(){
                        					var cdParsDdl = e.sender.element.parents("table").find("select[name=CD_PARS]"),
                        						noInvoTxt = e.sender.element.parents("table").find("input[name=NO_INVO]");
                        					
                        					if(!inputDataSource.length){
                        						inputDataSource = [{NM_PARS_TEXT : "택배사 등록", CD_PARS : ""}];
                                        	}                        					
                        					
                    						cdParsDdl.kendoDropDownList({
                                    			dataSource : inputDataSource,
                                        		dataTextField : "NM_PARS_TEXT",
                                        		dataValueField : "CD_DEF",
                                        		optionLabel : "택배사를 선택해 주세요 ",
                                        		change: function(e){
                                        			if(e.sender.selectedIndex > 0 ){
                                        				e.sender.element.closest("tr").find("div.k-invalid-msg").hide();
                                        			}
                                        			if(this.text() === "택배사 등록" && this.selectedIndex === 1){
                                        				$state.go("app.syPars", { menu: true, ids: null });
    		                                    		$scope.ordCancelManagementkg.cancelRow();
    		                                    	}
                                        		}
                    						});    
                    						
                    						var dropdownlist = cdParsDdl.data("kendoDropDownList");

                    						dropdownlist.select(function(dataItem) {
                    						    return dataItem.CD_PARS === cdPars;
                    						});
                    						
                    						if(noInvo){
		                						$scope.$apply(function(){                    							
		                    						noInvoTxt.val(noInvo);                    							
		                						});
                    						}
                        				},0);
                        			};
                    			},0);
            	            }
                		});
                	},
                	cancel: function(e) {
                		$scope.ordCancelManagementDataVO.cancelRjCd = "";
                		angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	height: 616
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdOrdCancelManagementVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            	   
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
                	UtilSvc.grdCkboxClick(e, $scope.ordCancelManagementkg);
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
                	UtilSvc.grdCkboxAllClick(e, $scope.ordCancelManagementkg);
                };		     
                
                $scope.popupUtil = function(e){
                	Util03saSvc.popupUtil.mblur(e);
                };
                
                $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.ordCancelManagementkg;
                	
	                if (widget === grd){ 
	                	//취소거부 팝업 가져오기
	                	widget.element.find(".k-grid-edit").on("click", function(e){
	                		e.preventDefault();
	                		
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
		            			chkedLeng = chked.length,
		            			param = '';
	                		
	                		param = grd.dataSource.data().filter(function(ele){
	                			return ele.ROW_CHK === true && ele.CD_CCLSTAT === "001";
	                		});		    
	                		if(chkedLeng != 1){
	                			alert("한 건의 주문을 선택해 주세요");
	                			return;
	                		};
                			if(param.length !== chkedLeng){
                				alert("취소요청 된 주문만 취소거부 처리 할 수 있습니다.");	
                				return;
                			};
		                	grd.editRow(chked.closest('tr'));
	                	});                	
	                	
	                	//취소 승인
	                	widget.element.find(".ccl-confirm").on("click", function(e){
	                		e.preventDefault();
	                		
	                		var	chkedLeng = grd.element.find(".k-grid-content input:checked").length,
	            				    param = "";	
	                		     			
                			param = grd.dataSource.data().filter(function(ele){
	                			return ele.ROW_CHK === true && ele.CD_CCLSTAT === "001"  && ['001','002','003'].indexOf(ele.CD_ORDSTAT) > -1;
	                		});
                			if(chkedLeng < 1){
	                			alert("주문을 한 건 이상 선택해 주세요");
	                			return;
	                		};
                			if(param.length !== chkedLeng){
                				alert("주문상태를 확인해주세요. 배송중 일때는 거부처리 하셔야 합니다.");	
                				return;
                			}
                			//if(confirm("총 "+param.length+"건의 주문을 취소 승인 하시겠습니까?")){
                			if(confirm("주문을 취소 승인 하시겠습니까?")){
                				var defer = $q.defer();
                				saOrdCclSvc.orderCancel(param).then(function (res) {
	                				defer.resolve(); 
	                				$scope.ordCancelManagementkg.dataSource.read();
	                			}, function(err){
            						e.error([]);
            					});
	                			return defer.promise;
	                		}
                			return false;
	                			
	                	});	                
	                }
                });                

                ordCancelManagementDataVO.initLoad();
            }]);    
}());