(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.MappingItem.controller : it.MappingItemCtrl
     * 상품분류관리
     */
    angular.module("it.MappingItem.controller")
        .controller("it.MappingItemCtrl", ["$scope", "$http", "$q", "$log", "it.MappingItemSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc",
            function ($scope, $http, $q, $log, itMappingItemSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            //kendo grid 체크박스 옵션
                $scope.onMmGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.mmDataVO,
	                	dataItem = grid.dataItem(row);
	                
	                for(var i = 0 ; i < grid._data.length ; i++){
	                	if(grid._data[i].ROW_CHK){
	                		if(dataItem.CD_ITEM == grid.dataSource._data[i].CD_ITEM){
	                			break;
	                		}else{
	                			alert("마켓매니저 판매상품은 한 상품만 선택 가능합니다.");
		                		row.removeClass("k-state-selected");
			                	row.find(".k-checkbox").prop( "checked", false );
		                		return;
	                		}
	                	}	
	                }
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if (checked) {
	                	$scope.it05MappingItemVO.selectedCD_ITEM  = dataItem.CD_ITEM;
	                	$scope.it05MappingItemVO.selectedNM_ITEM   = dataItem.NM_ITEM;
	                	$scope.it05MappingItemVO.selectedS_ITEMPRC = dataItem.S_ITEMPRC;
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                } else {
	                	$scope.it05MappingItemVO.selectedCD_ITEM  = "";
	                	$scope.it05MappingItemVO.selectedNM_ITEM   = "";
	                	$scope.it05MappingItemVO.selectedS_ITEMPRC = "";
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
                };
                
                $scope.onLinkGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.linkDataVO,
	                	dataItem = grid.dataItem(row);
	                
	                if($scope.linkDataPreVO.dataSource._data.length > 0){
	                	for( var j = 0 ; j < $scope.linkDataPreVO.dataSource._data.length ; j++ ){
	                		if(dataItem.NO_MNGMRK == $scope.linkDataPreVO.dataSource._data[j].NO_MNGMRK){
	                			if(dataItem.CD_TEMPITEM == $scope.linkDataPreVO.dataSource._data[j].CD_TEMPITEM){
	                				$scope.linkDataPreVO.dataSource._data.splice(j,1);
	                				break;
	                			}else{
		                			alert("한 오픈마켓에 한 상품만 선택가능 합니다.");
	                				row.removeClass("k-state-selected");
	    		                	row.find(".k-checkbox").prop( "checked", false );
	    	                		return;
	                			}
	                		}
	                	}
	                }/*else{
                		$scope.linkDataPreVO.dataSource.add({
                			CD_TEMPITEM:  dataItem.CD_TEMPITEM,
        					NM_MRK:       dataItem.NM_MRK,
        					NO_MNGMRK:    dataItem.NO_MNGMRK,
        					NO_MRKITEM:   dataItem.NO_MRKITEM,
        					S_ITEMPRC:    dataItem.S_ITEMPRC,
        					NM_ITEM:      dataItem.NM_ITEM,
                		});
                	}*/
	                 	                
	                dataItem.ROW_CHK = checked;
	                dataItem.dirty = checked;
	                
	                if (checked) {
	                	$scope.linkDataPreVO.dataSource.add({
                			CD_TEMPITEM:  dataItem.CD_TEMPITEM,
        					NM_MRK:       dataItem.NM_MRK,
        					NO_MNGMRK:    dataItem.NO_MNGMRK,
        					NO_MRKITEM:   dataItem.NO_MRKITEM,
        					S_ITEMPRC:    dataItem.S_ITEMPRC,
        					NM_ITEM:      dataItem.NM_ITEM,
                		});
	                	row.addClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", true );
	                } else {
	                	row.removeClass("k-state-selected");
	                	row.find(".k-checkbox").prop( "checked", false );
	                };
                };
                
                // 신규등록 눌렀을시
                $scope.newItemMapping = function(){
                	if($scope.linkDataPreVO.dataSource._data.length == 0){
                		alert("오픈마켓 상품은 1개 이상이어야 합니다.");
                		return;
                	}
	            	it05MappingItemVO.selectedCD_ITEM = "신규";
	            	it05MappingItemVO.selectedNM_ITEM = "신규";
	            	it05MappingItemVO.selectedS_ITEMPRC = "신규";
	            	
                };
                
                $scope.otherItemMapping = function(){
                	if($scope.linkDataPreVO.dataSource._data.length == 0){
                		alert("오픈마켓 상품은 1개 이상이어야 합니다.");
                		return;
                	}
	                alert();
                };
                
                
	            
	            var it05MappingItemVO = $scope.it05MappingItemVO = {
	            	selectedCD_ITEM: "",
	            	selectedNM_ITEM: "",
	            	selectedS_ITEMPRC: "",
	            	initLoad: function(bLoading) {
	            		var self = this;
	            		/*//self.ctgrId                   = resData.cfctData[0].ID_CTGR;

	            		if(bLoading) {
		                	angular.forEach($scope.it01ItemCfctGridVO, function (it01ItemCfctLocalGridVO, iIndex) {
		                		it01ItemCfctLocalGridVO = $scope.it01ItemCfctGridVO.addCommonGridVO(it01ItemCfctLocalGridVO, iIndex);
		                		$timeout(function() {
			                		if(!page.isWriteable()){
			                			var grid = $("#grid"+iIndex).data("kendoGrid");
            	    					grid.setOptions({editable : false});   
            	    					grid.hideColumn(2);
				    					$("#grid"+iIndex+" .k-grid-toolbar").hide();
				    					
				    				}
		                		});
		                    });
		                	
	            		}*/
	    	            
	            		self.doInquiry();
	            	}
	            };
	            
	            it05MappingItemVO.goSave = function(){
                	if($scope.linkDataPreVO.dataSource._data.length == 0){
                		alert("오픈마켓 상품은 1개 이상이어야 합니다.");
                		return;
                	}
                	var param = {TEMPITEM: $scope.linkDataPreVO.dataSource._data};
                	itMappingItemSvc.goSave(param, (it05MappingItemVO.selectedCD_ITEM == "신규")?"new":it05MappingItemVO.selectedCD_ITEM);
                };

	            it05MappingItemVO.doInquiry = function() {
	            	
	            };

	            var linkDataVO = $scope.linkDataVO = {
                    messages: {
                        noRows: "오픈마켓에서 가져온 데이터가 존재하지 않습니다.",
                        loading: "오픈마켓에서 가져온 데이터를 가져오는 중...",
                        requestFailed: "요청 데이터를 가져오는 중 오류가 발생하였습니다.",
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = { procedureParam:"USP_IT_05MAPPINGITEM_LIST_LINK" };
                				UtilSvc.getList(param).then(function (res) {
            						e.success(res.data.results[0]);       
            					});
                			},
                			create: function(e) {
                	        },
                			update: function(e) {
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
                    			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "NO_MRKITEM",
                				fields: {
                					ROW_CHK: {	type: "boolean", 
												editable: false,  
												nullable: false },
                					CD_TEMPITEM:  {  },
                					NM_MRK:       {  },
                					NO_MRKITEM:   {  },
                					S_ITEMPRC:    {  },
                					NM_ITEM:      {  },
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: [],
                	columns: [
						   {field: "ROW_CHK",
							title: " ",
							width: "40px",headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
        		           {field: "NM_MRK",   title: "마켓명",  width: 100,
   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
   	   					   {field: "NO_MRKITEM",   title: "마켓상품번호",  width: 100,
	   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "NM_ITEM",   title: "상품명",   width: 100, 
           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "S_ITEMPRC", title: "판매가", width: 100,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    editable : false,
                	rowTemplate: kendo.template($.trim($("#linkGrid_template").html())),
                	height: 360
                };
	            
	            var mmDataVO = $scope.mmDataVO = {
            		messages: {
                        noRows: "오픈마켓에서 가져온 데이터가 존재하지 않습니다.",
                        loading: "오픈마켓에서 가져온 데이터를 가져오는 중...",
                        requestFailed: "요청 데이터를 가져오는 중 오류가 발생하였습니다.",
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				var param = { procedureParam:"USP_IT_05MAPPINGITEM_LIST_MM" };
                    				UtilSvc.getList(param).then(function (res) {
                						e.success(res.data.results[0]);       
                					});
                			},
                			create: function(e) {
                	        },
                			update: function(e) {
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
                    			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "CD_ITEM",
                				fields: {
                					ROW_CHK:   {  type: "boolean", 
												  editable: false,  
												  nullable: false },
                					CD_ITEM:      {  },
                					NM_ITEM:      {  },
                					S_ITEMPRC:    {  }
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	toolbar: [],
                	columns: [
						   {field: "ROW_CHK",
							title: "<input class='k-checkbox' type='checkbox' id='grd_chk_mm' ng-click='onMmGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_mm' style='margin-bottom:0;'>​</label>",
							width: "40px",headerAttributes: {"class": "table-header-cell", style: "text-align: center; font-size: 12px; vertical-align:middle;"}},
   	   					   {field: "CD_ITEM",   title: "상품번호",  width: 100,
	   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "NM_ITEM",   title: "상품명",   width: 130, 
           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "S_ITEMPRC", title: "판매가", width: 70,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                    editable : false,
                	rowTemplate: kendo.template($.trim($("#mmGrid_template").html())),
                	height: 360
                };
	            
	            var linkDataPreVO = $scope.linkDataPreVO = {
                    messages: {
                        noRows: "오픈마켓에서 가져온 데이터가 존재하지 않습니다.",
                        loading: "오픈마켓에서 가져온 데이터를 가져오는 중...",
                        requestFailed: "요청 데이터를 가져오는 중 오류가 발생하였습니다.",
                    },
                    noRecords: true,
                	dataSource: new kendo.data.DataSource({
                		transport: {
                			read: function(e) {
                				
                			},
                			create: function(e) {
                	        },
                			update: function(e) {
                			},
                			destroy: function(e) {
                				var defer = $q.defer();
                    			return defer.promise;
                			},
                			parameterMap: function(e, operation) {
                				if(operation !== "read" && e.models) {
                					return {models:kendo.stringify(e.models)};
                				}
                			}
                		},
                		batch: true,
                		schema: {
                			model: {
                    			id: "CD_TEMPITEM",
                				fields: {
                					ROW_CHK: {	type: "boolean", 
												editable: true,  
												nullable: false },
                					CD_TEMPITEM:  {  },
                					NM_MRK:       {  },
                					NO_MRKITEM:   {  },
                					S_ITEMPRC:    {  },
                					NM_ITEM:      {  },
                				}
                			}
                		}
                	}),
                	navigatable: true,
                	editable : false,
                	toolbar: [],
                	columns: [
						   {field: "NM_MRK",   title: "마켓명",  width: 70,
   	   						headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
   	   					   {field: "NO_MRKITEM",   title: "마켓상품번호",  width: 100,
	   	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "NM_ITEM",   title: "상품명",   width: 100, 
           	   				headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		           {field: "S_ITEMPRC", title: "판매가", width: 80,
       	   					headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           	   				template:"<span style='float:right'>#: S_ITEMPRC #</span>"}
                	],
                    collapse: function(e) {
                        // console.log(e.sender);
                        this.cancelRow();
                    },
                	rowTemplate: kendo.template($.trim($("#linkPreGrid_template").html())),
                	height: 210
                };

	            $scope.it05MappingItemVO.initLoad(true);
            }]);
}());