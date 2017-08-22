(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.OrdShpAll.controller : sa.OrdShpAllCtrl
     * 상품분류관리
     */
    angular.module("sa.OrdShpAll.controller")
        .controller("sa.OrdShpAllCtrl", ["$scope", "$http", "$q", "$log", "sa.OrdShpAllSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "Util03saSvc",
            function ($scope, $http, $q, $log, saOrdShpAllSvc, APP_CODE, $timeout, resData, Page, UtilSvc, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            
	            kendo.culture('ko-KR');// 이거 해야지 원화로 나옴
	            
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
                    	messages: {
                    		empty: "표시할 데이터가 없습니다.",
                    		display: "총 {2}건 중 {0}~{1}건의 자료 입니다."
                    	}
                    },                    
                    noRecords: true,
                    dataBound: function(e) {
                       // this.expandRow(this.tbody.find("tr.k-master-row").first()); //상세 테이블 볼때 첫번째 클릭되서 조회됨
                    },
                    collapse: function(e) {
                        this.cancelRow();
                    },
                    /*editable: {
                    	mode: "popup",
                		window : {
                	        title: ""
                	    },
                		template: kendo.template($.trim($("#echg_popup_template").html())),
                		confirmation: false
                    },*/
                    //edit: function(e){},
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
                	rowTemplate: kendo.template($.trim($("#ordall_template").html())),
                	altRowTemplate: kendo.template($.trim($("#ordall_alt_template").html())),
                	height: 550,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	toolbar: [{template: kendo.template($.trim($("#ordall_toolbar_template").html()))}],
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				/*var param = {
                				    NM_MRKITEM : ordAllDataVO.procName.value,
            					    NO_MRK : ordAllDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : ordAllDataVO.ordStatusMo,
            					    NO_MRKORD : ordAllDataVO.orderNo.value,      
            					    NM_PCHR : ordAllDataVO.buyerName.value,
            					    DTS_CHK : ordAllDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(ordAllDataVO.datesetting.period.start.y, ordAllDataVO.datesetting.period.start.m-1, ordAllDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(ordAllDataVO.datesetting.period.end.y, ordAllDataVO.datesetting.period.end.m-1, ordAllDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis")
                                };
                				if(Util03saSvc.readValidation(param)){
                					saOrdShpAllSvc.orderList(param).then(function (res) {
                						e.success(res.data);
                					});
                				}else{
                					e.error();
                				}*/
                				saOrdShpAllSvc.orderList(ordAllDataVO.param).then(function (res) {
            						e.success(res.data);
            					});
                			},
                			/*update: function(e){                				
                				
                			},*/
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
                		pageSize: 7,
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_ORD",
                				fields: {						                    
                					/*ROW_CHK: 		   {
				                    						type: "boolean", 
															editable: false,
															nullable: false
            										   },*/
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
								    QT_ORD: 	   	   {
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
								    NO_CONSPHNE: 	   {
					                				    	type: "string",
															editable: false,
															nullable: false
								    				   },
								    DC_CONSNEWADDR:    {
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
								    DTS_ECHGAPPRRJT:   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
					    			NO_INVO:   		   {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },			
			    				    NM_PARS:   	       {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
			    				    DTS_ORDDTRM:       {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
			    				    NO_CONSHDPH:       {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
			    				    AM_PCHSPRC:        {
													    	type: "number",
															editable: false,
															nullable: false
								    				   },
								    DT_SND:            {
													    	type: "string",
															editable: false,
															nullable: false
								    				   },
			    				    DC_PCHRREQCTT:     {
													    	type: "string",
															editable: false,
															nullable: false
			    				    				   }
                				}
                			}
                		},
                	}),                	
                	columns: [	   
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
								    title: "상품명",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "NM_MRKOPT",
								                    title: "옵션(상품구성)",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},    
								{
									field: "AM_ORDSALEPRC",	
								    title: "판매가",
								    width: 100,		                            
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "AM_PCHSPRC",
								                    title: "구입가",
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
								                    field: "NM_CONS",
								                    title: "수취인",
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
								                    field: "NO_CONSHDPH",
								                    title: "전화번호",
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
								                    field: "DC_CONSNEWADDR",
								                    title: "주소1",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								} ,                        
								{
									field: "DC_PCHRREQCTT",
								    title: "요청내용",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DC_CONSNEWADDR",
								                    title: "주소2",
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
									field: "DTS_ORDDTRM",
								    title: "주문확정일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [ 
								               	{
								                    field: "DTS_ORD",
								                    title: "주문일시",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "NM_PARS",
								    title: "택배사",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "NO_INVO",
								                    title: "송장번호",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								},                        
								{
									field: "DT_SND",
								    title: "배송일시",
								    width: 100,
								    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
								    columns: [
								               	{
								                    field: "QT_ORD",
								                    title: "주문수량",
								                    width: 100,
								                    headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
								                }
								            ]
								}  	  								
                    ]                	          	
	        	};
	            	            
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