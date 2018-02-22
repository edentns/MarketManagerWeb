(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name ma.Qa.controller : ma.QaCtrl
     * QA 관리
     */
    angular.module("sy.Itl.controller")
        .controller("sy.ItlCtrl", ["$window", "$scope", "$http", "$q", "$log", "ma.QaSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", "Util01maSvc", "APP_SA_MODEL", 
            function ($window, $scope, $http, $q, $log, MaQaSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc, Util01maSvc, APP_SA_MODEL) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            grdScmSelectAttr = {type: "string", editable: false, nullable: false};
	            
	            var itlDataVO = $scope.itlDataVO = {
	            	userInfo : JSON.parse($window.localStorage.getItem("USER")),
	            	boxTitle : "검색",
	            	settingMrk : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2,
	        		},
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 3
	        		},
	            	datesetting : {
	        			dateType   : 'market',
						buttonList : ['current', '1Day', '1Week', '1Month', 'range'],
						selected   : resData.selectDate.selected,
						period : {
							start : resData.selectDate.start,
							end   : resData.selectDate.end
						}
	        		},
                    mngMrkModel : resData.mngMrkModel,                  //마켓명 모델
                    mngMrkBind  : resData.mngMrkData,                   //마켓명 옵션                    
                    stJobModel  : resData.stJobModel,                   //작업상태 모델
                    stJobBind   : resData.stJobData                     //작업상태 옵션
		        };
	            
	            itlDataVO.reset = function() {
	            	var self = this;
	            	self.datesetting.period.start = angular.copy(edt.getToday());
	            	self.datesetting.period.end   = angular.copy(edt.getToday());
	            	self.datesetting.selected = '1Week';
	            	
	            	self.mngMrkBind.bReset = true;                    
	            	self.stJobBind.bReset = true;
	            };
	            
	            itlDataVO.init = function() {
		            angular.forEach($scope.gridMidVO, function (gridMidLocalVO, iIndex) {
		            	gridMidLocalVO = $scope.gridMidVO.addCommonGridVO(gridMidLocalVO, iIndex);
	                });
		            
		            angular.forEach($scope.gridTabVO, function (gridTabLocalVO, iIndex) {
		            	gridTabLocalVO = $scope.gridTabVO.addCommonGridVO(gridTabLocalVO, iIndex);
	                });
		            
		            itlDataVO.search();
	            };
	            
                var iNumWidth = "50px",
                    iDateTimeWidth = "140px",
                    iNullWidth = "0px";
                var sEllipsis = "text-overflow: ellipsis; white-space: nowrap; overflow:hidden;";
                
	            var gridItlFailMrk = [
						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},       		            
						{field: "DTS_FAIL"         , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "실패일시"},   
						{field: "NM_MRK"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"}
					],gridItl01 = [
						{field: "DC_PROC" 		   , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "처리사항"},       		            
						{field: "CNT_SCD"          , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "예정"},   
						{field: "CNT_CPLT"         , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "완료"},   
						{field: "CNT_ERR"          , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "추후 재실행"}
					],gridItl02 = [
						{field: "DC_PROC" 		   , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "처리사항"},       		            
						{field: "CNT_SCD"          , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "예정"},   
						{field: "CNT_CPLT"         , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "완료"},   
						{field: "CNT_ERR"          , width: "120px" , attributes: {class:"ta-r", style:sEllipsis}, title: "추후 재실행"}
					],gridOrderConfirm = [
						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},        		            
						{field: "NM_MNGMRK"        , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "관리마켓명"},      		            
						{field: "NM_MRK"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"},   
						{field: "DC_MRKID"         , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓아이디"},    
						{field: "process_result"   , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "처리일시"},       		     		            
						{field: "info_type"        , width: "70px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "정보유형"},   
						{field: "orderNo"          , width: "130px" , attributes: {class:"ta-c", style:sEllipsis}, title: "주문번호"},           		            
						{field: "productOrderNo"   , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "상품주문번호"},   
						{field: "mallOrderNo"      , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓주문번호"},
						{field: "paymentNo"        , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "결재번호"},
						{field: "definiteOrderDate", width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "주문확정일시"},
						{field: "DC_TEMP"          , width: iNullWidth, attributes: {class:"ta-c", style:sEllipsis}, title: " "}
					],
  		            gridInvoiceNo = [
						{field: "ROW_NUM" 		     , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},       		            
						{field: "NM_MNGMRK"          , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "관리마켓명"},      		            
						{field: "NM_MRK"             , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"},   
						{field: "DC_MRKID"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓아이디"},  
						{field: "process_result"     , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "처리상태"},
						{field: "req_datetime"       , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "처리일시"},         		     		            
						{field: "info_type"          , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "정보유형"},   
						{field: "orderNo"            , width: "130px" , attributes: {class:"ta-c", style:sEllipsis}, title: "주문번호"},           		            
						{field: "productOrderNo"     , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "상품주문번호"},   
						{field: "mallOrderNo"        , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓주문번호"},
						{field: "paymentNo"          , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "결재번호"},
						{field: "deliveryDivision"   , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "배송구분"},
						{field: "delivery_type"      , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "택배사"},
						{field: "invoiceNo"          , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "송장번호"},
						{field: "invoiceInsertedDate", width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "요청일시"},
						{field: "DC_TEMP"          , width: iNullWidth, attributes: {class:"ta-c", style:sEllipsis}, title: " "}
					],
		            gridClaimConfirm = [
						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},    		            
						{field: "NM_MNGMRK"        , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "관리마켓명"},     		            
						{field: "NM_MRK"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"},   
						{field: "DC_MRKID"         , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓아이디"}, 
						{field: "process_result"   , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth , attributes: {class:"ta-c", style:sEllipsis}, title: "처리일시"},         		     		            
						{field: "info_type"        , width: "70px" , attributes: {class:"ta-c", style:sEllipsis}, title: "정보유형"},             		
						{field: "requesteNo"       , width: "130px" , attributes: {class:"ta-c", style:sEllipsis}, title: "요청번호"},           		            
						{field: "claimType"        , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "요청유형"},   
						{field: "requestDate"      , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "요청일시"},
						{field: "product_order_no" , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "상품주문번호"},
						{field: "mallOrderNo"      , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓주문번호"},
						{field: "payment_no"       , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "결재번호"},
						{field: "permission_date"  , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "승인/거부일시"},
						{field: "permission_person", width: "100px" , attributes: {class:"ta-c", style:sEllipsis}, title: "승인/거부 입력자"},
						{field: "rejection_type"   , width: "120px" , attributes: {class:"ta-c", style:sEllipsis}, title: "거부구분"},
						{field: "rejection_reason" , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "거부내용"},
						{field: "deliveryDivision" , width: "100px" , attributes: {class:"ta-c", style:sEllipsis}, title: "배송구분"},
						{field: "delivery_type"    , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "택배사명"},
						{field: "invoiceNo"        , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "송장번호"},
						{field: "pickupStatue"     , width: "110px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "교환상품수거여부"},
						{field: "DC_TEMP"          , width: iNullWidth, attributes: {class:"ta-c", style:sEllipsis}, title: " "}
					],
		            gridInquiryProcess = [
						{field: "ROW_NUM" 		     , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},     		            
						{field: "NM_MNGMRK"          , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "관리마켓명"},     		            
						{field: "NM_MRK"             , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"},   
						{field: "DC_MRKID"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓아이디"},  
						{field: "process_result"     , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "처리상태"},
						{field: "process_date"       , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "처리일시"},         		
						{field: "inquiryNo"          , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "문의번호"},
						{field: "inquiryDivisionCode", width: "70px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "문의유형"},,
						{field: "inquiryStatueCode"  , width: "80px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "문의상태명"},           		            
						{field: "regDate"            , width: iDateTimeWidth , attributes: {class:"ta-c", style:sEllipsis}, title: "접수일시"},   
						{field: "req_person"         , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "접수자"},
						{field: "mallOrderNo"        , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "주문번호"},
						{field: "mallItemCode"       , width: "130px" , attributes: {class:"ta-l", style:sEllipsis}, title: "상품번호"},
						{field: "replyContents"      , width: "150px" , attributes: {class:"ta-l", style:sEllipsis}, title: "답변내용"},
						{field: "replyDate"          , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "답변날짜"},
						{field: "replyPerson"        , width: "70px"        , attributes: {class:"ta-c", style:sEllipsis}, title: "답변자"},
						{field: "DC_TEMP"          , width: iNullWidth, attributes: {class:"ta-c", style:sEllipsis}, title: " "}
					],
		            gridShippingManagement = [
  						{field: "ROW_NUM" 		   , type : "number", width: iNumWidth, attributes: {class:"ta-r"}, title: "번호"},      		            
						{field: "NM_MNGMRK"        , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "관리마켓명"},      		            
						{field: "NM_MRK"           , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓명"},   
						{field: "DC_MRKID"         , width: "120px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓아이디"},   
						{field: "process_result"   , width: "65px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "처리상태"},
						{field: "req_datetime"     , width: iDateTimeWidth, attributes: {class:"ta-c", style:sEllipsis}, title: "처리일시"},        		
  						{field: "mall_no"          , width: "80px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "쇼핑몰구분"},
						{field: "info_type"        , width: "65px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "정보유형"},   
						{field: "orderNo"          , width: "128px" , attributes: {class:"ta-c", style:sEllipsis}, title: "주문번호"},
						{field: "mallOrderNo"      , width: "88px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓주문번호"},
						{field: "mallItemNo"       , width: "128px" , attributes: {class:"ta-l", style:sEllipsis}, title: "마켓상품번호"},
						{field: "paymentNo"        , width: "80px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "결재번호"},
						{field: "deliveryDivision" , width: "85px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "배송구분"},
						{field: "delivery_type"    , width: "70px"  , attributes: {class:"ta-c", style:sEllipsis}, title: "택배사명"},
						{field: "invoiceNo"        , width: "80px"  , attributes: {class:"ta-l", style:sEllipsis}, title: "송장번호"},
						{field: "updatedDeliveryDivision", width: "80px", attributes: {class:"ta-l", style:sEllipsis}, title: "수정할배송구분"},
						{field: "updatedDeliveryType"    , width: "80px", attributes: {class:"ta-l", style:sEllipsis}, title: "수정할택배사명"},
						{field: "updatedInvoiceNo"       , width: "80px", attributes: {class:"ta-l", style:sEllipsis}, title: "수정할송장번호"},
						{field: "DC_TEMP"          , width: iNullWidth, attributes: {class:"ta-c", style:sEllipsis}, title: " "}
					];
	            
	            //toolTip
	            UtilSvc.gridtooltipOptions.filter = "td";
	            itlDataVO.tooltipOptions = UtilSvc.gridtooltipOptions;
	            	
	            //초기 실행
	            itlDataVO.search = function(){
	            	var self = this;
	            	var param = {
    						procedureParam: "USP_SY_17ITL_SEARCH&L_LIST01@s|L_LIST02@s|L_START_DATE@s|L_END_DATE@s",
    						L_LIST01      : self.mngMrkModel,
    						L_LIST02      : self.stJobModel,
    						L_START_DATE  : new Date(self.datesetting.period.start.y, self.datesetting.period.start.m-1, self.datesetting.period.start.d).dateFormat("Ymd"),
    						L_END_DATE    : new Date(self.datesetting.period.end.y  , self.datesetting.period.end.m-1  , self.datesetting.period.end.d).dateFormat("Ymd")
    					};
					UtilSvc.getList(param).then(function (res) {
						$scope.ordkg.dataSource.data(res.data.results[0]);
						$scope.trankg.dataSource.data(res.data.results[1]);
						$scope.cankg.dataSource.data(res.data.results[2]);
						$scope.cskg.dataSource.data(res.data.results[3]);
						$scope.shikg.dataSource.data(res.data.results[4]);

						$scope.gridMidVO[0].dataSource.data(res.data.results[5]);
						$scope.gridMidVO[1].dataSource.data(res.data.results[6]);
						$scope.gridMidVO[2].dataSource.data(res.data.results[7]);

						// 조회한 조건을 localstorage에 저장함.
						var inquiryParam = {
                    		mngMrkModel : self.mngMrkModel,    
    	                    mngMrkBindSelect : self.mngMrkBind.allSelectNames,                    
    	                    stJobModel  : self.stJobModel,
    	                    stJobBindSelect : self.stJobBind.allSelectNames,
    	                    start       : self.datesetting.period.start,
    	                    end         : self.datesetting.period.end
	                    };
						
	        			// 검색조건 세션스토리지에 임시 저장
	        			UtilSvc.grid.setInquiryParam(inquiryParam);
					});
	            };	
	            	  
	            //open
	            itlDataVO.isOpen = function(val){
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
            	
                var gridMidVO = $scope.gridMidVO = [{
                		boxTitle: "로그인 실패한 마켓리스트",
	                	defFields: {
	    					ROW_NUM          :{type: "number", editable: false, nullable: false},
							DTS_FAIL         :grdScmSelectAttr,
					        NM_MRK           :grdScmSelectAttr
	        			},
            			defColumns: gridItlFailMrk	        			
                	},
                	{
                		boxTitle: "연동 통계 건수",
                		defFields: {
        					DC_PROC          :grdScmSelectAttr,
        					CNT_SCD          :grdScmSelectAttr,
        					CNT_CPLT         :grdScmSelectAttr,
        					CNT_ERR          :grdScmSelectAttr
            			},
            			defColumns: gridItl01
                	},
                	{
                		boxTitle: "연동 통계 건수",
                		defFields: {
        					DC_PROC          :grdScmSelectAttr,
        					CNT_SCD          :grdScmSelectAttr,
        					CNT_CPLT         :grdScmSelectAttr,
        					CNT_ERR          :grdScmSelectAttr
            			},
            			defColumns: gridItl02
                	}
                ];
                
                gridMidVO.addCommonGridVO = function(gridMidLocalVO, iIndex) {
                	var localSelf = gridMidLocalVO;
	            	localSelf.iIndex = iIndex;
	            	localSelf.autoBind = false;
	            	localSelf.messages = {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        commands: {
                            update: "저장",
                            canceledit: "취소"
                        },
                        noRecords: "검색된 데이터가 없습니다."
                    };
                    localSelf.sortable = true;
                    localSelf.noRecords = true;
                    localSelf.dataSource = new kendo.data.DataSource({
                    	transport: {
                		},
                		batch: true,
                		schema: {
                			model: { 
                				fields: localSelf.defFields
                			}
	                	}
                	}); 
                	localSelf.navigatable = true; //키보드로 그리드 셀 이동 가능
                	localSelf.selectable = "multiple";
                	localSelf.columns = itlDataVO.columnProc(localSelf.defColumns);
                	localSelf.collapse = function(e) {
                        this.cancelRow();
                    };
                    localSelf.resizable = true;
                    localSelf.height = 120;  
                	
                	return localSelf;
                };
                
				var gridTabVO = $scope.gridTabVO = [{
						defFields: {
	    					ROW_NUM          :{type: "number", editable: false, nullable: false},
							NM_MNGMRK        :grdScmSelectAttr,
							NM_MRK           :grdScmSelectAttr,
					        DC_MRKID         :grdScmSelectAttr,
							orderNo          :grdScmSelectAttr,
					        productOrderNo   :grdScmSelectAttr,
					        mallOrderNo      :grdScmSelectAttr,
					        paymentNo        :grdScmSelectAttr,
					        definiteOrderDate:grdScmSelectAttr,
					        process_result   :grdScmSelectAttr,      
					        req_datetime     :grdScmSelectAttr,       
					        result_msg       :grdScmSelectAttr,       
					        DC_TEMP          :grdScmSelectAttr
	        			},
            			defColumns: gridOrderConfirm
		            },
		            {
		            	defFields: {
        					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
    						NM_MNGMRK:         grdScmSelectAttr,
    						NM_MRK:            grdScmSelectAttr,
					        DC_MRKID:          grdScmSelectAttr,
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
					        result_msg:	   	   grdScmSelectAttr,       
					        DC_TEMP:           grdScmSelectAttr
            			},
            			defColumns: gridInvoiceNo            			
		            },
		            {
		            	defFields: {
        					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
    						NM_MNGMRK:         grdScmSelectAttr,
    						NM_MRK:            grdScmSelectAttr,
					        DC_MRKID:          grdScmSelectAttr,
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
					        pickupStatue:	   grdScmSelectAttr,       
					        DC_TEMP:           grdScmSelectAttr
            			},
            			defColumns: gridClaimConfirm     
		            },
		            {
		            	defFields: {
        					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
    						NM_MNGMRK:         grdScmSelectAttr,
    						NM_MRK:            grdScmSelectAttr,
					        DC_MRKID:          grdScmSelectAttr,
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
					        result_msg:	       grdScmSelectAttr,       
					        DC_TEMP:           grdScmSelectAttr
            			},
            			defColumns: gridInquiryProcess  
		            },
		            {
		            	defFields: {
        					ROW_NUM: 		   {type: "number", editable: false, nullable: false},
    						NM_MNGMRK:         grdScmSelectAttr,
    						NM_MRK:            grdScmSelectAttr,
					        DC_MRKID:          grdScmSelectAttr,
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
        					result_msg:	       grdScmSelectAttr,       
					        DC_TEMP:           grdScmSelectAttr
            			},
            			defColumns: gridShippingManagement  
		            }
		        ];
                
                gridTabVO.addCommonGridVO = function(gridTabLocalVO, iIndex) {
	            	var localSelf = gridTabLocalVO;
	            	localSelf.iIndex = iIndex;
	            	localSelf.autoBind = false;
	            	localSelf.messages = {                        	
                        requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
                        noRecords: "검색된 데이터가 없습니다."
                    };
	            	localSelf.sortable = true;                    	
	            	localSelf.pageable = {
                       	messages: UtilSvc.gridPageableMessages
                    };
                    localSelf.noRecords = true;
                    localSelf.dataSource = new kendo.data.DataSource({
                    	transport: {
                		},
                       	pageSize: 13,
                		batch: true,
                		schema: {
                			model: { 
                    			id: "ROW_NUM",
                				fields: localSelf.defFields
	                		}
	                	}
                	});
                    localSelf.navigatable = true; //키보드로 그리드 셀 이동 가능
                    localSelf.columns = itlDataVO.columnProc(localSelf.defColumns),
                    localSelf.collapse = function(e) {
                        this.cancelRow();
                    };
                    localSelf.resizable = true;
                    localSelf.height = 449;  
                	
                	return localSelf;
	            };
	            
	            itlDataVO.init();
            }]);
}());