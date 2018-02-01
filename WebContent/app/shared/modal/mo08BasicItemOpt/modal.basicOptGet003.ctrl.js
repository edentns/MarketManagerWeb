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
        	
        	var bssOpt003VO = $scope.bssOpt003VO = {
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
        		dataSource: new kendo.data.DataSource({
            		transport: {
            			read: function(e) {
            				var param = {
                					procedureParam:"USP_IT_02BSSITEMBSSOPT_SEARCH&L_SEARCH_TYPE@s|L_SEARCH_WORD@s|L_FLAG@s",
                					L_SEARCH_TYPE :	bssOpt003VO.selectedCode,
                					L_SEARCH_WORD : bssOpt003VO.searchWord,
                					L_FLAG: "002"
                                };
        					UtilSvc.getList(param).then(function (res) {
        						e.success(res.data.results[0]);
        					});
            			},
                		create: function(e) {
                			itBssItemSvc.saveBssOpt(e.data.models, "I").success(function () {
                				$scope.bssOpt003VO.dataSource.read();
                            });
            			},
            			update: function(e) {
            				itBssItemSvc.saveBssOpt(e.data.models, "U").success(function () {
                				$scope.bssOpt003VO.dataSource.read();
                            });
            			},
            			destroy: function(e) {
            				var defer = $q.defer();
            				itBssItemSvc.saveBssOpt(e.data.models, "D").success(function () {
        						defer.resolve();
        						$scope.bssOpt003VO.dataSource.read();
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
			            		    			dataSource: bssOpt003VO.optClftList,
			            		    			valuePrimitive: true
			            		    		});
		          		       	   	  }, template: function(e){
		            		       		    var cd_opt = e.CD_OPTCLFT,
	            		       		    	nmd    = "";
	            		       		    if(cd_opt){
	            		       		    	var optData = bssOpt003VO.optClftList;
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
	            		    			dataSource: bssOpt003VO.optClftList,
	            		    			valuePrimitive: true
	            		    		});
          		       	   	  }	 ,  template: function(e){
            		       		    var cd_opt = e.L_CD_OPTCLFT,
            		       		    	nmd    = "";
            		       		    if(cd_opt){
            		       		    	var optData = bssOpt003VO.optClftList;	
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
            	
            	doConfirm : function () {
					var self = this,
						CD_OPTS = [];
					var grid = $("#gridVO").data("kendoGrid").dataSource;
					if(grid.hasChanges()){
						alert("변경사항이 있습니다");
						return;
					}
					for(var i = 0; i<self.dataSource._data.length; i++){
						if(self.dataSource._data[i].ROW_CHK){
							self.dataSource._data[i].QT_SSPL = 0;
							self.dataSource._data[i].S_ITEMPRC = self.dataSource._data[i].AM_SALE;
							CD_OPTS.push(self.dataSource._data[i]);
						}
					}
					$modalInstance.close( CD_OPTS );
				},
				
				doCancle : function() {
					$modalInstance.dismiss( "cancel" );
				}
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
        	

        	bssOpt003VO.initLoad();
            }]);
}());
