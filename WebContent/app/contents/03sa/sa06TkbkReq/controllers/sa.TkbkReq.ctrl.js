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
	            
	            var searchBox = {
            		//마켓명 드랍 박스 실행	
            		mrkName : (function(){
            			UtilSvc.csMrkList().then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.ordMrkNameOp = res.data;
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
            					tkbkDataVO.ordStatusOp = res.data;
            				}
            			});
    	            }()),
    	            //기간 상태 드랍 박스 실행
    	            betweenDate : (function(){
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
    	            cdTkbkrsn : (function(){
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
    	            cdTkbkrjt : (function(){
        				var param = {
        					lnomngcdhd: "SYCH00065",
        					lcdcls: "SA_000024"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.cdTkbkrjtOp.dataSource = res.data;
            				}
            			});
    	            }()),
    	            //반품 상태 코드
    	            cdTkbkstat : (function(){
        				var param = {
        					lnomngcdhd: "SYCH00066",
        					lcdcls: "SA_000025"
        				};
            			UtilSvc.getCommonCodeList(param).then(function (res) {
            				if(res.data.length >= 1){
            					tkbkDataVO.cdTkbkstat = res.data;
            				}
            			});
    	            }())
	            };   

	            var grdField =  {
                    ROW_CHK       : { type: APP_SA_MODEL.ROW_CHK.type        , editable: true , nullable: false },
                    NO_ORD        : { type: APP_SA_MODEL.NO_ORD.type         , editable: false, nullable: false },
                    NO_APVL       : { type: APP_SA_MODEL.NO_APVL.type        , editable: false, nullable: false },
                    NM_MRK        : { type: APP_SA_MODEL.NM_MRK.type         , editable: false, nullable: false },
                    NO_MRKORD     : { type: APP_SA_MODEL.NO_MRKORD.type      , editable: false, nullable: false },
                    
                    NO_MRKITEM    : { type: APP_SA_MODEL.NO_MRKITEM.type     , defaultValue: "", nullable: false},
                    NO_MRKREGITEM : { type: APP_SA_MODEL.NO_MRKREGITEM.type  , editable: false, nullable: false },
                    NM_MRKITEM    : { type: APP_SA_MODEL.NM_MRKITEM.type     , editable: true , nullable: false },
                    NM_MRKOPT     : { type: APP_SA_MODEL.NM_MRKOPT.type      , editable: false, nullable: false },
                    
                    AM_ORDSALEPRC : { type: APP_SA_MODEL.AM_ORDSALEPRC.type  , editable: false, nullable: false },
                    NM_PCHR       : { type: APP_SA_MODEL.NM_PCHR.type        , editable: true , nullable: false },
                    NM_CONS       : { type: APP_SA_MODEL.NM_CONS.type        , editable: false, nullable: false },
                    NO_PCHRPHNE   : { type: APP_SA_MODEL.NO_PCHRPHNE.type    , editable: false, nullable: false },
                    
                    DC_PCHREMI    : { type: APP_SA_MODEL.DC_PCHREMI.type     , editable: false, nullable: false },
                    DC_CONSNEWADDR: { type: APP_SA_MODEL.DC_CONSNEWADDR.type , editable: false, nullable: false },
                    DC_PCHRREQCTT : { type: APP_SA_MODEL.DC_PCHRREQCTT.type  , editable: false, nullable: false },
                    
                    CD_ORDSTAT    : { type: APP_SA_MODEL.CD_ORDSTAT.type     , editable: false, nullable: false },
                    DC_SHPWAY     : { type: APP_SA_MODEL.DC_SHPWAY.type      , editable: false, nullable: false },
                    DTS_ORD       : { type: APP_SA_MODEL.DTS_ORD.type        , editable: false, nullable: false },
                    QT_ORD        : { type: APP_SA_MODEL.QT_ORD.type         , editable: false, nullable: false },
                    
                    DTS_TKBKREQ   : { type: APP_SA_MODEL.DTS_TKBKREQ.type    , editable: false, nullable: false },
                    NO_UPDATE     : { type: APP_SA_MODEL.NO_UPDATE.type      , editable: false, nullable: false },
                    YN_CONN       : { type: APP_SA_MODEL.YN_CONN.type        , editable: false, nullable: false },
                    
                    DTS_CCLREQ    : { type: APP_SA_MODEL.DTS_CCLREQ.type     , editable: false, nullable: false },
                    CD_TKBKRSN    : { type: APP_SA_MODEL.CD_TKBKRSN.type     , editable: false, nullable: false },
                    DC_APVLWAY    : { type: APP_SA_MODEL.DC_APVLWAY.type     , editable: false, nullable: false },
                    DTS_TKBKCPLT  : { type: APP_SA_MODEL.DTS_TKBKCPLT.type   , editable: true , nullable: false,
				                    	validation: {
											dts_tkbkcpltvalidation: function (input) {
												if (input.is("[data-role=datetimepicker]")) {
													input.attr("data-dts_tkbkcpltvalidation-msg", "반납상품접수일자를 정확히 입력해 주세요.");			                                                        	
												    return input.data("kendoDateTimePicker").value();
												};
												return true;
											}
										}
                    	            },
                    DTS_TKBKCPLT_VIEW : { type: APP_SA_MODEL.DTS_TKBKCPLT_VIEW.type, editable: false, nullable: false },
                    NO_TKBKCPLT   : { type: APP_SA_MODEL.NO_TKBKCPLT.type    , editable: false, nullable: false },
                    QT_TKBK       : { type: APP_SA_MODEL.QT_TKBK.type        , editable: false, nullable: false },
                    NO_INSERT     : { type: APP_SA_MODEL.NO_INSERT.type      , editable: false, nullable: false },
                    CD_TKBKSTAT   : { type: APP_SA_MODEL.CD_TKBKSTAT.type    , editable: false, nullable: false },
                    NO_TKBKREQ    : { type: APP_SA_MODEL.NO_TKBKREQ.type     , editable: false, nullable: false },
                    NO_MRK        : { type: APP_SA_MODEL.NO_MRK.type         , editable: false, nullable: false },
                    requesteNo    : { type: APP_SA_MODEL.requesteNo.type     , editable: false, nullable: false },
                    mall_no       : { type: APP_SA_MODEL.mall_no.type        , editable: false, nullable: false },
                    DC_TKBKRJTCTT : { type: APP_SA_MODEL.DC_TKBKRJTCTT.type  , editable: true , nullable: false,
				                    	validation: {
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
                    CD_TKBKRJT    : { type: APP_SA_MODEL.DC_TKBKRJTCTT.type  , editable: true , nullable: false,
				                    	validation: {
											cd_tkbkrjtvalidation: function (input) {
												if (input.is("[name='CD_TKBKRJT']") && input.val() === "") {
													input.attr("data-cd_tkbkrjtvalidation-msg", "반품거부코드를 입력해 주세요.");
												    return false;
												};
												return true;
											}
										}
                                    }
                };

                APP_SA_MODEL.CD_TKBKRSN.fNm  = "tkbkDataVO.cdTkbkrsnOp.dataSource";
                APP_SA_MODEL.CD_ORDSTAT.fNm  = "tkbkDataVO.ordStatusOp";
                APP_SA_MODEL.CD_TKBKSTAT.fNm = "tkbkDataVO.cdTkbkstat";
                
                var grdCol = [[APP_SA_MODEL.ROW_CHK],
                              [APP_SA_MODEL.NO_ORD           , APP_SA_MODEL.NO_APVL       ],
                              [APP_SA_MODEL.NM_MRK           , APP_SA_MODEL.NO_MRKORD     ],
                              [APP_SA_MODEL.NO_MRKITEM       , APP_SA_MODEL.NO_MRKREGITEM ],
                              [[APP_SA_MODEL.NM_MRKITEM, APP_SA_MODEL.NM_MRKOPT], APP_SA_MODEL.mall_no],
                              [APP_SA_MODEL.QT_ORD           , APP_SA_MODEL.QT_TKBK       ],
                              [APP_SA_MODEL.NM_PCHR          , APP_SA_MODEL.AM_ORDSALEPRC ],
                              [APP_SA_MODEL.NO_PCHRPHNE      , APP_SA_MODEL.DC_APVLWAY    ],
                              [APP_SA_MODEL.DC_PCHREMI       , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.CD_TKBKRSN       , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.CD_ORDSTAT       , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD          , APP_SA_MODEL.DTS_CCLREQ    ],
                              [APP_SA_MODEL.DTS_TKBKREQ      , APP_SA_MODEL.NO_INSERT     ],
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
	        		cdTkbkstat : [],
	        		cdTkbkrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdTkbkrjtOp:{
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
        	            },
	        		},
	        		userInfo : JSON.parse($window.localStorage.getItem("USER")).NM_EMP,
	        		updateChange : "",
	        		dataTotal : 0,
	        		resetAtGrd : "",
	        		param : ""
	            };   
		            
	            //조회
	            tkbkDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
    				    NM_MRKITEM : tkbkDataVO.procName.value,
					    NO_MRK : tkbkDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : tkbkDataVO.ordStatusMo,
					    NO_MRKORD : tkbkDataVO.orderNo.value,      
					    NM_PCHR : tkbkDataVO.buyerName.value,
					    DTS_CHK : tkbkDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(tkbkDataVO.datesetting.period.start.y, tkbkDataVO.datesetting.period.start.m-1, tkbkDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
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
                    	// ng-if가  edit보다 나오는 순서가 늦음어서 timeout 사용
                    	if(tkbkDataVO.updateChange === "002"){
		            		$timeout(function(){                			
		                    	var ddlRjt = e.container.find("select[name=CD_TKBKRJT]").data("kendoDropDownList");                    		          
		                    	
		                    	ddlRjt.select(0);
		                    	ddlRjt.trigger("change");                			
		                	},50);
                    	}
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
                				saTkbkReqSvc.orderList(tkbkDataVO.param).then(function (res) {                						
            						e.success(res.data);			                   				                    					
            					});
                			},
                			update: function(e){                				
                				switch(tkbkDataVO.updateChange){
                					case '001' : {
                						if(confirm("반품상품접수를 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	ele.DTS_TKBKCPLT = kendo.toString(ele.DTS_TKBKCPLT , "yyyyMMddHHmmss");         	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "002" && (ele.NO_ORD) && ele.NO_ORD !== "") ;
        	                			 	    });                        					
                        					if(param.length !== 1){
                        						alert("반품승인 된 주문만 접수 처리 할 수 있습니다.");
                        						return;
                        					};     
                        					saTkbkReqSvc.tkbkCompleted(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품상품접수를  완료 하였습니다.");
                        							//tkbkDataVO.ordStatusMo = (tkbkDataVO.ordStatusMo === '*') ? tkbkDataVO.ordStatusMo : tkbkDataVO.ordStatusMo + "^007";
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품상품접수를 실패하였습니다.");
                        							e.error();
                        						}
                        					});                         					
        		                			return defer.promise;
                    	            	}
                						break;
                					}
                					case '002' : {
                						if(confirm("선택하신 주문을 반품 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "" && ele.CD_ORDSTAT === '005');
                								});                             					
                        					if(param.length !== 1){
                        						alert("배송완료 된 반품요청 주문만 거부 처리 할 수 있습니다.");
                        						return;
                        					};  
                        					saTkbkReqSvc.tkbkReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품거부 하였습니다.");
                        							//tkbkDataVO.ordStatusMo = (tkbkDataVO.ordStatusMo === '*') ? tkbkDataVO.ordStatusMo : tkbkDataVO.ordStatusMo + "^005";
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					});                         					
                        					
        		                			return defer.promise;
                						}  
                						break;
                					}
                					case '003' : {
                						if(confirm("선택하신 주문을 반품 승인하시겠습니까?")){
                							var defer = $q.defer()
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "" && ele.CD_ORDSTAT === '005');
                								});                 							
                							if(e.data.models.length !== param.length){
                								alert("배송완료 된 반품요청 주문만 승인 처리 할 수 있습니다.");
                        						return;
                							};
                							saTkbkReqSvc.tkbkConfirm(param).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품승인 하였습니다.");                        							
                        							//tkbkDataVO.ordStatusMo = (tkbkDataVO.ordStatusMo === '*') ? tkbkDataVO.ordStatusMo : tkbkDataVO.ordStatusMo + "^007";
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품승인을 실패하였습니다.");
                        							e.error();
                        						}
                        					});  
                							return defer.promise;
                						};	
                						break;
                					}
                					case '004' : {
                						if(confirm("선택하신 주문을 전송하시겠습니까?")){
                							var defer = $q.defer(),
                								whereIn = ["002","003","004"],
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_TKBKSTAT) !== -1 && (ele.requesteNo !== ele.NO_TKBKREQ && ele.mall_no !== ele.NO_MRK));
                								});
                							
                							if(e.data.models.length !== param.length){
                								alert("반품상태가 올바르지 않거나, 이미 전송된 반품건이 있습니다.");
                        						return;
                							};
                							saTkbkReqSvc.tkbkInterfacesend(param).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품결과가 전송되었습니다.");                        				
                        							//tkbkDataVO.ordStatusMo = (tkbkDataVO.ordStatusMo === '*') ? tkbkDataVO.ordStatusMo : tkbkDataVO.ordStatusMo + "^007";                        							
            	            						$scope.tkbkkg.dataSource.read();
                        						}else{
                        							alert("반품결과 전송이 실패하였습니다.");
                        							e.error();
                        						}
                        					});  
                							return defer.promise;
                						};
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
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.tkbkkg,
	                	dataItem = grid.dataItem(row),
	                	allChecked = true;
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                for(i; i<element.parents('tbody').find("tr").length; i+=1){
	                	if(!element.parents('tbody').find("tr:eq("+i+")").find(".k-checkbox").is(":checked")){
	                		allChecked = false;
	                	}
	                }
	                
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
	                	grid = $scope.tkbkkg,
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
                	var grd = $scope.tkbkkg;
                	
	                if (widget === grd){
	                	//반품접수
	                	widget.element.find(".k-grid-tkbk-accept").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),
		            			chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                    	if(grdItem.CD_TKBKSTAT === "002"){
		                    		if(!(grdItem.DTS_TKBKCPLT)){
		                				//grdItem.DTS_TKBKCPLT = kendo.toString(new Date(), "yyyyMMddHHmmss");
		                    			grdItem.DTS_TKBKCPLT = kendo.toString(new Date());
		                			};		                			
		                			grd.options.editable.window.width = "550px";
		                			tkbkDataVO.updateChange = "001";
		                			grd.editRow(chked.closest("tr"));
	                			}else{
	                				alert("반품승인 된 주문만 접수 처리 할 수 있습니다.");	
	                				return;
	                			};			                    	
		                	}else{
		                		alert("한 건의 주문을 선택해 주세요");
		                	}
	                	}); 
	                	
	                	//반품거부
	                	widget.element.find(".k-grid-tkbk-reject").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),	
		            			chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                    	if(grdItem.CD_TKBKSTAT === "001"){
		                    		grd.options.editable.window.width = "900px";
		                			tkbkDataVO.updateChange = "002";
		                			grd.editRow(chked.closest("tr"));
	                			}else{
	                				alert("반품요청 된 주문만 거부 처리 할 수 있습니다.");
	                				return;
	                			}
		                	}else{
		                		alert("한 건의 주문을 선택해 주세요");
		                	}
	                	}); 
	                	
	                	//반품승인
	                	widget.element.find(".k-grid-tkbk-confirm").on("click", function(e){  
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
	                		if(chkedLeng < 1){
                				alert("주문을 선택해 주세요.");	
                				return;
                			};
	                		tkbkDataVO.updateChange = "003";
	                		grd.saveChanges();
	                	});
	                	
	                	//반품요청 결과전송
	                	widget.element.find(".k-grid-tkbk-send").on("click", function(e){
	                		var chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                		
	                		if(chkedLeng < 1){
                				alert("주문을 선택해 주세요.");	
                				return;
                			};
	                		tkbkDataVO.updateChange = "004";
	                		grd.saveChanges();
	                	});
	                	
	                	//반품요청 가져오기 
	                	widget.element.find(".k-grid-tkbk-open").on("click", function(e){
	                		alert("반품요청 가져오기는 [공사중]입니다.");
	                	});
	                }
                });
            }]);
}());