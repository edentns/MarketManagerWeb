(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.SaleItem.controller : it.SaleItemCtrl
     * 판매상품관리
     */
    angular.module("it.SaleItem.controller")
        .controller("it.SaleItemListCtrl", ["$scope", "$state", "$http", "$window", "$q", "$log", "it.BssItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "sy.CodeSvc",
            function ($scope, $state, $http, $window, $q, $log, itBssItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc, SyCodeSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            $scope.saleItemInsert = function(flag) {
	            	if(flag == "new"){
	            		$state.go('app.itSaleItem', { kind: "insert", menu: null, ids: flag });
	            	}else if(flag == "sale"){
	            		var grid = $scope.gridSaleVO,
                	    	dataItem = grid._data,
                	    	checkItem = [];
	            		
	            		angular.forEach(dataItem, function (data) {
	                        if(data.ROW_CHK){
	                        	checkItem.push(data.CD_ITEM);
	                        }
	                    });
	            		
	            		if(checkItem.length < 1){alert("한 개의 판매상품을 선택해주세요.");return;}
	            		
	            		$state.go('app.itSaleSiteItem', { kind: "insert", menu: null, ids: checkItem[0] });
	            	}
				};

                $scope.grdDblClickGo = function(cd_item){
                	$state.go( "app.itSaleItem", { kind: "detail", menu: null, ids: cd_item});
                };
                
                $scope.saleItemDelete = function(a) {
                	var grid = $scope.gridSaleVO,
                	    dataItem = grid._data,
                	    deleteItem = [];
                	
                	angular.forEach(dataItem, function (data) {
                        if(data.ROW_CHK){
                        	deleteItem.push(data.CD_ITEM);
                        }
                    });
                	if(deleteItem.length == 0){
                		alert("삭제할 상품을 선택해주세요.");
                	}else{
                		if(confirm('정말로 삭제하시겠습니까?')){
                    		itBssItemSvc.deleteBssItem(deleteItem).then(function(res) {
                				$scope.gridSaleVO.dataSource.read();
                			});  
                    	}
                	}
				};
                	            
	            var saleItemDataVO = $scope.saleItemDataVO = {
	            	boxTitle : "검색",
	            	setting : {
	        			id: "CD_DEF",
	        			name: "NM_DEF",
	        			maxNames: 2
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
	        		dateOption    : [{CD_DEF : "001" , NM_DEF : "등록일시"},
	        		                 {CD_DEF : "002" , NM_DEF : "유효일시"}
	        						],
	        		selectedDateOption : resData.selectedDateOption,
	        		signItem : { value: resData.signItemValue, focus: false },
	        		nmItem   : { value: resData.nmItemValue  , focus: false },
	        		nmMnfr   : { value: resData.nmMnfrValue  , focus: false },
	        		adulYnList    : resData.adulYnList,
	        		adulYnIds     : resData.adulYnIds,
	        		taxClftList   : resData.taxCodeList,
	        		taxClftIds    : resData.taxClftIds,
	        		iKindList     : resData.iKindCodeList,
	        		iKindIds      : resData.iKindIds,
	        		iStatList     : resData.iStatCodeList,
	        		iStatIds      : resData.iStatIds,
	        		dataTotal     : 0
	            };	            
	            
	            //처음 화면들어왓을때
	            saleItemDataVO.doQuiry = function(){
	            	$timeout(function() {
	            		if(!page.isWriteable()){
	    					$("#divSaleVO .k-grid-toolbar").hide();
	    				}

	            		$scope.gridSaleVO.dataSource.read();
        			});
	            };
	            
	            //조회
	            saleItemDataVO.inQuiry = function(){
	            	$scope.gridSaleVO.dataSource.read();
	            	var param = {
            			CD_SIGNITEM :	saleItemDataVO.signItem.value,
						NM_ITEM : saleItemDataVO.nmItem.value,
			        	NM_MNFR :	saleItemDataVO.nmMnfr.value,
			        	YN_ADULCTFC : saleItemDataVO.adulYnIds,
						CD_TAXCLFT  : saleItemDataVO.taxClftIds,
						CD_ITEMKIND : saleItemDataVO.iKindIds,
						CD_ITEMSTAT : saleItemDataVO.iStatIds,
						YN_ADULCTFC_SELECT_INDEX : saleItemDataVO.adulYnList.allSelectNames,
						CD_TAXCLFT_SELECT_INDEX  : saleItemDataVO.taxClftList.allSelectNames,
						CD_ITEMKIND_SELECT_INDEX : saleItemDataVO.iKindList.allSelectNames,
						CD_ITEMSTAT_SELECT_INDEX : saleItemDataVO.iStatList.allSelectNames,
						DATEOPT     : saleItemDataVO.selectedDateOption,
						PERIOD      : UtilSvc.grid.getDateSetting(saleItemDataVO.datesetting)
	                };
        			// 검색조건 세션스토리지에 임시 저장
        			UtilSvc.grid.setInquiryParam(param);
	            };	 
	            
	            //초기화버튼
	            saleItemDataVO.init = function(){
	            	saleItemDataVO.adulYnList.bReset   = true;
	            	saleItemDataVO.taxClftList.bReset  = true;
	            	saleItemDataVO.iClftList.bReset    = true;
	            	saleItemDataVO.iKindList.bReset    = true;
	            	saleItemDataVO.cmrkList.bReset     = true;
	            	
	            	saleItemDataVO.signItem.value = "";
	            	saleItemDataVO.nmItem.value   = "";
	            	saleItemDataVO.nmMnfr.value   = "";
	            };	

	            saleItemDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 9 : 12;
	            	$scope.gridSaleVO.wrapper.height(settingHeight);
            		$scope.gridSaleVO.resize();
            		gridSaleVO.dataSource.pageSize(pageSizeValue);
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
                    				var param = {
                    					procedureParam:"USP_IT_03SALEITEM_LIST_GET&I_CD_SIGNITEM@s|I_NM_ITEM@s|I_YN_ADULCTFC@s|I_CD_TAXCLFT@s|I_CD_ITEMKIND@s|I_CD_ITEMSTAT@s|I_DATEOPT@s|DATE_FROM@s|DATE_TO@s",
                    					I_CD_SIGNITEM :	saleItemDataVO.signItem.value,
                    					I_NM_ITEM : saleItemDataVO.nmItem.value,
                    					I_YN_ADULCTFC : saleItemDataVO.adulYnIds,
                    					I_CD_TAXCLFT  : saleItemDataVO.taxClftIds,
                    					I_CD_ITEMKIND : saleItemDataVO.iKindIds,
                    					I_CD_ITEMSTAT : saleItemDataVO.iStatIds,
                    					I_DATEOPT     : saleItemDataVO.selectedDateOption,
                    					DATE_FROM     : new Date(saleItemDataVO.datesetting.period.start.y, saleItemDataVO.datesetting.period.start.m-1, saleItemDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                                    	DATE_TO       : new Date(saleItemDataVO.datesetting.period.end.y, saleItemDataVO.datesetting.period.end.m-1, saleItemDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
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
                    			//console.log("변화된 데이터 => ",data.length);
                    		},
                    		pageSize: 11,
                    		batch: true,
                    		schema: {
                    			model: {
                        			id: "CD_ITEM",
                    				fields: {						                    
                    					ROW_CHK: 		   {	
    				                    						type: "boolean", 
    															editable: true,  
    															nullable: false
                										   },
									    CD_ITEM:	       {	
																type: "string", 
																editable: false,
																nullable: false
           											       },				   
    								    CD_SIGNITEM:	   {	
                    											type: "string", 
                    											editable: false,
                												nullable: false
            											   },                    					
            							DC_ITEMABBR:	   {	
                    											type: "string", 
                    											editable: false, 
                    											nullable: false
                    									   },
                    					NM_ITEM: 	   	   {	
    															type: "string", 
    															editable: false,
    															nullable: false
                        						    	   },
                        				ID_CTGR: 	   	   {
    															type: "string", 
    															editable: false, 
    															nullable: false
    						    	    				   },
    						    	    AM_PRCCLFT_S: 	   {
    															type: "number", 
    															editable: false, 
    															nullable: false
    						    	    				   },						    	    				   
    						    	    NM_FGFT: 	       {
    			        										type: "string",
    			        										editable: false,
    			        										nullable: false //true 일때 defaultValue가 안 됨
    						    	    				   },
    						    	    SF_M: 	           {
                    											type: "string",                     										
                    											editable: false,
                        										nullable: false
                    									   },                    									   
                    					SF_DE:	   	       {	
    			    									    	type: "string", 
    								    						editable: true,
    								    						nullable: false
    								    				   },
    								    SF_DI:	   	       {	
    				       										type: "string", 
    				       										editable: false,
    															nullable: false
    				   									   },
    				   					NM_MD: 	           {	
                       											type: "string", 
                    											editable: false,
                    											nullable: false
                    									   },                    					
                    					NM_CTF: 	       {
                    											type: "string",
                        										editable: false, 
                        										nullable: false //true 일때 defaultValue가 안 됨	                    										
                    									   },
                    					NM_MNFRER: 	       {
                        										type: "string",
                        										editable: true,
                        									    nullable: false
                    									   },
                    				    DTS_INSERT: 	   {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },			   
                    				    CD_OPTTP:          {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },	
                    				    AM_PRCCLFT_B: 	   {
    				                    				    	type: "number", 
    															editable: false, 
    															nullable: false
                    				    				   },	
                    				    DT_FGFTPRESSTART:  { 	
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },	
                    				    YN_ADULCTFC: 	   {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },	
                    				    NM_BRD: 	   	   {	
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },
                    				    CD_ITEMSTAT: 	   {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },	
                    				    CD_ITEMKIND: 	   {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },
                    				    DTS_VLD: 	   	   {
    				                    				    	type: "string", 
    															editable: false, 
    															nullable: false
                    				    				   },
                    				    CD_TAXCLFT: 	   {
   				                    				    	type: "string", 
   															editable: false, 
   															nullable: false
                   				    				   		}
                    				}
                    			}
                    		},
                    	}),                    	
                    	navigatable: true, //키보드로 그리드 셀 이동 가능
                    	toolbar: [{template: kendo.template($.trim($("#Sale-toolbar-template").html()))}],
                    	columns: [
                    	            {
    			                        field: "ROW_CHK",
    			                        title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onSaleGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",
  			                        width: "40px",
    			                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}
                    	            },                        
    		                        {	
                    	            	field: "CD_SIGNITEM",
    		                            title: "상품코드",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "CD_ITEMCLFT",
    				                                    title: "상품분류",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                 ]
    		                        },
    		                        {
    		                        	field: "NM_ITEM",	
    		                            title: "상품명",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "DC_ITEMABBR",
    				                                    title: "상품약어",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        },                        
    		                        {
    		                        	field: "AM_PRCCLFT_S",	
    		                            title: "판매가",
    		                            width: 100,                          
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "AM_PRCCLFT_B",
    				                                    title: "구입가",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        },                       
    		                        {
    		                        	field: "NM_FGFT",
    		                            title: "사은품명",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "DT_FGFTPRESSTART",
    				                                    title: "사은품 증정시작일",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        },               
    		                        {
    		                        	field: "CD_TAXCLFT", 
    		                            title: "과세구분",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "YN_ADULCTFC",
    				                                    title: "성인인증",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        },                        
    		                        {
    		                        	field: "SF_M",
    		                            title: "대표이미지",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "SF_DI",
    				                                    title: "상세이미지",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        },                        
    		                        {
    		                        	field: "SF_DE",
    		                            title: "상세설명",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "CD_OPTTP",
    				                                    title: "옵션",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        } ,                        
    		                        {
    		                        	field: "NO_CSMADVPHNE",
    		                            title: "인증",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "CD_ITEMKIND",
    				                                    title: "상품종류",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        } ,  
    		                        {
    		                        	field: "NM_BRD",
    		                            title: "브랜드",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "CD_ITEMSTAT",
    				                                    title: "상품상태",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
    		                        } ,  
    		                        {
    		                        	field: "DTS_INSERT",
    		                            title: "등록일시",
    		                            width: 100,
    		                            headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"},
    		                            columns: [ 
    		                                       	{
    				                                    field: "DT_VLD",
    				                                    title: "유효일시",
    				  		                            width: 100,
    							                        headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px"}
    				                                }
    			                                ]
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
                    	rowTemplate: kendo.template($.trim($("#Sale_template").html())),
                    	altRowTemplate: kendo.template($.trim($("#Sale_alt_template").html())),
                    	height: 658      
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};
                                
                //kendo grid 체크박스 옵션
                $scope.onSaleGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.gridSaleVO,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                } else {
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
                };

                //kendo grid 체크박스 all click
                $scope.onSaleGrdCkboxAllClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.parents("div").find(".k-grid-content table tr"),
	                	grid = $scope.gridSaleVO,
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
                /*
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
                };	*/
                
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
                
                $timeout(function(){
	                saleItemDataVO.doQuiry();
	                saleItemDataVO.isOpen(false);
                }, 0);
            }]);
}());