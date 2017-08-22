(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sa.Ord.controller : sa.OrdCtrl
     * 상품분류관리
     */
    angular.module("sa.Ord.controller")
        .controller("sa.OrdCtrl", ["$scope", "$state", "$http", "$q", "$log", "sa.OrdSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util03saSvc",
            function ($scope, $state, $http, $q, $log, saOrdSvc, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util03saSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            //마켓명 드랍 박스 실행	
	            var mrkName = (function(){
        			UtilSvc.csMrkList().then(function (res) {
        				if(res.data.length >= 1){
        					ordDataVO.ordMrkNameOp = res.data;
        				}
        			});		
	            }());
	            
	            //주문상태 드랍 박스 실행	
	            var orderStatus = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00048",
    					lcdcls: "SA_000007"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordDataVO.ordStatusOp = res.data;
        				}
        			});
	            }());
	            
	            //기간 상태 드랍 박스 실행	
	            var betweenDate = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00055",
    					lcdcls: "SA_000014"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordDataVO.betweenDateOptionOp = res.data;
        					ordDataVO.betweenDateOptionMo = res.data[0].CD_DEF; //처음 로딩 때 초기 인덱스를 위하여
        				}
        			});
	            }());
	            
	            //취소 사유 코드 드랍 박스 실행	
	            var cancelReasonCode = (function(){
    				var param = {
    					lnomngcdhd: "SYCH00056",
    					lcdcls: "SA_000015"
    				};
        			UtilSvc.getCommonCodeList(param).then(function (res) {
        				if(res.data.length >= 1){
        					ordDataVO.cancelCodeOp.dataSource = res.data;
        				}
        			});
	            }());
	            
	            var ordDataVO = $scope.ordDataVO = {
	            	boxTitle : "주문",
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
	        		admin : { value: "" , focus: false },
	        		ordMrkNameOp : [],
	        		ordMrkNameMo : "*",
	        		ordStatusOp : [],
	        		ordStatusMo : "*",
	        		betweenDateOptionOp : [],
	        		betweenDateOptionMo : "",
	        		cancelCodeOp : {
    					dataSource: [],
    					dataTextField: "NM_DEF",
                        dataValueField: "CD_DEF",
                    	valuePrimitive: true,
    				},
	        		cancelCodeMo : "",
	        		dataTotal : 0,
	        		resetAtGrd :"",
	        		param : ""
		        };	           
	            
	            //조회
            	ordDataVO.inQuiry = function(){
	            	var me = this;
	            	me.param = {	  
    				    NM_MRKITEM : ordDataVO.procName.value,
					    NM_MRK : ordDataVO.ordMrkNameMo, 
					    CD_ORDSTAT : ordDataVO.ordStatusMo,
					    NO_MRKORD : ordDataVO.orderNo.value,      
					    NM_PCHR : ordDataVO.buyerName.value,
					    NO_ORDDTRM : ordDataVO.admin.value,  
					    DTS_CHK : ordDataVO.betweenDateOptionMo,  
					    DTS_FROM : new Date(ordDataVO.datesetting.period.start.y, ordDataVO.datesetting.period.start.m-1, ordDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
					    DTS_TO : new Date(ordDataVO.datesetting.period.end.y, ordDataVO.datesetting.period.end.m-1, ordDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),				    
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
		        	                	                	
                	angular.element($("#grd_chk_master")).prop("checked",false);
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.ordkg;
                	me.resetAtGrd.dataSource.data([]);	            		            	
	            };

	            ordDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.ordkg.wrapper.height(616);
	            		$scope.ordkg.resize();
	            		grdOrdVO.dataSource.pageSize(9);
	            	}
	            	else {
	            		$scope.ordkg.wrapper.height(798);
	            		$scope.ordkg.resize();
	            		grdOrdVO.dataSource.pageSize(12);
	            	}
	            };
	            
	            	            
		        //주문 검색 그리드
	            var grdOrdVO = $scope.gridOrdVO = {
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
                				/*var param = {	  
                				    NM_MRKITEM : ordDataVO.procName.value,
            					    NM_MRK : ordDataVO.ordMrkNameMo, 
            					    CD_ORDSTAT : ordDataVO.ordStatusMo,
            					    NO_MRKORD : ordDataVO.orderNo.value,      
            					    NM_PCHR : ordDataVO.buyerName.value,
            					    NO_ORDDTRM : ordDataVO.admin.value,  
            					    DTS_CHK : ordDataVO.betweenDateOptionMo,  
            					    DTS_FROM : new Date(ordDataVO.datesetting.period.start.y, ordDataVO.datesetting.period.start.m-1, ordDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),           
            					    DTS_TO : new Date(ordDataVO.datesetting.period.end.y, ordDataVO.datesetting.period.end.m-1, ordDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
            					    PAGE: parseInt(e.data.page), 
            					    PAGE_SIZE: parseInt(e.data.pageSize) 
                                };   
                				if(Util03saSvc.readValidation(param)){
                					saOrdSvc.orderList(param).then(function (res) {
                    					e.success(res.data);
                        			});
                				}else{
                					e.error();
                				};*/                				
                				var pager = {
		                					PAGE: parseInt(e.data.page),
		                					PAGE_SIZE: parseInt(e.data.pageSize)
                						},
                					searchParam = $.extend(ordDataVO.param, pager);
        					     
                				saOrdSvc.orderList(searchParam).then(function (res) {
                					e.success(res.data);
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
		                			});
		                			return defer.promise;
            	            	}else{
            	            		return;
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
                			angular.element($("#grd_chk_master")).prop("checked",false);
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
                				fields: {						                    
                					ROW_CHK: 		   {
				                    						type: "boolean", 
															editable: true,  
															nullable: false
            										   },
								    NO_ORD:	   	   	   {	
                											type: "string", 
                											editable: false,
            												nullable: false
        											   },                    					
								    NO_APVL:		   {	
                											type: "string", 
                											editable: false, 
                											nullable: false
                									   },
                			        NM_MRK: 	   	   {	
															type: "string", 
															editable: false,
															nullable: false
                    						    	   },
						    	    NO_MRKORD: 	   	   {
															type: "string", 
															editable: false, 
															nullable: false
						    	    				   },
						    	    NO_MRK: 	   	   {
															type: "string", 
															editable: false, 
															nullable: false
						    	    				   },						    	    				   
						    	    NO_MRKITEM: 	   {
			        										type: "string",
			        										defaultValue: "",
			        										nullable: false //true 일때 defaultValue가 안 됨
						    	    				   },
	    	    				   	NO_MRKREGITEM: 	   {
                											type: "string",                     										
                											editable: false,
                    										nullable: false
                									   },                    									   
								    NM_MRKITEM:	   	   {	
			    									    	type: "string", 
								    						editable: true,
								    						nullable: false
								    				   },
								    NM_MRKOPT:	   	   {	
				       										type: "string", 
				       										editable: false,
															nullable: false
				   									   },
				   					AM_ORDSALEPRC: 	   {	
                   											type: "number", 
                											editable: false,
                											nullable: false
                									   },                    					
                					AM_PCHSPRC: 	   {
                											type: "number",
                    										editable: false, 
                    										nullable: false //true 일때 defaultValue가 안 됨	                    										
                									   },
                					NM_PCHR: 	       {
                    										type: "string",
                    										editable: true,
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
                				    NO_CONSHDPH: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },
                				    DC_PCHREMI: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    NO_CONSPOST:	   {
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
                				    DC_CONSOLDADDR:    { 	
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
                				    QT_ORD:			   {
					                				    	type: "number",
															editable: false, 
															nullable: false	
                				    				   },
                				    DTS_APVL: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DTS_ORD: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },
                				    YN_CONN: 	   	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },	
                				    DTS_ORDDTRM: 	   {
				                    				    	type: "string", 
															editable: false, 
															nullable: false
                				    				   },   
				    				AM_ITEMPRC: 	   {
					                				    	type: "number", 
															editable: false, 
															nullable: false
								    				   },
   				    				SALES: 	   	   	   {	
				                    				    	type: "number", 
															editable: false, 
															nullable: false
			   				    				   	   },	
   				    				AM_SHPCOST: 	   {
				                    				    	type: "number", 
															editable: false, 
															nullable: false
				   				    				   },				   
                				    CD_CCLRSN: 	       {
				                    				    	type: "string", 
															validation: {
																cd_cclrsnvalidation: function (input) {
					  									    		if (input.is("[name='CD_CCLRSN']") && input.val() === "") {
			                                                        	input.attr("data-cd_cclrsnvalidation-msg", "취소 사유코드를 입력해 주세요.");
			                                                            return false;
			                                                        }
				                                                  return true;
				  									    	  	}
															}
                				    				   },
                				    DC_CCLRSNCTT: 	       {
				                    				    	type: "string",
															editable: true,
															validation: {
																dc_cclrsncttvalidation: function (input) {
					  									    		if (input.is("[name='DC_CCLRSNCTT']") && input.val() === "") {
			                                                        	input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 입력해 주세요.");
			                                                            return false;
			                                                        }
					  									    		if(input.val().length > 1000){
					  									    			input.attr("data-dc_cclrsncttvalidation-msg", "주문취소사유를 1000자 이내로 입력해 주세요.");
			                                                            return false;
					  									    		}
				                                                  return true;
				  									    	  	}
															},
															nullable: false
                				    				   }
                				}
                			}
                		},
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	//selectable: "multiple, row",
                	//persistSelection: true,
                	toolbar: [{template: kendo.template($.trim($("#ord-toolbar-template").html()))}],
                	columns: [
                	            {   
                	            	field: "ROW_CHK",
			                        /*title: "<span class='ROW_CHK k-checkbox'>선<br/>택</span>",*/
			                        title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onOrdGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",
			                        width: "30px",
			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"},
			                        selectable: true
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
				                                    field: "QT_ORD",
				                                    title: "주문수량",
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
		                        },                        
		                        {
		                        	field: "DTS_ORD",
                                    title: "주문일시",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [ 
		                                       	{   
				                                    field: "DTS_APVL",
						                            title: "결제일시",
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        },                        
		                        {
		                        	
		                        	field: "DTS_ORDDTRM",
	                                title: "주문확정일시",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [
		                                       	{
		                                       		field: "YN_CONN",
		        		                            title: "연동구분",	
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        },                        
		                        {
		                        	field: "AM_ITEMPRC",
                                    title: "주문상품단가",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [ 
		                                       	{   
				                                    field: "SALES",
						                            title: "판매금액",
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        },                        
		                        {
		                        	
		                        	field: "AM_SHPCOST",
	                                title: "배송비",
		                            width: 100,
		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
		                            columns: [
		                                       	{
				                                    width: 100,
							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
				                                }
			                                ]
		                        }    
                    ],
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
                		template: kendo.template($.trim($("#ord_popup_template").html())),
                		confirmation: false
                	},
                	edit: function(e){
                		//그리드에서는 그리드 모델과 연결되어 있어서  처음에  selected 되는 값이 null로 되어 강제로 불러와서 셀렉팅을 해줌                		
                		var ddl = $("select[name=CD_CCLRSN]").data("kendoDropDownList");
                		ddl.select(0);
                		ddl.trigger("change");
                	},
                	resizable: true,
                	rowTemplate: kendo.template($.trim($("#ord_template").html())),
                	altRowTemplate: kendo.template($.trim($("#ord_alt_template").html())),
                	//detailTemplate : kendo.template($.trim($("#ord_detail_template").html())),
                	height: 530
                	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
                	//rowTemplate을 사용한 colunm은 lock을 사용할 수 없음	                    	
	        	};
	            
	            //kendo grid 체크박스 옵션
                $scope.onOrdGrdCkboxClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.ordkg,
	                	dataItem = grid.dataItem(row),
	                	allChecked = true;
	                 	                
	                dataItem.ROW_CHK = checked;
                	dataItem.dirty = checked;
	                
	                for(i; i<grid.dataSource.data().length; i+=1){
	                	if(!grid.dataSource.data()[i].ROW_CHK){
	                		allChecked = false;
	                	}
	                }
	                
	                angular.element($("#grd_chk_master")).prop("checked",allChecked);
	                
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
	                	grid = $scope.ordkg,
	                	dataItem = grid.dataItems(row),
	                	dbLength = dataItem.length;
	                
	                if(dbLength < 1){	                	
	                	alert("전체 선택 할 데이터가 없습니다.");
	                	angular.element($("#grd_chk_master")).prop("checked",false);
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
                	var grd = $scope.ordkg;
                	
	                if (widget === grd){ 
	                	//주문취소 팝업 가져오기
	                	widget.element.find(".k-grid-edit").on("click", function(e){
	                		var	chked = grd.element.find(".k-grid-content input:checked"),
		            			chkedLeng = grd.element.find(".k-grid-content input:checked").length;
	                    		                    
		                    if(chkedLeng === 1){
		                		grd.editRow(chked.closest('tr'));
		                	}else if(chkedLeng > 1){
		                		alert("취소할 주문을 1개만 선택해 주세요!");
		                	}else if(chkedLeng < 1){
		                		alert("취소할 주문을 선택해 주세요!");
		                	}
	                	});
	                	//Switches the table row which is in edit mode and saves any changes made by the user.
	                	//즉  주문확정은 그리드에 표시되는 내용이 수정되는게 아니라서, 그리드의 update, save를 타지 않음 그래서 따로 이벤트를 만듦 
	                	//또한 editable이 false인 경우 그리드의 update, save를 타지 않음
	                	widget.element.find(".k-grid-save").on("click", function(e){
	                		e.preventDefault();
	                		
	                		var	chkedLeng = grd.element.find(".k-grid-content input:checked").length,
	            				param = {
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
		                    			});
		                			}
		                		}
		                	};
	                	});
	                }
                });
                                
                $scope.grdDblClickGo = function(noOrd, noMrkord){
                	$state.go("app.saOrd", { kind: "", menu: null, noOrd : noOrd, noMrkord: noMrkord});
                };
                
                //alert 경고
                $scope.notf1Options = {
            		position: {
                        pinned: false,
                        /*top: 30,
                        left: 30,*/
                        height: 300,
                        width: 250                        
                    },	
                    templates: [{                    	
                        type: "warning",
                        template: $("#ord-notificationTemplate").html()
                    }]
                };

                $scope.ngValue = "[닫기]";

                $scope.showPopup = function (msg) {
                    $scope.notf1.show({
                      kValue: msg
                    }, "warning");
                };
	            
            }]);
}());