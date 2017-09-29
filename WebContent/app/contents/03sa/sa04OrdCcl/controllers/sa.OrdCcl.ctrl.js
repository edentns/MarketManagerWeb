(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdCcl.controller : sa.OrdCclCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdCcl.controller")
        .controller("sa.OrdCclCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdCclSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc", "APP_SA_MODEL",
            function ($scope, $http, $q, $log, saOrdCclSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc, APP_SA_MODEL) {
	            var page = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();		            
	            
	             	//마켓명 드랍 박스 실행	
	            var	mrkName = (function(){
            			UtilSvc.csMrkList().then(function (res) {
            				if(res.data.length >= 1){
            					ordCancelManagementDataVO.ordMrkNameOp = res.data;
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
            					ordCancelManagementDataVO.ordStatusOp = res.data;
            				}
            			});		
    	            }()),    	            
    	            //기간 상태 드랍 박스 실행	
    	            betweenDate = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00072",
        					lcdcls: "SA_000028"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordCancelManagementDataVO.betweenDateOptionOp = res.data;
            					ordCancelManagementDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
            				}
            			});		
    	            }()),	            
            		//취소 사유 코드 드랍 박스 실행	
    	            cancelReasonCode = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00056",
        					lcdcls: "SA_000015"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordCancelManagementDataVO.cancelCodeOp.dataSource = res.data;
            				}
            			});
    	            }()),
    	            //취소 거부 구분 코드 드랍 박스 실행	
    	            cancelReasonCode = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00065",
        					lcdcls: "SA_000024",
        					mid: 'undefined',
        					customnoc: '00000'
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordCancelManagementDataVO.cancelRejectCodeOp = res.data;
            				}
            			});
    	            }()),
    	            //취소 상태 코드 드랍 박스 실행	
    	            cancelReasonCode = (function(){
        				var param = {
        					lnomngcdhd: "SYCH00057",
        					lcdcls: "SA_000016"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					ordCancelManagementDataVO.cancelStatusOp = res.data;
            				}
            			});
    	            }());
	            
	            var grdField =  {
                    ROW_CHK       : { type: APP_SA_MODEL.ROW_CHK.type        , editable: true , nullable: false },
                    NO_ORD        : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL       : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK        : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD     : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    
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
                    NO_UPDATE     : { type: APP_SA_MODEL.NO_UPDATE.type      , editable: false, nullable: false },
                    DTS_CCLREQ    : { type: APP_SA_MODEL.DTS_CCLREQ.type     , editable: false, nullable: false },
                    NO_CCLREQ     : { type: APP_SA_MODEL.NO_CCLREQ.type      , editable: false, nullable: false },
                    DTS_CCLAPPRRJT: { type: APP_SA_MODEL.DTS_CCLAPPRRJT.type , editable: false, nullable: false },                    
                    CD_CCLSTAT    : { type: APP_SA_MODEL.CD_CCLSTAT.type     , editable: false, nullable: false },
                    CD_CCLHRNKRSN : { type: APP_SA_MODEL.CD_CCLHRNKRSN.type  , editable: false, nullable: false },
                    NM_CCLHRNKRSN : { type: APP_SA_MODEL.NM_CCLHRNKRSN.type  , editable: false, nullable: false },
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
                    DTS_RECER : 	{
				                    	type: APP_SA_MODEL.DTS_RECER.type  
				     				   ,editable: true
				     				   ,nullable: false
				     				   ,validation: {
											dts_recervalidation: function (input) {
												if (input.is("[data-role=datepicker]")) {
													input.attr("data-dts_recervalidation-msg", "교환상품접수일자를 정확히 입력해 주세요.");
													manualDataBind(input, "DTS_RECER");
												    return input.data("kendoDatePicker").value();
												};
												return true;
											}
										}
                    				},
    				DC_CCLRJTCTT  :{
				     					type: APP_SA_MODEL.DC_CCLRJTCTT.type  
				     				   ,editable: true
				     				   ,nullable: false
				                       ,validation: {
				                    	   dc_cclrjtcttvalidation: function (input) {
										    	if (input.is("[name='DC_CCLRJTCTT']") && input.val() === "") {
				                                	input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유를 입력해 주세요.");
				                                    return false;
				                                }
										    	if(input.is("[name='DC_CCLRJTCTT']") && input.val().length > 1000){
										    		input.attr("data-dc_cclrjtcttvalidation-msg", "취소거부사유룰 1000자 이내로 입력해 주세요.");
				                                    return false;
										    	}
										    	if(input.is("[name='DC_CCLRJTCTT']") && input.val() != ""){										    		
										    		manualDataBind(input, "DC_CCLRJTCTT");
										    	};
				                            	return true;
									    	}
										}
				     	            },	
                    CD_PARS:        {
				                    	type: "array"  
					     			   ,editable: true
					     			   ,nullable: false
					                   ,validation: {
					                	   cd_parsvalidation: function (input) {
										    	if (input.is("[name='CD_PARS']") && input.val() === "") {
				                                	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
				                                    return false;
				                                }
										    	if(input.is("[name='CD_PARS']") && input.val() != ""){										    		
										    		manualDataBind(input, "CD_PARS");
										    	};
				                            	return true;
									    	}
										}
                    				},	
                    NO_INVO:        {
				                    	type: APP_SA_MODEL.NO_INVO.type  
						     		   ,editable: true
						     		   ,nullable: false
						               ,validation: {
						            	   no_invovalidation: function (input) {
										    	if (input.is("[name='NO_INVO']") && input.val() === "") {
				                                	input.attr("data-no_invovalidation-msg", "송장번호를 입력해 주세요.");
				                                    return false;
				                                };
										    	if(input.is("[name='NO_INVO']") && input.val().length > 100){
										    		input.attr("data-no_invovalidation-msg", "송장번호룰 100자 이내로 입력해 주세요.");
				                                    return false;
										    	};
										    	if(input.is("[name='NO_INVO']") && input.val().length <= 100 && input.val() != ""){										    		
										    		manualDataBind(input, "NO_INVO");
										    	};
										    	return true;
									    	}
						               }
                    				}
                   
                };
	            
	            var manualDataBind = function(input, target){
	            	var getUid = input.parents("table").attr("data-uid"),
	            	    grid = $scope.ordCancelManagementkg,
	            	    viewToRow = $("[data-uid='" + getUid + "']", grid.table),
	            	    dataItem = grid.dataItem(viewToRow);								                	    
	            	
	            	if(target === "CD_PARS"){
	            		var i, chosenPureData = input.data().handler.dataSource.data();
	            		for(i=0; i<chosenPureData.length; i++){
	            			if(chosenPureData[i]["CD_DEF"] === input.val()){
	            				dataItem[target] = chosenPureData[i];
	            			}
	            		};
	            	}else if(target === "DTS_RECER"){
	            		dataItem[target] = kendo.toString(new Date(input.val()), "yyyyMMdd");
	            	}else{
	            		dataItem[target] = input.val();
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
                              [APP_SA_MODEL.NM_MRK     	   , APP_SA_MODEL.NO_MRKORD     ],
                              [APP_SA_MODEL.NO_MRKITEM     , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM     , APP_SA_MODEL.NM_MRKOPT     ],
                              [APP_SA_MODEL.QT_ORD         , APP_SA_MODEL.QT_CCL        ],
                              [APP_SA_MODEL.NM_PCHR        , APP_SA_MODEL.AM_ORDSALEPRC ],
                              [APP_SA_MODEL.NO_PCHRPHNE    , APP_SA_MODEL.DC_APVLWAY    ],
                              [APP_SA_MODEL.DC_PCHREMI     , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.NM_CCLHRNKRSN  , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.CD_ORDSTAT     , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD        , APP_SA_MODEL.DTS_CCLREQ    ],
                              [APP_SA_MODEL.DTS_CCLAPPRRJT , APP_SA_MODEL.NO_UPDATE     ],                              
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
	        		orderNo: { value: "" , focus: false },
	        		buyerName : { value: "" , focus: false },
	        		
	        		ordMrkNameOp : [],
	        		ordMrkNameMo : "*",
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",
	        		cancelStatusOp : [],
	        		cancelStatusMo : "",
	        		cancelCodeOp : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                        optionLabel : "주문취소코드를 선택해 주세요 ",
                        enable: false,
                    	valuePrimitive: true,
    				},   
    				dateOptions : {										//DATE PICKER
	        			parseFormats: ["yyyyMMdd"], 					//이거 없으면 값이 바인딩 안됨
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
    				cancelRejectCodeOp : "",
	        		cancelCodeMo : "",
	        		shipCodeTotal : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : "",
	        		shipList : "",
	        		cancelRjCd: "",
	        		cancelRjCdEq : ['001','003','004','005','006'],
	        		cancelRjCdEqCtt : ['002'],
	        		cancelRjCdEqDate : ['001']
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
					    CD_CCLSTAT : ordCancelManagementDataVO.cancelStatusMo,
					    DTS_CHK : me.betweenDateOptionMo,  
					    DTS_FROM : new Date(me.datesetting.period.start.y, me.datesetting.period.start.m-1, me.datesetting.period.start.d).dateFormat("Ymd"),           
					    DTS_TO : new Date(me.datesetting.period.end.y, me.datesetting.period.end.m-1, me.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
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
                    			});
                			},
                			update: function(e){
        						if(confirm("취소거부 하시겠습니까?")){        					
                					var defer = $q.defer(),
                						param = e.data.models,
                						viewName = "";
                					/*param = e.data.models.filter(function(ele){
	                			 		return ele.ROW_CHK === true;
	                			 	});                				
                					if(param.length > 1){
                						alert("한 건의 주문만 선택할 수 있습니다.");
                						return false;
                					};                					
                        			if(param[0].CD_CCLSTAT !== "001"){
                        				alert("취소요청 된 주문만 취소거부 처리 할 수 있습니다.");
                        				return false;
                        			}; */          	
                					switch(param[0].cancel_reject_code.CD_DEF){
                						case "001" : {
                							viewName = "ocmRejectDate";
                							break;
                						};
                						case "002" : {  
                							viewName = "ocmRejectCtt";
                							break;
                						};
                						case "003" :
                						case "004" :
                						case "005" :
                						case "006" : {
                							viewName = "ocmRejectNormal";
                							break;
                						};
                						default : {
                							alert("데이터가 정확하지 않습니다.");
                							break;
                						}
                					}
                					saOrdCclSvc[viewName](param[0]).then(function (res) {
		                				defer.resolve(); 
		                				e.success(res.data.results);
		                				ordCancelManagementDataVO.inQuiry();
		                				//$scope.ordCancelManagementkg.dataSource.read();
		                			});
		                			return defer.promise;
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
                			ddlRejectCodeSel = e.container.find("select[name=cancel_reject_code]"),
                			inputDataSource = "",
                			rejectCodeDS = "";
                		                		
                		inputDataSource = dataVo.shipList.filter(function(ele){
                			return ele.DC_RMK1 === e.model.NO_MRK;
                		});
                		
                		rejectCodeDS = dataVo.cancelRejectCodeOp.filter(function(ele){
                			return ele.DC_RMK1 === e.model.NO_MNGMRK;
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
                        					e.sender.element.parents("table").find("select[name=CD_PARS]").kendoDropDownList({
                                    			dataSource : inputDataSource,
                                        		dataTextField : "NM_DEF",
                                        		dataValueField : "CD_DEF",
                                        		optionLabel : "택배사를 선택해 주세요 "        		
                                    		});
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
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.ordCancelManagementkg,
	                	dataItem = grid.dataItem(row),
	                	allChecked = true;
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                for(i; i<element.parents('tbody').find("tr").length; i+=1){
	                	if(!element.parents('tbody').find("tr:eq("+i+")").find(".k-checkbox").is(":checked")){
	                		allChecked = false;
	                	}
	                };
	                
	                angular.element($(".k-checkbox:eq(0)")).prop("checked",allChecked);
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
                };
                
                //kendo grid 체크박스 all click
                $scope.onOrdGrdCkboxAllClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.parents("div").find(".k-grid-content table tr"),
	                	grid = $scope.ordCancelManagementkg,
	                	dataItem = grid.dataItems(row),
	                	dbLength = dataItem.length;
	                
	                if(dbLength < 1){	                	
	                	alert("전체 선택 할 데이터가 없습니다.");
	                	angular.element($(".k-checkbox:eq(0)")).prop("checked",false);
	                	return;
	                };   	                
	                for(i; i<dbLength; i += 1){
	                	dataItem[i].ROW_CHK = checked;
	                	dataItem[i].dirty = checked;
	                };	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                }else{
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
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
                				alert("주문상태를 확인해주세요.");	
                				return;
                			}
                			//if(confirm("총 "+param.length+"건의 주문을 취소 승인 하시겠습니까?")){
                			if(confirm("주문을 취소 승인 하시겠습니까?")){
                				var defer = $q.defer();
                				saOrdCclSvc.orderCancel(param).then(function (res) {
	                				defer.resolve(); 
	                				$scope.ordCancelManagementkg.dataSource.read();
	                			});
	                			return defer.promise;
	                		}
                			return false;
	                			
	                	});	                
	                }
                });
                
            }]);    
}());