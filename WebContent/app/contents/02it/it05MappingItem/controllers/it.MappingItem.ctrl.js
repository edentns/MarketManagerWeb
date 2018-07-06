(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.MappingItem.controller : it.MappingItemCtrl
     * 상품분류관리
     */
    angular.module("it.MappingItem.controller")
        .controller("it.MappingItemCtrl", ["$scope", "$http", "$q", "$log", "it.ItemCfctSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc",
            function ($scope, $http, $q, $log, itItemCfctSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            //kendo grid 체크박스 옵션
                $scope.onMmGrdCkboxClick = function(e){
	                var element =$(e.currentTarget);
	                
	                var checked = element.is(':checked'),
	                	row = element.closest("tr"),
	                	grid = $scope.mmDataVO,
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
                $scope.onMmGrdCkboxAllClick = function(e){
	                var i = 0,
	                	element = $(e.currentTarget),
	                	checked = element.is(':checked'),
	                	row = element.parents("div").find(".k-grid-content table tr"),
	                	grid = $scope.mmDataVO,
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
	            
	            var it05MappingItemVO = $scope.it05MappingItemVO = {
            		chFlag  : true,
            		gridNum : "999",
	            	boxTitle: "검색",
	            	ctgrId: [""],
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
	                				/*e.success(resData.optDataList);*/
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
	                	toolbar: [],
	                	columns: [
							   {field: "ROW_CHK",
								title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onMmGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",
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
	                    editable : true,
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
													  editable: true,  
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
								title: "<input class='k-checkbox' type='checkbox' id='grd_chk_master' ng-click='onMmGrdCkboxAllClick($event)'><label class='k-checkbox-label k-no-text' for='grd_chk_master' style='margin-bottom:0;'>​</label>",
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
	                    editable : true,
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
	                				/*e.success(resData.optDataList);*/
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
	                	toolbar: [],
	                	columns: [
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
	                	rowTemplate: kendo.template($.trim($("#linkPreGrid_template").html())),
	                	height: 230
	                };

	            $scope.it05MappingItemVO.initLoad(true);
            }]);
}());