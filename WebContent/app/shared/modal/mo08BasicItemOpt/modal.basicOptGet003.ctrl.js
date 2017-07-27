(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.basicOptGet003Ctrl", ["$scope","$modal", "$modalInstance", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE", "UtilSvc", "it.BssItemSvc",
            function ($scope, $modal, $modalInstance, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc, itBssItemSvc) {
        	
        	var gridCusCodeVO = $scope.gridCusCodeVO = {
    			NO_MNGCDHD   : "SYCH00038",
                CD_CLS   : "IT_000011",
                selectedCode   : "CD_OPTCLFT",
                deleteData : [],
                searchCodeList : [],
                optClftList : [],
                messages: {
        			noRows: "옵션구분이 존재하지 않습니다.",
        			loading: "옵션구분을 가져오는 중...",
                    requestFailed: "옵션구분을 가져오는 중 오류가 발생하였습니다.",
        			commands: {
        				create: '추가',
        				save: '저장',
        				cancel: '취소',
        				destroy: '삭제'
        			}
        		},
        		edit: function (e) {
                    if (e.model.isNew()) {
                    	if(e.model.CD_CLS == ""){
                    		/*e.model.set("YN_USE", "Y");
                    		e.model.set("NO_MNGCDHD", $scope.gridCusCodeVO.NO_MNGCDHD);
                    		e.model.set("CD_CLS", $scope.gridCusCodeVO.CD_CLS);*/
                    	}
                    }
        		},
        		dataSource: new kendo.data.DataSource({
            		transport: {
            			read: function(e) {
            				var param = {
                					procedureParam:"MarketManager.USP_IT_02BSSITEMBSSOPT_SEARCH&L_SEARCH_TYPE@s|L_SEARCH_WORD@s|L_FLAG@s",
                					L_SEARCH_TYPE :	gridCusCodeVO.selectedCode,
                					L_SEARCH_WORD : gridCusCodeVO.searchWord,
                					L_FLAG: "002"
                                };
        					UtilSvc.getList(param).then(function (res) {
        						e.success(res.data.results[0]);
        					});
            			},
                		create: function(e) {
                			itBssItemSvc.saveBssOpt(e.data.models, "I").success(function () {
                				$scope.gridCusCodeVO.dataSource.read();
                            });
            			},
            			update: function(e) {
            				itBssItemSvc.saveBssOpt(e.data.models, "U").success(function () {
                				$scope.gridCusCodeVO.dataSource.read();
                            });
            			},
            			destroy: function(e) {
            				var defer = $q.defer();
            				itBssItemSvc.saveBssOpt(e.data.models, "D").success(function () {
        						defer.resolve();
        						$scope.gridCusCodeVO.dataSource.read();
                            });
                			return defer.promise;
            			},
            			parameterMap: function(e, operation) {
            				
            			}
            		},
            		batch: true,
            		schema: {
            			model: {
            				id: "CD_OPT",
            				fields: {
            					ROW_CHK: {	
            						type: "boolean", 
									editable: false,  
									nullable: false
							    },
							    NM_OPT: { },
							    CD_OPT: { },
							    CD_OPTCLFT: { },
							    AM_SALE: { type : "number" },
							    NO_MD : { },
							    L_CD_OPT:     {  },
            					L_CD_OPTCLFT: {  },
            					L_NM_OPT:     {  },
            				}
            			}
            		}
            	}),
            	navigatable: true,
            	toolbar: 
            		["create", "save", "cancel"],
            	columns: [
            	       { field: "ROW_CHK", title: "선택", width: "70",
							template:"<input type='checkbox' class='checkbox' ng-click='onCsGrdCkboxClick($event)'/>" }, 
						{ field : "CD_OPTCLFT", title: "옵션구분1", width: "160",
							   editor: 
		          		       		  function (container, options) {
			            		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
			            		    		.appendTo(container)
			            		    		.kendoDropDownList({
			            		    			autoBind: false,
			            		    			dataTextField: "NM_DEF",
			                                    dataValueField: "CD_DEF",
			            		    			dataSource: gridCusCodeVO.optClftList,
			            		    			valuePrimitive: true
			            		    		});
		          		       	   	  }, template: function(e){
		            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = gridCusCodeVO.optClftList;
		                		       		for(var i = 0, leng=optData.length; i<leng; i++){
	                		       			   if(optData[i].CD_DEF === e.CD_OPTCLFT){
	                		       				 nmd = optData[i].NM_DEF;
	                		       			   }
		                		       		}	
	            		       		    }
	    	            		        return nmd;
		            		        }},
					   { field : "NM_OPT", title: "옵션명1", width: "160" },
        		       { field: "L_CD_OPTCLFT",   title: "옵션구분2", width: 150,
   							headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           		        editor: 
          		       		  function (container, options) {
	            		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
	            		    		.appendTo(container)
	            		    		.kendoDropDownList({
	            		    			autoBind: false,
	            		    			dataTextField: "NM_DEF",
	                                    dataValueField: "CD_DEF",
	            		    			dataSource: gridCusCodeVO.optClftList,
	            		    			valuePrimitive: true
	            		    		});
          		       	   	  }	 ,  template: function(e){
            		       		    var cd_opt = e.L_CD_OPTCLFT,
            		       		    	nmd    = "";
            		       		    if(cd_opt){
            		       		    	var optData = gridCusCodeVO.optClftList;	
	                		       		for(var i = 0, leng=optData.length; i<leng; i++){
                		       			   if(optData[i].CD_DEF === e.L_CD_OPTCLFT){
                		       				 nmd = optData[i].NM_DEF;	
                		       			   }
	                		       		}	
            		       		    }
    	            		        return nmd;
	            		        }},
            		        {field: "L_NM_OPT",   title: "옵션명2",  width: 100,
		            		 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		            {field: "NO_MD",   title: "모델 NO",   width: 100, 
           	   				 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}},
        		            {field: "AM_SALE", title: "판매가 (+,-)", width: 100,
       	   					 headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
           	   				 template:"<span style='float:right'>#: AM_SALE #</span>"},
           	   				{command: [ "destroy" ]}
            	],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
            	editable: true,
            	height: 360,
            	
            	initLoad: function() {
            		var self = this;
            		SyCodeSvc.getSubcodeList({cd: "IT_000010", search: "all"}).then(function (result) {
						self.searchCodeList = result.data;
                    });
            		SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
						self.optClftList = result.data;
                    });
            		
            	},
            };
        	
        	$scope.onCsGrdCkboxClick = function(e){
                var element =$(e.currentTarget);
                
                var checked = element.is(':checked'),
                	row = element.closest("tr"),
                	grid = $scope.gridVO,
                	dataItem = grid.dataItem(row);
                 	                
                dataItem.ROW_CHK = checked;
                
                if (checked) {
                	row.addClass("k-state-selected");
                } else {
                	row.removeClass("k-state-selected");
                };
            };
        	

        	gridCusCodeVO.initLoad();
            }]);
}());
