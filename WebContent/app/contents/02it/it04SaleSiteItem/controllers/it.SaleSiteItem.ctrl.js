(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleSiteItem.controller : it.SaleSiteItemCtrl
     * 상품분류관리
     */
    angular.module("it.SaleSiteItem.controller")
        .controller("it.SaleSiteItemCtrl", ["$scope", "$http", "$q", "$log", "it.SaleSiteItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc",
            function ($scope, $http, $q, $log, itSaleSiteItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();

                $scope.grdDblClickGo = function(NO_MRKREGITEM){
                	itSaleSiteItemSvc.saleSiteDetail(NO_MRKREGITEM).then(function() {
	            	}, function() {
					});
                };
                
	            var saleItemDataVO = $scope.saleItemDataVO = {
	            	boxTitle : "검색",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
	        		},
	        		cmrkSetting : {
	        			id: "NO_MRK",
	        			name: "NM_MRK",
	        			maxNames: 2
	        		},
	        		datesetting : {
	        			dateType   : 'basic',
						buttonList : ['current', '1Day', '1Week', '1Month'],
						selected   : 'current',
						period : {
							start : angular.copy(today),
							end   : angular.copy(today)
						}
	        		},
	        		itemCtgrList1 : [],
	        		selectedCtgr1 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList2 : [],
	        		selectedCtgr2 : {ID_CTGR : "", NM_CTGR: ""},
	        		itemCtgrList3 : [],
	        		selectedCtgr3 : {ID_CTGR : "", NM_CTGR: ""},
	        		signItem : { value: "" , focus: false },
	        		nmItem   : { value: "" , focus: false },
	        		nmMnfr   : { value: "" , focus: false },
	        		taxClftList   : [],
	        		taxClftIds    : "*",
	        		iStatList     : [],
	        		iStatIds      : "*",
	        		cmrkList      : [],
	        		cmrkIds       : "*",
	        		iCtgrId       : "",
	        		dataTotal     : 0
	            };	            
	            
	            //처음 화면들어왓을때
	            saleItemDataVO.doQuiry = function(){
	            	saleItemDataVO.taxClftList = resData.taxCodeList;
	            	saleItemDataVO.iStatList   = resData.iStatCodeList;
	            	saleItemDataVO.itemCtgrList1   = resData.itCtgrList;
	            	saleItemDataVO.cmrkList    = resData.cmrkList;
	            	
	            	$timeout(function() {
		            	// 이전에 검색조건을 세션에 저장된 것을 가져옴
	            		var history = UtilSvc.grid.getInquiryParam();
		            	if(history){
		            		saleItemDataVO.signItem.value = history.CD_SIGNITEM;
	    					saleItemDataVO.nmItem.value = history.NM_ITEM;
	    					saleItemDataVO.cmrkIds = history.NO_MRK;
	    					saleItemDataVO.cmrkList.setSelectNames = history.NO_MRK_SELECT_INDEX;
	    					saleItemDataVO.iStatIds = history.CD_ITEMSTAT;
	    					saleItemDataVO.iStatList.setSelectNames = history.CD_ITEMSTAT_SELECT_INDEX;
	    					saleItemDataVO.selectedCtgr1.ID_CTGR = history.CD_ITEMCTGR1;
	    					saleItemDataVO.selectedCtgr1.NM_CTGR = history.NM_ITEMCTGR1;
	    					saleItemDataVO.ctgrChange(0);
	    					saleItemDataVO.selectedCtgr2.ID_CTGR = history.CD_ITEMCTGR2;
	    					saleItemDataVO.selectedCtgr2.NM_CTGR = history.NM_ITEMCTGR2;
	    					saleItemDataVO.ctgrChange(1);
	    					saleItemDataVO.selectedCtgr3.ID_CTGR = history.CD_ITEMCTGR3;
	    					saleItemDataVO.selectedCtgr3.NM_CTGR = history.NM_ITEMCTGR3;
	    					saleItemDataVO.ctgrChange(2);
							saleItemDataVO.datesetting.period.start = history.DATE_FROM;
		                	saleItemDataVO.datesetting.period.end = history.DATE_TO;
		            		
		            		$scope.gridSaleVO.dataSource.read();
		            	}
	            	},1000);
	            };
	            
	            //조회
	            saleItemDataVO.inQuiry = function(){
	            	$scope.gridSaleVO.dataSource.read();
	            	var param = {
	            			CD_SIGNITEM  : saleItemDataVO.signItem.value,
        					NM_ITEM      : saleItemDataVO.nmItem.value,
        					NO_MRK       : saleItemDataVO.cmrkIds,
        					NO_MRK_SELECT_INDEX : saleItemDataVO.cmrkList.allSelectNames,
        					CD_ITEMSTAT  : saleItemDataVO.iStatIds,
        					CD_ITEMSTAT_SELECT_INDEX : saleItemDataVO.iStatList.allSelectNames,
        					CD_ITEMCTGR1 : saleItemDataVO.selectedCtgr1.ID_CTGR,
        					NM_ITEMCTGR1 : saleItemDataVO.selectedCtgr1.NM_CTGR,
        					CD_ITEMCTGR2 : saleItemDataVO.selectedCtgr2.ID_CTGR,
        					NM_ITEMCTGR2 : saleItemDataVO.selectedCtgr2.NM_CTGR,
        					CD_ITEMCTGR3 : saleItemDataVO.selectedCtgr3.ID_CTGR,
        					NM_ITEMCTGR3 : saleItemDataVO.selectedCtgr3.NM_CTGR,
							DATE_FROM    : saleItemDataVO.datesetting.period.start,
		                	DATE_TO      : saleItemDataVO.datesetting.period.end
		                };
	        			// 검색조건 세션스토리지에 임시 저장
	        			UtilSvc.grid.setInquiryParam(param);
	            };	 
	            
	            //초기화버튼
	            saleItemDataVO.init = function(){
	            	saleItemDataVO.taxClftList.bReset   = true;
	            	saleItemDataVO.iStatList.bReset   = true;
	            	saleItemDataVO.cmrkList.bReset   = true;
	            	saleItemDataVO.itemCtgrList2 = "";
	            	saleItemDataVO.itemCtgrList3 = "";
	            	saleItemDataVO.itemCtgrList1   = resData.itCtgrList;
	            	saleItemDataVO.selectedCtgr1 = {ID_CTGR : "", NM_CTGR: ""};
	            	saleItemDataVO.selectedCtgr2 = {ID_CTGR : "", NM_CTGR: ""};
	            	saleItemDataVO.selectedCtgr3 = {ID_CTGR : "", NM_CTGR: ""};
	            	
	            	saleItemDataVO.signItem.value = "";
	            	saleItemDataVO.nmItem.value   = "";
	            	
	            	saleItemDataVO.datesetting.selected = "current";
	            };	

	            saleItemDataVO.isOpen = function (val) {
	            	if(val) {
	            		$scope.gridSaleVO.wrapper.height(656);
	            		$scope.gridSaleVO.resize();
	            		gridSaleVO.dataSource.pageSize(20);
	            	}
	            	else {
	            		$scope.gridSaleVO.wrapper.height(798);
	            		$scope.gridSaleVO.resize();
	            		gridSaleVO.dataSource.pageSize(24);
	            	}
	            };
	            
	            //판매상품 검색 그리드
                var gridSaleVO = $scope.gridSaleVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "상품정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                update: "저장",
                                canceledit: "닫기"
                            }
                            ,noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "판매상품 리스트",
                    	sortable: false,                    	
                    	pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				if(saleItemDataVO.selectedCtgr3 == null || saleItemDataVO.selectedCtgr3.ID_CTGR == ""){
                    					if(saleItemDataVO.selectedCtgr2 == null || saleItemDataVO.selectedCtgr2.ID_CTGR == ""){
                    						if(saleItemDataVO.selectedCtgr1 == null || saleItemDataVO.selectedCtgr1.ID_CTGR == ""){
                    							saleItemDataVO.iCtgrId = "";
                            				}else{
                            					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr1.ID_CTGR;
                            				}
                        				}else{
                        					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr2.ID_CTGR;
                        				}
                    				}else{
                    					saleItemDataVO.iCtgrId = saleItemDataVO.selectedCtgr3.ID_CTGR;
                    				}
                    				var param = {
                    					procedureParam: "USP_IT_04SITEITEM_LIST_GET&L_CD_SIGNITEM@s|L_NM_ITEM@s|L_NO_MRK@s|L_CD_ITEMSTAT@s|L_CD_ITEMCTGR@s",
                    					L_CD_SIGNITEM :	saleItemDataVO.signItem.value,
                    					L_NM_ITEM     : saleItemDataVO.nmItem.value,
                    					L_NO_MRK      : saleItemDataVO.cmrkIds,
                    					L_CD_ITEMSTAT : saleItemDataVO.iStatIds,
                    					L_CD_ITEMCTGR : saleItemDataVO.iCtgrId
                                    };
                    				UtilSvc.getList(param).then(function (res) {
                						e.success(res.data.results[0]);       
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
                    			saleItemDataVO.dataTotal = data.length;
                    		},
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "CD_ITEM",
                    				fields: {						              //수수료 추가해야댐        
                    					ROW_CHK: 		   {	
    				                    						type: "boolean", 
    															editable: true,  
    															nullable: false
                										   },
									    NO_MRKREGITEM:	   {	
																type: "string", 
																editable: false,
																nullable: false
           											       },                										   
									    NO_MRKITEM:	       {	
																type: "string", 
																editable: false,
																nullable: false
           											       },
           								NO_MRK:	           {	
																type: "string", 
																editable: false,
																nullable: false
       											           },
    								    CD_SIGNITEM:	   {	
                    											type: "string", 
                    											editable: false,
                												nullable: false
            											   },                    					
            							NM_CTGR:	       {	
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
                    					NM_ITEM: 	   	   {	
    															type: "string", 
    															editable: false,
    															nullable: false
                        						    	   },
                        				CD_ITEM: 	   	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    AM_ITEMPRC: 	   {
    															type: "number", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    QT_SALE: 	       {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_INSERT: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_SALESTART: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    DTS_SALEEND: 	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   }
                    				}
                    			}
                    		},
                    	}),                    	
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#sale-toolbar-template").html()))}],
                    	columns: [
                  	            {
  			                        field: "ROW_CHK",
  			                        title: "선택",					                        
  			                        width: "30px",
  			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
                  	            },
                  	            {	
                  	            	field: "NO_MRK",
  		                            title: "판매마켓",
  		                            width: "80px",
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {	
                  	            	field: "CD_SIGNITEM",
  		                            title: "상품코드",
  		                            width: "80px",
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {
  		                        	field: "NO_MRKITEM",	
  		                            title: "마켓상품번호",
  		                            width: 80,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                        
  		                        {
  		                        	field: "NM_ITEM",	
  		                            title: "상품명/옵션",
  		                            width: 200,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                         
  		                        {
  		                        	field: "CD_ITEM",	
  		                            title: "자체 상품번호",
  		                            width: 90,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                 
  		                        {
  		                        	field: "NM_CTGR",	
  		                            title: "상품분류",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                         
  		                        {
  		                        	field: "AM_ITEMPRC",	
  		                            title: "판매가",
  		                            width: 70,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },                          
  		                        {
  		                        	field: "",	
  		                            title: "수수료",
  		                            width: 60,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "QT_SALE",	
  		                            title: "재고수량",
  		                            width: 70,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "DTS_INSERT",	
  		                            title: "등록일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },    
  		                        {
  		                        	field: "DTS_SALESTART",	
  		                            title: "판매시작일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        },
  		                        {
  		                        	field: "DTS_SALEEND",	
  		                            title: "판매종료일시",
  		                            width: 100,
  		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
  		                        }
                      ],
                    	dataBound: function(e) {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());// 마스터 테이블을 확장하므로 세부행을 볼 수 있음                                                  
                        },
                        /*selectable: "row",*/
                        collapse: function(e) {
                            this.cancelRow();
                        },         	
                    	editable: {
                    		mode: "popup",
                    		window : {
                    	        title: ""
                    	    },
                    		template: kendo.template($.trim($("#cs_popup_template").html())),
                    		confirmation: false
                    	},	
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#sale_template").html())),
                    	altRowTemplate: kendo.template($.trim($("#alt_sale_template").html())),
                    	height: 656      
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};
                
                saleItemDataVO.ctgrChange = function(flag){
	            	var self = this,
	            	    param = {
        					procedureParam: "MarketManager.USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
        					IT_ID_CTGR: ""
        					};
	            	if(flag == 0){
	            		if(self.selectedCtgr1){
	            			param.IT_ID_CTGR = "";
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList1 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList2 = "";self.itemCtgrList3 = "";
		            	}
	            	}
	            	if(flag == 1){
	            		if(self.selectedCtgr1){
	            			param.IT_ID_CTGR = self.selectedCtgr1.ID_CTGR;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList2 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList2 = "";self.itemCtgrList3 = "";
		            	}
	            	}else if(flag == 2){
	            		if(self.selectedCtgr2){
	            			param.IT_ID_CTGR = self.selectedCtgr2.ID_CTGR;
	            			UtilSvc.getList(param).then(function (res) {
	            				self.itemCtgrList3 = res.data.results[0];
                            });
		            	}else{
		            		self.itemCtgrList3 = "";
		            	}
	            	}
	            };
                                
                //kendo grid 체크박스 옵션
                $scope.onSaleGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.gridSaleVO,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                } else {
	                	row.removeClass("k-state-selected");
	                };
                };
                
                $scope.onCsGridEditClick = function(){            	
                	var grd = $scope.cskg,
	            		chked = grd.element.find("input:checked"),
	            		chkedLeng = grd.element.find("input:checked").length;
                	
                	if(chkedLeng === 1){
                		grd.editRow(chked.closest('tr'));
                	}else if(chkedLeng > 1){
                		//alert("답변 하실 데이터를 1개만 선택해 주세요.");
                		$scope.showPopup("답변 하실 데이터를 1개만 선택해 주세요.");
                	}else if(chkedLeng < 1){
                		//alert("답변 하실 데이터를 선택해 주세요.");
                		$scope.showPopup("답변 하실 데이터를 선택해 주세요.");
                	}
                };	
                
                //alert 경고
                $scope.notf1Options = {
            		position: {
                        // notification popup will scroll together with the other content
                        pinned: false,
                        // the first notification popup will appear 30px from the viewport's top and right edge
                        top: 30,
                        left: 30,
                        height: 300,
                        width: 250
                    },	
                    templates: [{                    	
                        type: "warning",
                        template: $("#notificationTemplate").html()
                    }]
                };

                $scope.ngValue = "[닫기]";

                $scope.showPopup = function (msg) {
                    $scope.notf1.show({
                      kValue: msg
                    }, "warning");
                };
                
                saleItemDataVO.doQuiry();
                
            }]);
}());