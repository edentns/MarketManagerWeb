(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("ma.Itl.controller")
        .controller("ma.ItlCtrl", ["$window", "$scope", "$http", "$q", "$log", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $http, $q, $log, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            grdScmSelectAttr = {type: "string", editable: false, nullable: false};
	            
	            var itlDataVO = $scope.itlDataVO = {
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
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		},
                    mngMrkModel : resData.mngMrkModel, //마켓명 모델
                    mngMrkBind  : resData.mngMrkBind,  //마켓명 옵션
                    nmJobModel  : resData.nmJobModel,  //작업명 모델
                    nmJobBind   : resData.nmJobBind,   //작업명 옵션                    
                    stJobModel  : resData.stJobModel,   //작업상태 모델
                    stJobBind   : resData.stJobBind,  //작업상태 옵션
		        };
                var iNumWidth = "50px",
                    iDateTimeWidth = "140px",
                    iNullWidth = "0px";
                
	            var gridBatchLog = [
	                    {field: "ROW_NUM"      , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},
						{field: "NO_C"         , width: "80px"  , attributes: {class:"ta-c"}, title: "가입자번호"},           		            
						{field: "NM_MRK"       , width: "120px" , attributes: {class:"ta-l"}, title: "마켓명"},   
						{field: "NM_MNGMRK"    , width: "120px" , attributes: {class:"ta-l"}, title: "관리마켓명"},
						{field: "DC_MRKID"     , width: "120px" , attributes: {class:"ta-l"}, title: "마켓ID"},
						{field: "NM_JOB"       , width: "140px" , attributes: {class:"ta-l"}, title: "작업명"},
						{field: "NM_STATUS"    , width: "70px"  , attributes: {class:"ta-c"}, title: "작업상태"},
						{field: "RESULT"       , width: iNullWidth ,
						 attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"},
						{field: "RESERVED_DATE", width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "예약시간"},
						{field: "START_DATE"   , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "시작일시"},
						{field: "END_DATE"     , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "종료일시"},
						{field: "PROG_DIFF"    , width: "70px", attributes: {class:"ta-c"}, title: "진행시간"}
					],
		            gridOrderConfirm = [
						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},       		            
						{field: "info_type"        , width: "70px"  , attributes: {class:"ta-l"}, title: "정보유형"},   
						{field: "orderNo"          , width: "130px" , attributes: {class:"ta-c"}, title: "주문번호"},           		            
						{field: "productOrderNo"   , width: "130px" , attributes: {class:"ta-l"}, title: "상품주문번호"},   
						{field: "mallOrderNo"      , width: "130px" , attributes: {class:"ta-l"}, title: "마켓주문번호"},
						{field: "paymentNo"        , width: "120px" , attributes: {class:"ta-l"}, title: "결재번호"},
						{field: "definiteOrderDate", width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "주문확정일시"},
						{field: "process_result"   , width: "70px"  , attributes: {class:"ta-c"}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "처리일시"},
						{field: "result_msg"       , width: iNullWidth,
						 attributes: {class:"ta-l" , style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"}
					],
  		            gridInvoiceNo = [
						{field: "ROW_NUM" 		     , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},       		            
						{field: "info_type"          , width: "70px"  , attributes: {class:"ta-l"}, title: "정보유형"},   
						{field: "orderNo"            , width: "130px" , attributes: {class:"ta-c"}, title: "주문번호"},           		            
						{field: "productOrderNo"     , width: "130px" , attributes: {class:"ta-l"}, title: "상품주문번호"},   
						{field: "mallOrderNo"        , width: "130px" , attributes: {class:"ta-l"}, title: "마켓주문번호"},
						{field: "paymentNo"          , width: "120px" , attributes: {class:"ta-l"}, title: "결재번호"},
						{field: "deliveryDivision"   , width: "120px" , attributes: {class:"ta-l"}, title: "배송구분"},
						{field: "delivery_type"      , width: "120px" , attributes: {class:"ta-l"}, title: "택배사"},
						{field: "invoiceNo"          , width: "120px" , attributes: {class:"ta-l"}, title: "송장번호"},
						{field: "invoiceInsertedDate", width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "요청일시"},
						{field: "process_result"     , width: "70px"  , attributes: {class:"ta-c"}, title: "처리상태"},
						{field: "req_datetime"       , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "처리일시"},
						{field: "result_msg"         , width: iNullWidth,
						 attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"}
					],
		            gridClaimConfirm = [
						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},
						{field: "requesteNo"       , width: "130px" , attributes: {class:"ta-c"}, title: "요청번호"},           		            
						{field: "claimType"        , width: "120px" , attributes: {class:"ta-l"}, title: "요청유형"},   
						{field: "requestDate"      , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "요청일시"},
						{field: "product_order_no" , width: "130px" , attributes: {class:"ta-l"}, title: "상품주문번호"},
						{field: "mallOrderNo"      , width: "130px" , attributes: {class:"ta-l"}, title: "마켓주문번호"},
						{field: "payment_no"       , width: "120px" , attributes: {class:"ta-l"}, title: "결재번호"},
						{field: "permission_date"  , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "승인/거부일시"},
						{field: "permission_person", width: "120px" , attributes: {class:"ta-c"}, title: "승인/거부 입력자"},
						{field: "rejection_type"   , width: "120px" , attributes: {class:"ta-c"}, title: "거부구분"},
						{field: "rejection_reason" , width: "120px" , 
							 attributes: {class:"ta-l" , style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "거부내용"},
						{field: "process_result"   , width: "120px" , attributes: {class:"ta-l"}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth , attributes: {class:"ta-c"}, title: "처리일시"},
						{field: "result_msg", width: iNullWidth,
						 attributes: {class:"ta-l" , style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"},
						{field: "deliveryDivision" , width: "100px"  , attributes: {class:"ta-c"}, title: "배송구분"},
						{field: "delivery_type"    , width: "70px"  , attributes: {class:"ta-c"}, title: "택배사명"},
						{field: "invoiceNo"        , width: "120px" , attributes: {class:"ta-l"}, title: "송장번호"},
						{field: "pickupStatue"     , width: "120px" , attributes: {class:"ta-c"}, title: "교환상품수거여부"}
					],
		            gridInquiryProcess = [
						{field: "ROW_NUM" 		     , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},
						{field: "inquiryNo"          , width: "130px" , attributes: {class:"ta-l"}, title: "문의번호"},
						{field: "inquiryDivisionCode", width: "70px" , attributes: {class:"ta-l"}, title: "문의유형"},,
						{field: "inquiryStatueCode"  , width: "80px" , attributes: {class:"ta-c"}, title: "문의상태명"},           		            
						{field: "regDate"            , width: iDateTimeWidth , attributes: {class:"ta-c"}, title: "접수일시"},   
						{field: "req_person"         , width: "70px" , attributes: {class:"ta-c"}, title: "접수자"},
						{field: "mallOrderNo"        , width: "130px" , attributes: {class:"ta-l"}, title: "주문번호"},
						{field: "mallItemCode"       , width: "130px" , attributes: {class:"ta-l"}, title: "상품번호"},
						{field: "replyContents"      , width: "150px" , 
						 attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "답변내용"},
						{field: "replyDate"          , width: iDateTimeWidth  , attributes: {class:"ta-c"}, title: "답변날짜"},
						{field: "replyPerson"        , width: "70px" , attributes: {class:"ta-c"}, title: "답변자"},
						{field: "process_result"     , width: "120px" , attributes: {class:"ta-c"}, title: "처리구분"},
						{field: "process_date"       , width: iDateTimeWidth , attributes: {class:"ta-c"}, title: "처리일시"},
						{field: "result_msg"         , width: iNullWidth,
						 attributes: {class:"ta-l", style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"}
					],
		            gridShippingManagement = [
  						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"}, 
  						{field: "mall_no"          , width: "80px"  , attributes: {class:"ta-l"}, title: "쇼핑몰구분"},
						{field: "info_type"        , width: "65px"  , attributes: {class:"ta-l"}, title: "정보유형"},   
						{field: "orderNo"          , width: "128px" , attributes: {class:"ta-c"}, title: "주문번호"},
						{field: "mallOrderNo"      , width: "88px" , attributes: {class:"ta-l"}, title: "마켓주문번호"},
						{field: "mallItemNo"       , width: "128px" , attributes: {class:"ta-l"}, title: "마켓상품번호"},
						{field: "paymentNo"        , width: "80px" , attributes: {class:"ta-l"}, title: "결재번호"},
						{field: "deliveryDivision" , width: "85px"  , attributes: {class:"ta-c"}, title: "배송구분"},
						{field: "delivery_type"    , width: "70px"  , attributes: {class:"ta-c"}, title: "택배사명"},
						{field: "invoiceNo"        , width: "80px" , attributes: {class:"ta-l"}, title: "송장번호"},
						{field: "updatedDeliveryDivision"  , width: "80px" , attributes: {class:"ta-l"}, title: "수정할배송구분"},
						{field: "updatedDeliveryType"      , width: "80px" , attributes: {class:"ta-l"}, title: "수정할택배사명"},
						{field: "updatedInvoiceNo"         , width: "80px" , attributes: {class:"ta-l"}, title: "수정할송장번호"},
						{field: "process_result"   , width: "65px"  , attributes: {class:"ta-c"}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth, attributes: {class:"ta-c"}, title: "처리일시"},
						{field: "result_msg"       , width: iNullWidth,
						 attributes: {class:"ta-l" , style:"text-overflow: ellipsis; white-space: nowrap; overflow:hidden;"}, title: "결과메시지"}
					];
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            itlDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            	
	            //초기 실행
	            itlDataVO.search = function(){
	            	var me = this; 
	            	me.param = {
						procedureParam: "USP_MA_07ITL_SEARCH&L_LIST01@s|L_LIST02@s|L_LIST03@s|L_START_DATE@s|L_END_DATE@s",
						L_LIST01      : itlDataVO.mngMrkModel,
						L_LIST02      : itlDataVO.nmJobModel,
						L_LIST03      : itlDataVO.stJobModel,
						L_START_DATE  : new Date(itlDataVO.datesetting.period.start.y, itlDataVO.datesetting.period.start.m-1, itlDataVO.datesetting.period.start.d).dateFormat("Ymd"),
						L_END_DATE    : new Date(itlDataVO.datesetting.period.end.y  , itlDataVO.datesetting.period.end.m-1  , itlDataVO.datesetting.period.end.d).dateFormat("Ymd"),
						L_LIST01_SELECT_INDEX : itlDataVO.mngMrkBind.allSelectNames,
						L_LIST02_SELECT_INDEX : itlDataVO.nmJobBind.allSelectNames,
						L_LIST03_SELECT_INDEX : itlDataVO.stJobBind.allSelectNames,
						PERIOD: UtilSvc.grid.getDateSetting(itlDataVO.datesetting)
					};
	            	
	            	$scope.itlkg.dataSource.data([]);
	            	$scope.itlkg.dataSource.page(1);
        			UtilSvc.grid.setInquiryParam(me.param);
	            };	
	            	  
	            //open
	            itlDataVO.isOpen = function(val){
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90 - 370;
	            	var pageSizeValue = val? 8 : 12;
	            	var gridObj = [$scope.ordkg, $scope.trankg, $scope.cankg, $scope.cskg, $scope.shikg];
	            	//var gridTabObj = [$scope.gridOrdVO, $scope.gridTranVO, $scope.gridCanVO, $scope.gridCsVO, $scope.gridShiVO];

            		gridObj.forEach(function (currentObject, index) {
            			if(currentObject.dataSource.data().length){
            				currentObject.dataSource.pageSize(pageSizeValue);
            			}
	            		currentObject.wrapper.height(settingHeight);
	            		currentObject.resize();
	            	});
            		
            		/*gridTabObj.forEach(function (currentObject, index) {
            			currentObject.dataSource.pageSize(pageSizeValue);            				            		
	            	});*/
	            };	
	            
				//각 컬럼에 header 정보 넣어줌, 공통 모듈이 2줄 위주로 작성 되어 있기 떄문에  일부러 일케 했음 
				itlDataVO.columnProc = function(tpl){
					if(tpl === undefined) return;
            		var extTplHeaderAttr = {headerAttributes : {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
            			returnTpl = [];
            			
        				for(var i=0; i<tpl.length; i++){
        					var temp = angular.extend(extTplHeaderAttr, tpl[i]);
        					returnTpl.push(angular.copy(temp));
            			};
            			return returnTpl;
            	};				
					                            
	            //검색 그리드
                var gridItlVO = $scope.gridItlVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
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
            					UtilSvc.getList(itlDataVO.param).then(function (res) {
            						if(res.data.results[0].length === 0) {
            							$scope.ordkg.dataSource.data(res.data.results[0]);
            							$scope.trankg.dataSource.data(res.data.results[0]);
            							$scope.cankg.dataSource.data(res.data.results[0]);
            							$scope.cskg.dataSource.data(res.data.results[0]);
            							$scope.shikg.dataSource.data(res.data.results[0]);
            						}
            						e.success(res.data.results[0]);
            					});
                			},  		
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                       	pageSize: 8,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: {
                					ROW_NUM  :{type: "number", editable: false, nullable: false},
								    NO_C     :grdScmSelectAttr,
							        NO_MRK   :grdScmSelectAttr,
							        NM_MRK   :grdScmSelectAttr,
							        NO_MNGMRK:grdScmSelectAttr,
							        NM_MNGMRK:grdScmSelectAttr,
							        DC_MRKID :grdScmSelectAttr,
							        CD_ITLWAY:grdScmSelectAttr,
							        JOB      :grdScmSelectAttr, 
							        NM_JOB   :grdScmSelectAttr,     
							        STATUS   :grdScmSelectAttr,     
							        NM_STATUS:grdScmSelectAttr,        
							        RESULT   :grdScmSelectAttr, 
							        RESERVED_DATE:grdScmSelectAttr,
							        START_DATE   :grdScmSelectAttr,
							        END_DATE     :grdScmSelectAttr,
							        UPDATED      :grdScmSelectAttr
	                			}
	                		}
	                	}
                	}), 
                	change : function(e) {
                		var dataItem = this.dataItem(this.select());
                		var param = {
        					procedureParam: "USP_MA_07ITL_CLICK_GET&L_RESERVED_DATE@s|L_NO_MRK@s|L_SEL_NO_C@s",
        					L_RESERVED_DATE : dataItem.RESERVED_DATE,
        					L_NO_MRK : dataItem.NO_MRK,
        					L_SEL_NO_C : dataItem.NO_C
        				};
    					UtilSvc.getList(param).then(function (res) {
    						$scope.ordkg.dataSource.data(res.data.results[0]);
    						$scope.trankg.dataSource.data(res.data.results[1]);
    						$scope.cankg.dataSource.data(res.data.results[2]);
    						$scope.cskg.dataSource.data(res.data.results[3]);
    						$scope.shikg.dataSource.data(res.data.results[4]);
    					});
                	},
                	dataBound: function(e) {
                		e.sender.select("tr:eq(0)");
                	},
                	selectable: "row",
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	columns: itlDataVO.columnProc(gridBatchLog),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
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
                					ROW_NUM          :{type: "number", editable: false, nullable: false},
            						orderNo          :grdScmSelectAttr,
							        productOrderNo   :grdScmSelectAttr,
							        mallOrderNo      :grdScmSelectAttr,
							        paymentNo        :grdScmSelectAttr,
							        definiteOrderDate:grdScmSelectAttr,
							        process_result   :grdScmSelectAttr,      
							        req_datetime     :grdScmSelectAttr,       
							        result_msg       :grdScmSelectAttr
	                			}
	                		}
	                	}
                	}), 
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	selectable: "multiple",
                	columns: itlDataVO.columnProc(gridOrderConfirm),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 285   	
        		};
                
                //검색 그리드
                var gridTranVO = $scope.gridTranVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
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
                					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
            						orderNo:		   grdScmSelectAttr,
							        productOrderNo:	   grdScmSelectAttr,
							        mallOrderNo:	   grdScmSelectAttr,
							        paymentNo:		   grdScmSelectAttr,
							        deliveryDivision:  grdScmSelectAttr,
							        delivery_type:	   grdScmSelectAttr,      
							        invoiceNo:	   	   grdScmSelectAttr,       
							        invoiceInsertedDate:grdScmSelectAttr, 
							        process_result:	   grdScmSelectAttr,
							        req_datetime:	   grdScmSelectAttr,
							        result_msg:	   	   grdScmSelectAttr
	                			}
	                		}
	                	}
                	}), 
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	columns: itlDataVO.columnProc(gridInvoiceNo),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 285                 	
        		};
                
                //검색 그리드
                var gridCanVO = $scope.gridCanVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
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
                					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
            						requesteNo:		   grdScmSelectAttr,
							        claimType:		   grdScmSelectAttr,
							        requestDate:	   grdScmSelectAttr,
							        product_order_no:  grdScmSelectAttr,
							        mallOrderNo:	   grdScmSelectAttr,
							        payment_no:	   	   grdScmSelectAttr,      
							        permission_date:   grdScmSelectAttr,       
							        permission_person: grdScmSelectAttr, 
							        rejection_type:	   grdScmSelectAttr,
							        rejection_reason:  grdScmSelectAttr,
							        process_result:	   grdScmSelectAttr,
							        req_datetime:	   grdScmSelectAttr,
							        result_msg:	       grdScmSelectAttr,
							        deliveryDivision:  grdScmSelectAttr,
							        delivery_type:	   grdScmSelectAttr,
							        invoiceNo:	       grdScmSelectAttr,
							        pickupStatue:	   grdScmSelectAttr
							        				   
	                			}
	                		}
	                	}
                	}), 
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	columns: itlDataVO.columnProc(gridClaimConfirm),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 285                 	
        		};
                
                //검색 그리드
                var gridCsVO = $scope.gridCsVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
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
                					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
            						inquiryStatueCode: grdScmSelectAttr,
							        regDate:		   grdScmSelectAttr,
							        req_person:		   grdScmSelectAttr,
							        inquiryDivisionCode:grdScmSelectAttr,
							        mallItemCode:	   grdScmSelectAttr,
							        mallOrderNo:	   grdScmSelectAttr,      
							        inquiryNo:	   	   grdScmSelectAttr,       
							        replyContents:	   grdScmSelectAttr, 
							        replyDate:	       grdScmSelectAttr,
							        replyPerson:	   grdScmSelectAttr,
							        process_result:	   grdScmSelectAttr,
							        process_date:	   grdScmSelectAttr,
							        result_msg:	       grdScmSelectAttr
	                			}
	                		}
	                	}
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	columns: itlDataVO.columnProc(gridInquiryProcess),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 285                 	
        		};   
                
                //검색 그리드
                var gridShiVO = $scope.gridShiVO = {
                	autoBind: false,
                    messages: {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
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
                					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
                					mall_no:           grdScmSelectAttr,
                					info_type:		   grdScmSelectAttr,
                					orderNo:		   grdScmSelectAttr,
                					mallOrderNo:       grdScmSelectAttr,
                					mallItemNo:	       grdScmSelectAttr,
                					paymentNo:	       grdScmSelectAttr,      
                					deliveryDivision:  grdScmSelectAttr,       
                					delivery_type:	   grdScmSelectAttr, 
                					invoiceNo:	       grdScmSelectAttr,
                					updatedDeliveryDivision:  grdScmSelectAttr,
                					updatedDeliveryType:	  grdScmSelectAttr,
                					updatedInvoiceNo:	      grdScmSelectAttr,
                					process_result:	   grdScmSelectAttr,
                					req_datetime:	   grdScmSelectAttr,
                					result_msg:	       grdScmSelectAttr
	                			}
	                		}
	                	}
                	}),
                	navigatable: true, //키보드로 그리드 셀 이동 가능
                	columns: itlDataVO.columnProc(gridShippingManagement),
                    collapse: function(e) {
                        this.cancelRow();
                    },
                	resizable: true,
                	height: 285                 	
        		};
                
                $timeout(function () {
                	itlDataVO.search();
                	itlDataVO.isOpen(false);
                });
            }]);
}());