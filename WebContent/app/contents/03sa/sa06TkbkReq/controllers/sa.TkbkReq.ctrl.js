(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.TkbkReq.controller : sa.TkbkReqCtrl
     * 상품분류관리
     */
    angular.module("sa.TkbkReq.controller")
        .controller("sa.TkbkReqCtrl", ["$scope", "$http", "$q", "$log", "sa.TkbkReqSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "$window",
            function ($scope, $http, $q, $log, saTkbkReqSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, $window) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            kendo.culture('ko-KR');// 이거 해야지 원화로 나옴
	            
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
	        		resetAtGrd : ""
	            };   
		            
	            //조회
	            tkbkDataVO.inQuiry = function(){
	            	//var me = this;
	            	$scope.tkbkkg.dataSource.page(1);  // 페이지 인덱스 초기화
	            	$scope.tkbkkg.dataSource.read();
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
                			        	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.tkbkkg;
                	me.resetAtGrd.dataSource.data([]);
	            };	
		            
	            //popup insert & update Validation
	            $scope.readValidation = function(idx){
	            	var result = true;
            		if(idx.NM_MRK === null || idx.NM_MRK === ""){ alert("마켓명을 입력해 주세요."); result = false; return; };
            		if(idx.CD_ORDSTAT === null || idx.CD_ORDSTAT === ""){ alert("주문상태를 입력해 주세요."); result = false; return;};
            		if(idx.DTS_CHK === null || idx.DTS_CHK === ""){ alert("기간을 선택해 주세요."); result = false; return;};			            
	            	return result;
	            };
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var element = $(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.tkbkkg,
	                	dataItem = grid.dataItem(row);               
	                	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if(checked){
	                	row.addClass("k-state-selected");
	                }else{
	                	row.removeClass("k-state-selected");
	                };
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
                	rowTemplate: kendo.template($.trim($("#tkbk_template").html())),
                	altRowTemplate: kendo.template($.trim($("#tkbk_alt_template").html())),
                	height: 550,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#tkbk_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = {
                				    NM_MRKITEM : tkbkDataVO.procName.value,
            					    NO_MRK : tkbkDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : tkbkDataVO.ordStatusMo,
            					    NO_MRKORD : tkbkDataVO.orderNo.value,      
            					    NM_PCHR : tkbkDataVO.buyerName.value,
            					    DTS_CHK : tkbkDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(tkbkDataVO.datesetting.period.start.y, tkbkDataVO.datesetting.period.start.m-1, tkbkDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(tkbkDataVO.datesetting.period.end.y, tkbkDataVO.datesetting.period.end.m-1, tkbkDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                };   
                				
                				if($scope.readValidation(param)){
                					saTkbkReqSvc.orderList(param).then(function (res) {                						
	            						e.success(res.data);			                   				                    					
                					});                					
                				}else{
                					e.error();
                				};
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
                        							tkbkDataVO.ordStatusMo = tkbkDataVO.ordStatusMo + "^007";
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
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								});                             					
                        					if(param.length !== 1){
                        						alert("반품요청 된 주문만 거부 처리 할 수 있습니다.");
                        						return;
                        					};                        					
                        					saTkbkReqSvc.tkbkReject(param[0]).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품거부 하였습니다.");
                        							tkbkDataVO.ordStatusMo = tkbkDataVO.ordStatusMo + "^005";
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
                									return (ele.ROW_CHK === true && ele.CD_TKBKSTAT === "001" && (ele.NO_ORD) && ele.NO_ORD !== "");
                								}); 
                							
                							if(e.data.models.length !== param.length){
                								alert("반품요청 된 주문만 승인 처리 할 수 있습니다.");
                        						return;
                							};
                							saTkbkReqSvc.tkbkConfirm(param).then(function (res) {
                        						defer.resolve();
                        						if(res.data === "success"){
                        							alert("반품승인 하였습니다.");                        							
                        							tkbkDataVO.ordStatusMo = tkbkDataVO.ordStatusMo + "^007";
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
                        							tkbkDataVO.ordStatusMo = tkbkDataVO.ordStatusMo + "^007";
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
                		},                		
                		pageSize: 7,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {						                    
                					ROW_CHK: 		   {
				                    						type: "boolean", 
															editable: false,
															nullable: false
            										   },
            						NO_ORD: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_APVL: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
								    NM_MRK: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKORD: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_MRKREGITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NM_MRKITEM: 	   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NM_MRKOPT: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									AM_ORDSALEPRC: 	   {
						            						type: "number", 
															editable: false,
															nullable: false
													   },
									NM_PCHR: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NM_CONS: 		   {
						            						type: "string", 
															editable: false,
															nullable: false
													   },
									NO_PCHRPHNE: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_PCHREMI: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_CONSNEWADDR:    {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_PCHRREQCTT: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    CD_ORDSTAT: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_SHPWAY: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DTS_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
			    				    QT_ORD: 	   	   {
					                				    	type: "string",
															editable: false,
															nullable: false
			    				   					    },
								    DTS_TKBKREQ:		{
													    	type: "string",
															editable: false,
															nullable: false
								    					},
								    NO_UPDATE: 			{
													    	type: "string",
															editable: false,
															nullable: false
								    					},
								    YN_CONN: 			{
													    	type: "string",
															editable: false,
															nullable: false
								    					},
								    DTS_CCLREQ: 		{
													    	type: "string",
															editable: false,
															nullable: false
								    					}, 		
								    CD_TKBKRSN:			{
													    	type: "string",
															editable: false,
															nullable: false
			    										},
								    DC_APVLWAY: 		{
													    	type: "string",
															editable: false,
															nullable: false
								    					},
			    					DTS_TKBKCPLT: 		{
								    						type: "date",
															editable: true,
															nullable: false,
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
									DTS_TKBKCPLT_VIEW:  {
								    						type: "string",
															editable: false,
															nullable: false
														},						
			    					NO_TKBKCPLT: 		{
								    						type: "string",
															editable: false,
															nullable: false
			    										},
			    					QT_TKBK: 			{
								    						type: "string",
															editable: false,
															nullable: false
			    										},
			    					NO_INSERT: 			{								//이 컬럼 필요 있나?
								    						type: "string",
															editable: false,
															nullable: false
			    										},
			    					CD_TKBKSTAT:		{
								    						type: "string",
															editable: false,
															nullable: false
								    					},
								    NO_TKBKREQ: 		{	
													    	type: "string",
															editable: false,
															nullable: false
								    					},			
								    NO_MRK:				{
								    						type: "string",
															editable: false,
															nullable: false
								    					},
								    requesteNo: 		{	
													    	type: "string",
															editable: false,
															nullable: false
								    					},	
								    mall_no: 			{	
													    	type: "string",
															editable: false,
															nullable: false
								    					},	
								    DC_TKBKRJTCTT:		{
								    						type: "string",
															editable: true,
															nullable: false,
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
								    CD_TKBKRJT:			{
								    						type: "string",
															editable: true,
															nullable: false,
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
                				}
                			}
                		},
                	}),                	
                	columns: [	
								{
								    field: "ROW_CHK",
								    title: "<span class='ROW_CHK'>선<br/>택</span>",					                        
								    width: "30px",
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								},                        
								{	
									field: "NO_ORD",
								    title: "관리번호",
								    width: "100px",
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_APVL",
								                    title: "결제번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								             ]
								},
								{
									field: "NM_MRK",	
								    title: "마켓명",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_MRKORD",
								                    title: "주문번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NO_MRKITEM",
								    title: "마켓상품번호",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NO_MRKREGITEM",
								                    title: "상품번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NM_MRKITEM",
								    title: "상품명 / 옵션(상품구성",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "mall_no",
								                    title: "결과 전송 유무",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},    
								{
									field: "QT_ORD",	
								    title: "판매수량",
								    width: 100,		                            
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "QT_TKBK",
								                    title: "반품수량",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                 
								{
									field: "NM_PCHR",
								    title: "구매자",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "AM_ORDSALEPRC",
								                    title: "판매가",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NO_PCHRPHNE",
								    title: "전화번호",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_APVLWAY",
								                    title: "결제방법",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DC_PCHREMI",
								    title: "이메일",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NM_CONS",
								                    title: "수취인",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "CD_TKBKRSN",
								    title: "반품사유",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_CONSNEWADDR",
								                    title: "수취인추소",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "CD_ORDSTAT",
								    title: "주문상태",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_SHPWAY",
								                    title: "배송방법",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "DTS_ORD",
								    title: "주문일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DTS_CCLREQ",
								                    title: "취소/반품일시",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DTS_TKBKREQ",
								    title: "반품요청확인일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "NO_INSERT",
								                    title: "반품확인자",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DTS_TKBKCPLT_VIEW",
								    title: "반납상품접수일자",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "NO_TKBKCPLT",
								                    title: "반납상품접수확인자",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "YN_CONN",
								    title: "연동구분",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	/*{
								                    field: "QT_ORD",
								                    title: "주문수량",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }*/
								               	{
								                    field: "CD_TKBKSTAT",
								                    title: "반품상태",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								}                	           
                    ]                	          	
	        	};
	            	            
	            $scope.$on("kendoWidgetCreated", function(event, widget){
                	var grd = $scope.tkbkkg;
                	
	                if (widget === grd){
	                	//반품접수
	                	widget.element.find(".k-grid-tkbk-accept").on("click", function(e){
	                		var	chked = grd.element.find("input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),
		            			chkedLeng = grd.element.find("input:checked").length;
	                    		                    
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
	                		var	chked = grd.element.find("input:checked"),
	                			grdItem = grd.dataItem(chked.closest("tr")),	
		            			chkedLeng = grd.element.find("input:checked").length;
	                    		                    
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
	                		var chkedLeng = grd.element.find("input:checked").length;
	                		
	                		if(chkedLeng < 1){
                				alert("주문을 선택해 주세요.");	
                				return;
                			};
	                		tkbkDataVO.updateChange = "003";
	                		grd.saveChanges();
	                	});
	                	
	                	//반품요청 결과전송
	                	widget.element.find(".k-grid-tkbk-send").on("click", function(e){
	                		var chkedLeng = grd.element.find("input:checked").length;
	                		
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