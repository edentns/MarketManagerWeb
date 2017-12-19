(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Itl.controller")
        .controller("ma.ItlCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.QaSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $http, $q, $log, MaQaSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var rowClick = function( arg ) {
	            	var selected = $.map(this.select(), function(item) {
	            		return item.childNodes[17].innerText;
                    });
	            	$scope.itlDataVO.rowClick(selected);
				};
	            
	            var itlDataVO = $scope.itlDataVO = {
	            	userInfo : JSON.parse($window.localStorage.getItem("USER")),
	            	boxTitle : "검색",
	            	settingMrk : {
	        			id: "NO_MNGMRK",
	        			name: "NM_MRK",
	        			maxNames: 2,
	        		},
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 3
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
                    contentText: { value: "" , focus: false},			//제목,내용
                    mngMrkModel : "*",                                  //마켓명 모델
                    mngMrkBind  : [],                                   //마켓명 옵션
                    nmJobModel  : "*",                                  //작업명 모델
                    nmJobBind   : [],                                   //작업명 옵션                    
                    stJobModel  : "*",                     	            //작업상태 모델
                    stJobBind   : [],                     	    	    //작업상태 옵션
    				dataTotal   : 0,
             	    resetAtGrd  : ""
		        };
	            
	            itlDataVO.stopEvent = function(e){
	            	e.preventDefault();
	            	e.stopPropagation();
                };
                
                itlDataVO.rowClick = function(selected){
                	var param = {
    					procedureParam: "USP_MA_07ITL_CLICK_GET&L_RESERVED_DATE@s",
    					L_RESERVED_DATE : selected[0]
    				};
					UtilSvc.getList(param).then(function (res) {
						$scope.ordkg.dataSource.data(res.data.results[0]);/*
						$scope.trankg.dataSource.data(res.data.results[1]);
						$scope.cankg.dataSource.data(res.data.results[2]);
						$scope.cskg.dataSource.data(res.data.results[3]);*/
					});
                };
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            itlDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            	            
	            //초기 실행
	            itlDataVO.inQuiry = function(){
	            	itlDataVO.mngMrkBind = resData.mngMrkData;
	            	itlDataVO.nmJobBind = resData.nmJobData;
	            	itlDataVO.stJobBind = resData.stJobData;
	            };	 
	            
	          //초기 실행
	            itlDataVO.search = function(){
	            	//to-do
	            	/*if(!me.answerStatusModel){ alert("답변처리상태를 입력해 주세요."); return false; };
	            	if(!me.qaNocModel){ alert("문의대상을 입력해 주세요."); return false; };	            	
	            	if(me.param.NOTI_TO > me.param.NOTI_FROM){ alert("공지일자를 올바르게 선택해 주세요."); return false; };*/
	            	
	            	$scope.itlkg.dataSource.data([]);
	            	$scope.itlkg.dataSource.page(1);
	            	$scope.itlkg.dataSource.read();
	            };	
	            	            
	            //초기화버튼
	            itlDataVO.init = function(){
	            	var me  = this;
                	
                	me.contentText.value = "";
                	
                	me.answerStatusModel = ["*"];
                	me.allSelectTargetModel = [];

            		me.fileSlrDataVO.currentDataList = [];
        			me.fileMngDataVO.currentDataList = [];
                	
                	me.answerStatusBind.bReset = true;
                	
                	$timeout(function(){
                		angular.element(".frm-group").find("button:eq(0)").triggerHandler("click");
                		angular.element(".frm-group").find("button:eq(2)").triggerHandler("click");
                	},0);                	
                	        			                	
                	me.dataTotal = 0;
                	me.resetAtGrd = $scope.qakg;
                	me.resetAtGrd.dataSource.data([]);
                	
                	$scope.memSearchGrd.selectAll = false;
                	$scope.memSearchGrd.selectAllItems();              	
                	$scope.memSearchGrd.searchValue = ""; 	//공지대상 검색 팝업창 초기화                	                	 
                	
                	me.initCdTarget();
	            };
	            
	            //open
	            itlDataVO.isOpen = function(val){
	            	if(val) {
	            		$scope.qakg.wrapper.height(657);
	            		$scope.qakg.resize();
	            		gridItlVO.dataSource.pageSize(20);
	            	}else {
	            		$scope.qakg.wrapper.height(798);
	            		$scope.qakg.resize();
	            		gridItlVO.dataSource.pageSize(24);
	            	}
	            };	
	            
	            itlDataVO.paramFunc =  function(param){
					var inputParam = angular.copy(param.data[0].ARR_NO_C);
					
					if(inputParam.indexOf('*') > -1){
						inputParam = $scope.itlDataVO.allSelectTargetModel;    
						$scope.itlDataVO.allSelectTargetModel = [];
					}
					return inputParam;
				};
				
				//각 컬럼에 header 정보 넣어줌, 공통 모듈이 2줄 위주로 작성 되어 있기 떄문에  일부러 일케 했음 
				itlDataVO.columnProc = (function(){
            		var tpl = [ APP_SA_MODEL.ROW_NUM,
            		            { field: "NO_C"       	, type: "string" , width: "60px", textAlign: "center", title: "문의 가입자번호"},            		            
		                        { field: "NO_MRK"       , type: "string" , width: "90px", textAlign: "center", title: "마켓명"},   
		                        { field: "NO_MNGMRK"    , type: "string" , width: "90px", textAlign: "center", title: "관리마켓명"},
		                        { field: "DC_MRKID"     , type: "string" , width: "50px", textAlign: "center", title: "마켓ID"},
		                        { field: "JOB"          , type: "string" , width: "80px", textAlign: "center", title: "작업명"},
		                        { field: "STATUS"       , type: "string" , width: "70px", textAlign: "center", title: "작업상태"},
		                        { field: "RESULT"       , type: "string" , width: "150px",textAlign: "center", title: "결과메시지"},
		                        { field: "RESERVED_DATE", type: "string" , width: "90px", textAlign: "center", title: "예약시간"},
		                        { field: "START_DATE"   , type: "string" , width: "90px", textAlign: "center", title: "시작일시"},
		                        { field: "END_DATE"     , type: "string" , width: "90px", textAlign: "center", title: "종료일시"},
		                        { field: "UPDATED"      , type: "string" , width: "90px", textAlign: "center", title: "수정일시"},
		                       ],
            			extTpl = {headerAttributes : {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
            			returnTpl = [];
            			
        				for(var i=0; i<tpl.length; i++){
        					var temp = angular.extend(extTpl, tpl[i]);
        					returnTpl.push(angular.copy(temp));
            			};
            			return returnTpl;
            	}());				
					                            
	            //검색 그리드
                var gridItlVO = $scope.gridItlVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                    		read: function(e) {
                				var param = {
                						procedureParam: "USP_MA_07ITL_SEARCH&L_LIST01@s|L_LIST02@s|L_LIST03@s|L_START_DATE@s|L_END_DATE@s",
                						L_LIST01      : itlDataVO.mngMrkModel,
                						L_LIST02      : itlDataVO.nmJobModel,
                						L_LIST03      : itlDataVO.stJobModel,
                						L_START_DATE  : new Date(itlDataVO.datesetting.period.start.y, itlDataVO.datesetting.period.start.m-1, itlDataVO.datesetting.period.start.d).dateFormat("Ymd"),
                						L_END_DATE    : new Date(itlDataVO.datesetting.period.end.y  , itlDataVO.datesetting.period.end.m-1  , itlDataVO.datesetting.period.end.d).dateFormat("Ymd")
                					};
            					UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);

            	    				setTimeout(function () {
            	                       	if(!page.isWriteable()) {
            	               				$(".k-grid-delete").addClass("k-state-disabled");
            	               				$(".k-grid-delete").click(stopEvent);
            	               				$(".k-grid-연동체크").addClass("k-state-disabled");
            	               				$(".k-grid-연동체크").click(stopEvent);
            	               			}
            	                    });
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
                			itlDataVO.dataTotal = data.length;
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
								    NO_C:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        NO_MRK:		       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        NO_MNGMRK:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        DC_MRKID:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        CD_ITLWAY:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        JOB:	   		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        STATUS:	   		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        RESULT:	   	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        RESERVED_DATE:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        START_DATE:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        END_DATE:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        UPDATED:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
							        				   
	                			}
	                		}
	                	}
                	}), 
                	change : rowClick,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: itlDataVO.columnProc,
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#itl-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#itl-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 302                 	
        		};
                
              //검색 그리드
                var gridOrdVO = $scope.gridOrdVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                		},
                		change: function(e){
                			var data = this.data();
                			itlDataVO.dataTotal = data.length;
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
            						orderNo:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        productOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        mallOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        paymentNo:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        definiteOrderDate: {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        process_result:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        req_datetime:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        result_msg:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
	                			}
	                		}
	                	}
                	}), 
                	change : rowClick,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: [
              		           {field: "ROW_NUM", title: "번호", type: "string" , width: "15px", textAlign: "center"},
              		           {field: "orderNo", title: "주문번호", type: "string" , width: "70px", textAlign: "center"},
	              		       {field: "productOrderNo", title: "상품주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "mallOrderNo", title: "마켓주문번호", type: "string" , width: "70px", textAlign: "center"},
	              		       {field: "paymentNo", title: "결재번호", type: "string" , width: "30px", textAlign: "center"},
	              		       {field: "definiteOrderDate", title: "주문확정일시", type: "string" , width: "70px", textAlign: "center"},
	              		       {field: "process_result", title: "처리상태", type: "string" , width: "25px", textAlign: "center"},
	              		       {field: "req_datetime", title: "처리일시", type: "string" , width: "70px", textAlign: "center"},
	              		       {field: "result_msg", title: "결과메시지", type: "string" , width: "100px", textAlign: "center"}
                       	],
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#ord-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#ord-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 302   	
        		};
                
                //검색 그리드
                var gridTranVO = $scope.gridTranVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
            						orderNo:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        productOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        mallOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        paymentNo:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        deliveryDivision:  {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        delivery_type:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        invoiceNo:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        invoiceInsertedDate:{
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        process_result:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        req_datetime:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        result_msg:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
	                			}
	                		}
	                	}
                	}), 
                	change : rowClick,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: [
             		           {field: "ROW_NUM", title: "번호", type: "string" , width: "60px", textAlign: "center"},
             		           {field: "orderNo", title: "주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "productOrderNo", title: "상품주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "mallOrderNo", title: "마켓주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "paymentNo", title: "결재번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "deliveryDivision", title: "배송구분", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "delivery_type", title: "택배사", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "invoiceNo", title: "송장번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "invoiceInsertedDate", title: "요청일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "process_result", title: "처리상태", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "req_datetime", title: "처리일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "result_msg", title: "처리결과 메시지", type: "string" , width: "60px", textAlign: "center"}
	              		
                      	],
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#tran-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#tran-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 302                 	
        		};
                
                //검색 그리드
                var gridCanVO = $scope.gridCanVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                		},
                		change: function(e){
                			var data = this.data();
                			itlDataVO.dataTotal = data.length;
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
            						requesteNo:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        claimType:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        requestDate:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        product_order_no:  {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        mallOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        payment_no:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        permission_date:   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        permission_person: {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        rejection_type:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        rejection_reason:  {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        process_result:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        req_datetime:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        result_msg:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        deliveryDivision:  {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        delivery_type:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        invoiceNo:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        pickupStatue:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
							        				   
	                			}
	                		}
	                	}
                	}), 
                	change : rowClick,
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: [
            		           {field: "ROW_NUM", title: "번호", type: "string" , width: "60px", textAlign: "center"},
            		           {field: "requesteNo", title: "요청번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "claimType", title: "요청유형", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "requestDate", title: "요청일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "product_order_no", title: "상품주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "mallOrderNo", title: "마켓주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "payment_no", title: "결재번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "permission_date", title: "승인/거부일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "permission_person", title: "승인/거부 입력자", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "rejection_type", title: "거부구분", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "rejection_reason", title: "거부내용", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "process_result", title: "처리상태", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "req_datetime", title: "처리일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "result_msg", title: "처리결과 메시지", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "deliveryDivision", title: "배송구분", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "delivery_type", title: "택배사명", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "invoiceNo", title: "송장번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "pickupStatue", title: "교환상품수거여부", type: "string" , width: "60px", textAlign: "center"}
                     	],
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#can-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#can-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 302                 	
        		};
                
                //검색 그리드
                var gridCsVO = $scope.gridCsVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    },
                    sortable: true,                    	
                    pageable: {
                       	messages: UtilSvc.gridPageableMessages
                    },
                    noRecords: true,
                    dataSource: new kendo.data.DataSource({
                    	transport: {
                		},
                		change: function(e){
                			var data = this.data();
                			itlDataVO.dataTotal = data.length;
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM: 		   {	
				                    						type: "number", 
															editable: false,  
															nullable: false
            										   },
            						inquiryStatueCode: {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        regDate:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        req_person:		   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        inquiryDivisionCode:{
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        mallItemCode:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        		           },
							        mallOrderNo:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },      
							        inquiryNo:	   	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },       
							        replyContents:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }, 
							        replyDate:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        replyPerson:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        process_result:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        process_date:	   {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   },
							        result_msg:	       {
													    	type: "string", 
															editable: false,  
															nullable: false
							        				   }
							        				   
	                			}
	                		}
	                	}
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: [
           		           	   {field: "ROW_NUM", title: "번호", type: "string" , width: "60px", textAlign: "center"},
           		           	   {field: "inquiryStatueCode", title: "요청번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "regDate", title: "요청유형", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "req_person", title: "요청일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "inquiryDivisionCode", title: "상품주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "mallItemCode", title: "마켓주문번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "mallOrderNo", title: "결재번호", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "inquiryNo", title: "승인/거부일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "replyContents", title: "승인/거부 입력자", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "replyDate", title: "거부구분", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "replyPerson", title: "거부내용", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "process_result", title: "처리상태", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "process_date", title: "처리일시", type: "string" , width: "60px", textAlign: "center"},
	              		       {field: "result_msg", title: "처리결과 메시지", type: "string" , width: "60px", textAlign: "center"}
                    	],
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	rowTemplate: kendo.template($.trim(angular.element(document.querySelector("#cs-template")).html())),
                	altRowTemplate: kendo.template($.trim(angular.element(document.querySelector("#cs-template")).html()).replace("class=\"k-grid-row\"","class=\"k-alt\"")),
                	height: 302                 	
        		};
                
                //done
                function getCheckedItems(treeview, obj) {
                    var nodes = treeview.dataSource.data();
                    return getCheckedNodes(nodes, obj);
                };
                
                //done
                function getCheckedNodes(nodes, obj) {
                    var node, childCheckedNodes;
                    var checkedNodes = [];
                    
                    obj.searchTotal = nodes.length;
                    
                    for (var i = 0; i < obj.searchTotal; i++) {
                        node = nodes[i];
                        if (node.checked) {
                            checkedNodes.push(node);
                        }                        
                        if (node.hasChildren) {
                            childCheckedNodes = getCheckedNodes(node.children.data());
                            if (childCheckedNodes.length > 0) {
                                checkedNodes = checkedNodes.concat(childCheckedNodes);
                            };
                        };
                    }
                    return checkedNodes;
                };                
                //done
                function filter(dataSource, query, viewGrdCnt) {
                    var hasVisibleChildren = false;
                    var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
                    
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var text = item.NM.toLowerCase(); //유기적으로 변하는 값
                        var itemVisible =
                            query === true // parent already matches
                            || query === "" // query is empty
                            || text.indexOf(query) >= 0; // item text matches query

                        var anyVisibleChildren = filter(item.children, itemVisible || query, viewGrdCnt); // pass true if parent matches

                        hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

                        item.hidden = !itemVisible && !anyVisibleChildren;
                    }
                    if (data) {
                        // re-apply filter on children
                        dataSource.filter({ field: "hidden", operator: "neq", value: true });
                    }                              
                    return hasVisibleChildren;
               };               
               //done
               function populateMultiSelect(checkedNodes, id) {
                   var multiSelect = angular.element(document.querySelector(id)).data("kendoMultiSelect");                   
                   multiSelect.dataSource.data([]);
                   
                   var multiData = multiSelect.dataSource.data();                   
                  
                   if(checkedNodes.length > 0) {
                       var array = multiSelect.value().slice();
                       for (var i = 0; i < checkedNodes.length; i++) {
                    	   var strNM = checkedNodes[i].NM.split("-");
                           multiData.push({ NM: strNM[0], NO_C: checkedNodes[i].NO_C});
                           array.push(checkedNodes[i].NO_C.toString());
                       }
                       multiSelect.dataSource.data(multiData);
                       multiSelect.dataSource.filter({});
                       multiSelect.value(array);
                       multiSelect.trigger("change");
                   };
               };           	   
                                             
               $timeout(function () {
            	   if(!page.isWriteable()) {            		   
            		   $(".k-grid-add").addClass("k-state-disabled");
            		   $(".k-grid-delete").addClass("k-state-disabled");
       				   $(".k-grid-add").click(itlDataVO.stopEvent);
       				   $(".k-grid-delete").click(itlDataVO.stopEvent);
       			   };

            	   itlDataVO.inQuiry();
               });
               
            }]);
}());