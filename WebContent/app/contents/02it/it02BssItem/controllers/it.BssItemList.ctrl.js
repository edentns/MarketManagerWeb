(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.BssItem.controller : it.BssItemCtrl
     * 기본상품관리
     */
    angular.module("it.BssItem.controller")
        .controller("it.BssItemListCtrl", ["$scope", "$state", "$http", "$window", "$q", "$log", "it.BssItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "sy.CodeSvc",
            function ($scope, $state, $http, $window, $q, $log, itBssItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc, SyCodeSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            $scope.bssItemInsert = function() {
	            	$state.go('app.itBssItem', { kind: "insert", menu: null, ids: "new" });
				};

                $scope.grdDblClickGo = function(cd_item){
                	$state.go( "app.itBssItem", { kind: "detail", menu: null, ids: cd_item});
                };
                
                $scope.bssItemDelete = function(a) {
                	var grid = $scope.gridBssVO,
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
                				$scope.gridBssVO.dataSource.read();
                			});  
                    	}
                	}
				};
	            	            
	            var bssItemDataVO = $scope.bssItemDataVO = {
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
	        		signItem      : { value: resData.signItemValue, focus: false },
	        		nmItem        : { value: resData.nmItemValue  , focus: false },
	        		nmMnfr        : { value: resData.nmMnfrValue  , focus: false },
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
	            bssItemDataVO.doQuiry = function(){
	            	$timeout(function() {
	            		if(!page.isWriteable()){
	    					$("#divBssVO .k-grid-toolbar").hide();
	    				}
	            		
	            		$scope.gridBssVO.dataSource.read();
        			});
	            };
	            
	            //조회
	            bssItemDataVO.inQuiry = function(){
	            	$scope.gridBssVO.dataSource.read();
		            var param = {
		            	CD_SIGNITEM : bssItemDataVO.signItem.value,
						NM_ITEM : bssItemDataVO.nmItem.value,
			        	NM_MNFR :	bssItemDataVO.nmMnfr.value,
			        	YN_ADULCTFC : bssItemDataVO.adulYnIds,
						CD_TAXCLFT  : bssItemDataVO.taxClftIds,
						CD_ITEMCLFT : bssItemDataVO.iClftIds,
						CD_ITEMKIND : bssItemDataVO.iKindIds,
						YN_ADULCTFC_SELECT_INDEX : bssItemDataVO.adulYnList.allSelectNames,
						CD_TAXCLFT_SELECT_INDEX  : bssItemDataVO.taxClftList.allSelectNames,
						CD_ITEMKIND_SELECT_INDEX : bssItemDataVO.iKindList.allSelectNames,
						CD_ITEMSTAT_SELECT_INDEX : bssItemDataVO.iStatList.allSelectNames,
						DATEOPT     : bssItemDataVO.selectedDateOption,
	                	PERIOD      : UtilSvc.grid.getDateSetting(bssItemDataVO.datesetting)
	                };
        			// 검색조건 세션스토리지에 임시 저장
        			UtilSvc.grid.setInquiryParam(param);
	            };	 
	            
	            //초기화버튼
	            bssItemDataVO.init = function(){
	            	saleItemDataVO.adulYnList.bReset   = true;
	            	bssItemDataVO.taxClftList.bReset = true;
	            	bssItemDataVO.iClftList.bReset = true;
	            	bssItemDataVO.iKindList.bReset = true;
	            	bssItemDataVO.iStatList.bReset = true;
	            };
	            
	            bssItemDataVO.isOpen = function (val) {
	            	var searchIdHeight = $("#searchId").height();
	            	var settingHeight = $(window).height() - searchIdHeight - 90;
	            	var pageSizeValue = val? 9 : 12;
	            	$scope.gridBssVO.wrapper.height(settingHeight);
            		$scope.gridBssVO.resize();
            		gridBssVO.dataSource.pageSize(pageSizeValue);
	            };
	            
	            //popup insert & update Validation - 현재 사용안함
	            $scope.readValidation = function(idx){
	            	var result = true;
	            	
            		if(idx.I_CD_CLFT === null || idx.I_CD_CLFT === ""){ $scope.showPopup("상품을 입력해 주세요."); result = false; return; };
            		if(idx.I_CD_INQSTAT === null || idx.I_CD_INQSTAT === ""){ $scope.showPopup("상태값을 입력해 주세요."); result = false; return;};
            		if(idx.I_CD_INQCLFT === null || idx.I_CD_INQCLFT === ""){ $scope.showPopup("문의 구분을 입력해 주세요."); result = false; return;};		
	            
	            	return result;
	            };	               
	            //기본상품 검색 그리드
                var gridBssVO = $scope.gridBssVO = {
                		autoBind: false,
                        messages: {                        	
                            requestFailed: "상품정보를 가져오는 중 오류가 발생하였습니다.",
                            commands: {
                                update: "저장",
                                canceledit: "닫기"
                            },
                            noRecords: "검색된 데이터가 없습니다."
                        },
                    	boxTitle : "기본상품 리스트",
                    	sortable: false,                    	
                    	pageable: {
                        	messages: UtilSvc.gridPageableMessages
                        },
                        noRecords: true,
                    	dataSource: new kendo.data.DataSource({
                    		transport: {
                    			read: function(e) {
                    				var me = this,
                    					param = {
                    					procedureParam:"USP_IT_02BSSITEM01_GET&I_CD_CLFT@s|I_NM_ITEM@s|I_YN_ADULCTFC@s|I_CD_TAXCLFT@s|I_CD_ITEMKIND@s|I_CD_ITEMSTAT@s|I_DATEOPT@s|DATE_FROM@s|DATE_TO@s",
                    					I_CD_CLFT :	bssItemDataVO.signItem.value,
                    					I_NM_ITEM : bssItemDataVO.nmItem.value,
                    					I_YN_ADULCTFC : bssItemDataVO.adulYnIds,
                    					I_CD_TAXCLFT  : bssItemDataVO.taxClftIds,
                    					I_CD_ITEMKIND : bssItemDataVO.iKindIds,
                    					I_CD_ITEMSTAT : bssItemDataVO.iStatIds,
                    					I_DATEOPT     : bssItemDataVO.selectedDateOption,
                    					DATE_FROM     : new Date(bssItemDataVO.datesetting.period.start.y, bssItemDataVO.datesetting.period.start.m-1, bssItemDataVO.datesetting.period.start.d, "00", "00", "00").dateFormat("YmdHis"),
                                    	DATE_TO       : new Date(bssItemDataVO.datesetting.period.end.y, bssItemDataVO.datesetting.period.end.m-1, bssItemDataVO.datesetting.period.end.d, 23, 59, 59).dateFormat("YmdHis"),
                                    };
                    				
                    				UtilSvc.getList(param).then(function (res) {
                						e.success(res.data.results[0]);
                					});
                    			},                    			
                    			update: function(e) {
                    				var defer = $q.defer(),
    	                			 	param = e.data.models[0];
                    				itBssItemSvc.csUpdate(param).then(function(res) {
    	                				defer.resolve();
    	                				$scope.cskg.dataSource.read();
    	                			});  
                    				return defer.promise;
                    			}, 	                		
                    			parameterMap: function(e, operation) {
                    				if(operation !== "read" && e.models) {
                    					return {models:kendo.stringify(e.models)};
                    				}
                    			}
                    		},
                    		change: function(e){
                    			var data = this.data();
                    			bssItemDataVO.dataTotal = data.length;
                    			//console.log("변화된 데이터 => ",data.length);
                    		},
                    		pageSize: 9,
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
                    					HTML_DETEXPL:	   	       {	
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
                    	toolbar: [{template: kendo.template($.trim($("#bss-toolbar-template").html()))}],
                    	columns: [
                  	            {
  			                        field: "ROW_CHK",
  			                        title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onBssGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",
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
  		                        	field: "HTML_DETEXPL",
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
                    	resizable: true,
                    	rowTemplate: kendo.template($.trim($("#bss_template").html())),
                    	altRowTemplate: kendo.template($.trim($("#bss_alt_template").html())),
                    	height: 615      
                    	//모델과 그리드 셀을 제대로 연동 안시키면 수정 팝업 연 후 닫을 때 로우가 사라짐(즉 크레에이트인지 에딧인지 구분을 못함)
                    	//id는 유니크한 모델값으로 해야함 안그러면 cancel 시에 row grid가 중복 되는 현상이 발생
        		};
                                
                //kendo grid 체크박스 옵션
                $scope.onBssGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.gridBssVO,
	                	dataItem = grid.dataItem(row);
	                 	                
	                dataItem.ROW_CHK = checked;
	                
	                if (checked) {
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                } else {
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
                };
                
              //kendo grid 체크박스 all click
                $scope.onBssGrdCkboxAllClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.parents("div").find(".k-grid-content table tr"),
	                	grid = $scope.gridBssVO,
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
	                bssItemDataVO.doQuiry();
	                bssItemDataVO.isOpen(false);
                }, 0);
            }]);
}());