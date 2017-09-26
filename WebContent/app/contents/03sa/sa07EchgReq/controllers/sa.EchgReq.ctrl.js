(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.EchgReq.controller : sa.EchgReqCtrl
     * 상품분류관리
     */
    angular.module("sa.EchgReq.controller")
        .controller("sa.EchgReqCtrl", ["$scope", "$http", "$q", "$log", "sa.EchgReqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "$window",  "Util03saSvc", "APP_SA_MODEL",   
            function ($scope, $http, $q, $log, saEchgReqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, $window, Util03saSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
            	//마켓명 드랍 박스 실행	
        		var mrkName = (function(){
	        			UtilSvc.csMrkList().then(function (res) {
	        				if(res.data.length >= 1){
	        					echgDataVO.ordMrkNameOp = res.data;
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
	        					echgDataVO.ordStatusOp = res.data;
	        				}
	        			});
	            	}()),
	            
	            	//기간 상태 드랍 박스 실행
	            	betweenDate = (function(){
	    				var param = {
	    					lnomngcdhd: "SYCH00067",
	    					lcdcls: "SA_000026"
	    				};
	        			UtilSvc.getCommonCodeList(param).then(function (res) {
	        				if(res.data.length >= 1){
	        					echgDataVO.betweenDateOptionOp = res.data;
	        					echgDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
	        				}
	        			});
	            	}()),
	            
	            	//교환 사유 코드
	            	cdEchgrsn = (function(){
	    				var param = {
	    					lnomngcdhd: "SYCH00052",
	    					lcdcls: "SA_000011"
	    				};
	        			UtilSvc.getCommonCodeList(param).then(function (res) {
	        				if(res.data.length >= 1){
	        					echgDataVO.cdEchgrsnOp.dataSource = res.data;
	        				}
	        			});
	            	}()),
	            
	            	//교환 거부 코드
	            	cdEchgrjt = (function(){
	    				var param = {
	    					lnomngcdhd: "SYCH00065",
	    					lcdcls: "SA_000024"
	    				};
	        			UtilSvc.getCommonCodeList(param).then(function (res) {
	        				if(res.data.length >= 1){
	        					echgDataVO.cdEchgrjtOp.dataSource = res.data;
	        				}
	        			});
	            	}()),
	            
	            	//교환 상태 코드
		             cdEchgrjt = (function(){
	    				var param = {
	    					lnomngcdhd: "SYCH00054",
	    					lcdcls: "SA_000013"
	    				};
	        			UtilSvc.getCommonCodeList(param).then(function (res) {
	        				if(res.data.length >= 1){
	        					echgDataVO.echgStatusOp = res.data;
	        					echgDataVO.echgStatusMo = res.data[0].CD_DEF;
	        				}
	        			});
		            }());

	            var grdField =  {
                    ROW_CHK       	: { type: "bolean"    , editable: true , nullable: false },
                    NO_ORD        	: { type: "string"    , editable: false, nullable: false },
                    NO_APVL       	: { type: "string"    , editable: false, nullable: false },
                    NM_MRK        	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKORD     	: { type: "string"    , editable: false, nullable: false },                    
                    NO_MRKITEM    	: { type: "string"    , editable: false, nullable: false },
                    NO_MRKREGITEM 	: { type: "string"    , editable: false, nullable: false },
                    NM_MRKITEM    	: { type: "string"    , editable: true , nullable: false },
                    NM_MRKOPT     	: { type: "string"    , editable: false, nullable: false },
                    QT_ORD        	: { type: "number"    , editable: false, nullable: false },
                    QT_ECHG       	: { type: "string"    , editable: false, nullable: false },                    
                    AM_ORDSALEPRC 	: { type: "number"    , editable: false, nullable: false },
                    NM_PCHR       	: { type: "string"    , editable: true , nullable: false },
                    NM_CONS      	: { type: "string"    , editable: false, nullable: false },
                    NO_PCHRPHNE  	: { type: "string"    , editable: false, nullable: false },                    
                    DC_PCHREMI    	: { type: "string"    , editable: false, nullable: false },
                    NO_CONSPHNE   	: { type: "string"    , editable: false, nullable: false },                    
                    DC_CONSNEWADDR	: { type: "string"    , editable: false, nullable: false },                    
                    CD_ORDSTAT    	: { type: "string"    , editable: false, nullable: false },
                    DC_SHPWAY     	: { type: "string"    , editable: false, nullable: false },
                    DTS_ORD       	: { type: "string"    , editable: false, nullable: false },                    
                    DTS_ECHGREQ   	: { type: "string"    , editable: false, nullable: false },
                    DT_SND        	: { type: "string"    , editable: false, nullable: false },
                    DTS_ECHGAPPRRJT : { type: "string"    , editable: false, nullable: false },
                    NO_ECHGCPLT   	: { type: "string"	  , editable: false, nullable: false },                    
                    YN_CONN       	: { type: "string"    , editable: false, nullable: false },
                    CD_ECHGSTAT   	: { type: "string"    , editable: false, nullable: false },
                    NO_ECHGREQ    	: { type: "string"    , editable: false, nullable: false },
                    CD_ECHGRSN    	: { type: "string"    , editable: false, nullable: false },
                    DC_ECHGRSNCTT 	: { type: "string"    , editable: false, nullable: false },
                    NO_MRK        	: { type: "string"    , editable: false, nullable: false },
                    CODE		  	: { type: "string"	  , editable: false, nullable: false },
                    NO_MNGMRK	  	: { type: "string"	  , editable: false, nullable: false },  
                    CD_ECHGRJTRSN 	: {
                    					 type: "string"    
                    					,editable: true
                    					,nullable: false
                    					,validation: {
											cd_echgrjtrsnvalidation: function (input) {
												if (input.is("[name='CD_ECHGRJTRSN']") && input.val() === "") {
													input.attr("data-cd_echgrjtrsnvalidation-msg", "교환거부코드를 입력해 주세요.");
												    return false;
												};
												return true;
											}
										}
                    	              },
                    DC_ECHGRJTCTT 	: {
                    					 type: "string"  
                    					,editable: true 
                    					,nullable: false
                    					,validation: {
											dc_echgrjtcttvalidation: function (input) {
												if (input.is("[name='DC_ECHGRJTCTT']") && input.val() === "") {
													input.attr("data-dc_echgrjtcttvalidation-msg", "교한거부사유를 입력해 주세요.");
												    return false;
												};
												if (input.is("[name='DC_ECHGRJTCTT']") && input.val() !== "" && input.val().length > 1000) {
													input.attr("data-dc_echgrjtcttvalidation-msg", "교환거부사유를 1000자 이내로 입력해 주세요.");
												    return false;
												};
												return true;
											}
										}
                                      },
                    DTS_RECER     	: { 
                    					 type: "string"
                    					,editable: true 
                    					,nullable: false
                    					,validation: {
											dts_recervalidation: function (input) {
												if (input.is("[data-role=datetimepicker]")) {
													input.attr("data-dts_recervalidation-msg", "교환완료일자를 정확히 입력해 주세요.");			                                                        	
												    return input.data("kendoDateTimePicker").value();
												};
												return true;
											}
										}
                                      },
                  	CD_PARS			: {
				                    	type: "array"
					     			   ,editable: true
					     			   ,nullable: false
					                   ,validation: {
					                	   cd_parsvalidation: function (input) {
					                		   if(echgDataVO.procShowCode.indexOf(echgDataVO.updateChange) > -1){
											    	if (input.is("[name='CD_PARS']") && input.val() === "") {
					                                	input.attr("data-cd_parsvalidation-msg", "택배사를 입력해 주세요.");
					                                    return false;
					                                }
					                		   };
					                		   return true;
									    	}
										}
                				      },
                	NO_INVO			: {
				                    	type: "string"
						     		   ,editable: true
						     		   ,nullable: false
						               ,validation: {
						            	   no_invovalidation: function (input) {
						            		   if(echgDataVO.procShowCode.indexOf(echgDataVO.updateChange) > -1){
											    	if (input.is("[name='NO_INVO']") && input.val() === "" ) {
					                                	input.attr("data-no_invovalidation-msg", "송장번호를 입력해 주세요.");
					                                    return false;
					                                };
											    	if(input.is("[name='NO_INVO']") && input.val().length > 100){
											    		input.attr("data-no_invovalidation-msg", "송장번호룰 100자 이내로 입력해 주세요.");
					                                    return false;
											    	};
						            		   	};
						            		   	return true;
						            	   	}
						               	 }
                				       }
                	};

                APP_SA_MODEL.CD_ECHGSTAT.fNm = "echgDataVO.echgStatusOp";
                APP_SA_MODEL.CD_ORDSTAT.fNm  = "echgDataVO.ordStatusOp";
                
                var grdCol = [[APP_SA_MODEL.ROW_CHK],
                              [APP_SA_MODEL.NO_ORD         ,[APP_SA_MODEL.NO_APVL, APP_SA_MODEL.NO_MRKORD]],
                              [APP_SA_MODEL.NM_MRK         , APP_SA_MODEL.NO_MRKORD     ],
                              [APP_SA_MODEL.NO_MRKITEM     , APP_SA_MODEL.NO_MRKREGITEM ],
                              [APP_SA_MODEL.NM_MRKITEM     , APP_SA_MODEL.NM_MRKOPT		],
                              [APP_SA_MODEL.QT_ORD         , APP_SA_MODEL.QT_ECHG       ],
                              [APP_SA_MODEL.NM_PCHR        , APP_SA_MODEL.AM_ORDSALEPRC ],
                              [APP_SA_MODEL.NO_PCHRPHNE    , APP_SA_MODEL.NM_CONS       ],
                              [APP_SA_MODEL.DC_PCHREMI 	   , APP_SA_MODEL.NO_CONSPHNE   ],
                              [APP_SA_MODEL.DC_ECHGRSNCTT  , APP_SA_MODEL.DC_CONSNEWADDR],
                              [APP_SA_MODEL.CD_ORDSTAT     , APP_SA_MODEL.DC_SHPWAY     ],
                              [APP_SA_MODEL.DTS_ORD        , APP_SA_MODEL.DTS_ECHGREQ   ],
                              [APP_SA_MODEL.DT_SND  	   , APP_SA_MODEL.NO_INVO       ],
                              [APP_SA_MODEL.DTS_ECHGAPPRRJT, APP_SA_MODEL.CD_PARS       ],
                              [APP_SA_MODEL.NO_ECHGCPLT	   , APP_SA_MODEL.CD_ECHGSTAT   ],
                              [APP_SA_MODEL.YN_CONN]
                			  	
                ],
                    grdDetOption      = {},
                    grdRowTemplate    = "<tr data-uid=\"#= uid #\">\n",
                    grdAltRowTemplate = "<tr class=\"k-alt\" data-uid=\"#= uid #\">\n",
                    grdCheckOption    = {clickNm:"onOrdGrdCkboxClick",
                		                 allClickNm:"onOrdGrdCkboxAllClick"};
                
                grdDetOption       = UtilSvc.gridDetOption(grdCheckOption, grdCol);
                grdRowTemplate     = grdRowTemplate    + grdDetOption.gridContentTemplate;
                grdAltRowTemplate  = grdAltRowTemplate + grdDetOption.gridContentTemplate;
	            
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
	        		echgStatusOp : [],
	        		echgStatusMo : "",
	        		cdEchgrsnOp: {
	        			dataSource: [],
	        			dataTextField:"NM_DEF",
	                    dataValueField:"CD_DEF",
                        enable: false,
	                    valuePrimitive: true
	        		},
	        		cdEchgrjtOp:{
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
	        		param : "",
	        		procShowMrkCode : ['170106','170103'],
	        		procShowCode : ['001','003'],
	        		rejectShowMrkCode : ['170106','170103'],
	        		rejectShowCode : ['002'],
	        		completeShowMrkCode : ['170104','170102','170106','170103'],
	        		completeShowCode : ['003'],
	        		shpList : ""	        		
	            };   
			            
	            //조회
	            echgDataVO.inQuiry = function(){
	            	var self = this;
	            	self.param = {
        				    NM_MRKITEM : echgDataVO.procName.value,
    					    NO_MRK : echgDataVO.ordMrkNameMo, 
    					    CD_ORDSTAT : echgDataVO.ordStatusMo,
    					    NO_MRKORD : echgDataVO.orderNo.value,      
    					    NM_PCHR : echgDataVO.buyerName.value,
    					    CD_ECHGSTAT : echgDataVO.echgStatusMo,
    					    DTS_CHK : echgDataVO.betweenDateOptionMo,  
    					    DTS_FROM : new Date(echgDataVO.datesetting.period.start.y, echgDataVO.datesetting.period.start.m-1, echgDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
    					    DTS_TO : new Date(echgDataVO.datesetting.period.end.y, echgDataVO.datesetting.period.end.m-1, echgDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
	            	};                   				
	            	if(Util03saSvc.readValidation(self.param)){
	            		$scope.echgkg.dataSource.data([]);
		            	$scope.echgkg.dataSource.page(1);
		            	//$scope.echgkg.dataSource.read();
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
                			        
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.echgkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
	            
	            echgDataVO.isOpen = function (val) {
	            	if(val){
	            		$scope.echgkg.wrapper.height(616);
	            		$scope.echgkg.resize();
	            		if(echgDataVO.param !== "") {
	            			grdEchgVO.dataSource.pageSize(9);
	            		}
	            	}else{
	            		$scope.echgkg.wrapper.height(798);
	            		$scope.echgkg.resize();
	            		if(echgDataVO.param !== "") {
	            			grdEchgVO.dataSource.pageSize(12);
	            		}
	            	}
	            };
	            
	            echgDataVO.ngIfdata = function(showCode, eqCode, inCode){
	            	var me = this,
	            	   shkChk = false,
	            	   eqChk = false;
	            	
	            	shkChk = showCode.indexOf(me.updateChange) > -1;
	            	eqChk = eqCode.indexOf(inCode) > -1;
	            	
	            	return (shkChk && eqChk);
	            };
	                
                //검색 그리드
	            var grdEchgVO = $scope.grdEchgVO = {
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
                    	var updatedChange = echgDataVO.updateChange,
                    		cntnr = e.container;
                    	
                    	switch(updatedChange){
                    		case '001' : {
                    			$timeout(function(){
	                    			var cdpars = cntnr.find("select[name=CD_PARS]");
	                    			
	                    			cdpars.kendoDropDownList({
		    	            			dataSource : echgDataVO.shpList.filter(function(ele){
	    	    	            			return ele.DC_RMK1 === e.model.NO_MRK;
	    	    	            		}),
		    	                		dataTextField : "NM_DEF",
		    	                		dataValueField : "CD_DEF",
		    	                		optionLabel : "택배사를 선택해 주세요 ",
		    	                		select : function(e){
		    	                			var me = this;
		    	                			$timeout(function(){
		    	                				if(me.selectedIndex > 0){
	    	    	                				me.element.parents("table").find(".k-invalid-msg").hide();
	    	    	                			}
		    	                			},0);
		    	                		}
		    	            		});
    		                	},0);
                    			break;
                    		}
                    		case '002' : {
                    			$timeout(function(){                			
    		                    	var ddlRjt = cntnr.find("select[name=CD_ECHGRJTRSN]").data("kendoDropDownList");                    		          
    		                    	
    		                    	ddlRjt.select(0);
    		                    	ddlRjt.trigger("change");                			
    		                	},0);
                    			break;
                    		} 
                    		case '003' : {
                    			
                    			break;
                    		} 
                    	}
                    },
                	scrollable: true,
                	resizable: true,
                	rowTemplate: kendo.template($.trim(grdRowTemplate)),
                	altRowTemplate: kendo.template($.trim(grdAltRowTemplate)),
                	height: 616,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#echg_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {                				
                				saEchgReqSvc.orderList(echgDataVO.param).then(function (res) {         						
            						e.success(res.data.queryList);			
            						echgDataVO.shpList = res.data.queryShipList;
            					});
                			},
                			update: function(e){         
                				var whereIn = ['004','005'];
                				
                				switch(echgDataVO.updateChange){
	                				case '001' : {
	            						if(confirm("선택하신 주문을 교환 승인하시겠습니까?")){
	            							var defer = $q.defer(),
	            								param = e.data.models.filter(function(ele){
	            									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
	            								}); 
	            							
	            							if(e.data.models.length !== param.length){
	            								alert("배송처리 된 교환요청 주문만 승인 처리 할 수 있습니다.");
	                    						return;
	            							};
	            							alert("승인완료");
	            							saEchgReqSvc.echgConfirm(param).then(function (res) {
	                    						defer.resolve();
	                    						if(res.data === "success"){
	                    							alert("교환승인 하였습니다.");                        				
	                    							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^008";
	        	            						$scope.echgkg.dataSource.read();
	                    						}else{
	                    							alert("교환승인을 실패하였습니다.");
	                    							e.error();
	                    						}
	                    					});  
	            							return defer.promise;
	            						};	
	            						break;
	            					}; 
                					case '002' : {
                						if(confirm("선택하신 주문을 교환 거부하시겠습니까?")){
                							var defer = $q.defer(),	
                								param = e.data.models.filter(function(ele){
                									return (ele.ROW_CHK === true && whereIn.indexOf(ele.CD_ORDSTAT) > -1 && ele.CD_ECHGSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								});                             					
                        					if(param.length !== 1){
                        						alert("배송처리 된 교환 요청 주문만 거부 처리 할 수 있습니다.");
                        						return;
                        					};     
                        					alert("거부완료");
                        					saEchgReqSvc.echgReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환거부 하였습니다.");
                        							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^005";
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환거부를 실패하였습니다.");
                        							e.error();
                        						}
                        					});                         
        		                			return defer.promise;
                						}  
                						break;
                					};        
                					case '003' : {
                						if(confirm("교환상품을 접수 하시겠습니까?")){
                        					var defer = $q.defer(),
        	                			 	    param = e.data.models.filter(function(ele){
        	                			 	    	//ele.DTS_ECHGCPLT = kendo.toString(ele.DTS_ECHGCPLT , "yyyyMMddHHmmss");         	                			 	    	
        	                			 	    	return (ele.ROW_CHK === true && ele.CD_ORDSTAT === "008" && ele.CD_ECHGSTAT === "002" && (ele.NO_ORD) && ele.NO_ORD !== "") ;
        	                			 	    });                        					
                        					if(param.length !== 1){
                        						alert("교환승인 된 주문만 접수 처리 할 수 있습니다.");
                        						return;
                        					};        
                        					alert("접수완료");
                        					/*saEchgReqSvc.echgCompleted(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("교환상품을 접수 하였습니다.");
                        							//echgDataVO.ordStatusMo = (echgDataVO.ordStatusMo === '*') ? echgDataVO.ordStatusMo : echgDataVO.ordStatusMo + "^008";
            	            						$scope.echgkg.dataSource.read();
                        						}else{
                        							alert("교환상품접수를 실패하였습니다.");
                        							e.error();
                        						}
                        					});       */                  					
        		                			return defer.promise;
                    	            	}
                						break;
                					};
                					default : {
                						break;
                					};
                				};
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
                	columns: grdDetOption.gridColumn            	          	
	        	};

	            UtilSvc.gridtooltipOptions.filter = "td div";
	            grdEchgVO.tooltipOptions = UtilSvc.gridtooltipOptions;
		        
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.echgkg,
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
	                	grid = $scope.echgkg,
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
                	var grd = $scope.echgkg;
                	
	                if (widget === grd){
	                	
	                	widget.element.find(".k-grid-echg").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),	
		            			chkedLeng = grd.element.find(".k-grid-content input:checked").length,
		            			chosenClass = $(this).attr("class").split(' '),
		            			vali = function vali(arg){
		            				var chsnCls = arg,
		            					ordstat = grdItem.CD_ORDSTAT,
		            				    echgstat = grdItem.CD_ECHGSTAT;
		            				
		            				if(chkedLeng != 1){
			                			alert("한 건의 주문을 선택해 주세요");
			                			return false;
			                		};
			                		if(chsnCls.indexOf('reject') > -1 || chsnCls.indexOf('confirm') > -1){
			                			if(['004','005'].indexOf(ordstat) > -1 && echgstat === '001'){			                				
				                			return true;
			                			}else{
			                				alert("교환요청 된 주문만  처리 할 수 있습니다.");
			                				return false;
			                			};
			                		}else if(chsnCls.indexOf('complete') > -1){
			                			if(ordstat === "008" && grdItem.CD_ECHGSTAT === "002"){				                			
				                			return true;
				                		}else{
				                			alert("교환처리 된 주문만 완료 할 수 있습니다.");
				                			return false;
				                		};
			                		}; 
	            				};
	            			
	            			if(!vali(chosenClass)){
	            				return false;
	            			};	            			
	                		
		                    if($(this).hasClass("confirm")){	  	//교환 처리
		                    	if(['170104','170102','170902'].indexOf(grdItem.CODE) > -1){
		                    		alert("지마켓, 옥션, 쿠팡은 교환처리 기능을  사용할 수 없습니다.");
		                    		return false;
		                    	}
		                    	grd.options.editable.window.width = "700px";
	                			echgDataVO.updateChange = "001";
		                    }else if($(this).hasClass("reject")){ 	//교환거부
		                    	if(['170104','170102','170902'].indexOf(grdItem.CODE) > -1){
		                    		alert("지마켓, 옥션, 쿠팡은 교환거부 기능을  사용할 수 없습니다.");
		                    		return false;
		                    	}
		                    	grd.options.editable.window.width = "700px";
	                			echgDataVO.updateChange = "002";	                			
		                    }else if($(this).hasClass("complete")){ //교환완료
		                    	if('170902' === grdItem.CODE){
		                    		alert("쿠팡은 교환 완료 기능을  사용할 수 없습니다.");
		                    		return false;
		                    	}
                				grdItem.DTS_RECER = kendo.toString(new Date(), "yyyyMMddHHmmss");
		                    	grd.options.editable.window.width = "550px";
	                			echgDataVO.updateChange = "003";
		                    }			                    	
		                    grd.editRow(chked.closest("tr"));			                    		                			
	                	});
	                }
                });    
	            
            }]);
}());