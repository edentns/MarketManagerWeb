(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Code.controller : sy.CodeCustomCtrl
     * 코드관리 - 사용자코드관리
     */
    angular.module("edtApp.common.modal")
        .controller("modal.basicOptGet002Ctrl", ["$scope","$modal", "$modalInstance", "$http", "$log", "$timeout", "$q", "sy.CodeSvc", "APP_CODE","UtilSvc","it.BssItemSvc",
            function ($scope, $modal, $modalInstance, $http, $log, $timeout, $q, SyCodeSvc, APP_CODE, UtilSvc, itBssItemSvc) {
        	
        	var bssOpt002VO = $scope.bssOpt002VO = {
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
                					L_SEARCH_TYPE :	bssOpt002VO.selectedCode,
                					L_SEARCH_WORD : bssOpt002VO.searchWord,
                					L_FLAG: "001"
                                };
        					UtilSvc.getList(param).then(function (res) {
        						e.success(res.data.results[0]);
        					});
            			},
                		create: function(e) {
                			itBssItemSvc.saveBssOpt(e.data.models, "I").success(function () {
                				$scope.bssOpt002VO.dataSource.read();
                            });
            			},
            			update: function(e) {
            				itBssItemSvc.saveBssOpt(e.data.models, "U").success(function () {
                				$scope.bssOpt002VO.dataSource.read();
                            });
            			},
            			destroy: function(e) {
            				var defer = $q.defer();
            				itBssItemSvc.saveBssOpt(e.data.models, "D").success(function () {
        						defer.resolve();
        						$scope.bssOpt002VO.dataSource.read();
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
							    QT_SSPL: { type : "number" },
							    AM_SALE: { type : "number" },
							    NO_MD : { }
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
					   { field : "CD_OPTCLFT", title: "옵션구분", width: "160",
						   editor: 
	          		       		  function (container, options) {
		            		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
		            		    		.appendTo(container)
		            		    		.kendoDropDownList({
		            		    			autoBind: false,
		            		    			dataTextField: "NM_DEF",
		                                    dataValueField: "CD_DEF",
		            		    			dataSource: bssOpt002VO.optClftList,
		            		    			valuePrimitive: true
		            		    		});
	          		       	   	  }, template: function(e){
	            		       		    var cd_opt = e.CD_OPTCLFT,
            		       		    	nmd    = "";
            		       		    if(cd_opt){
            		       		    	var optData = bssOpt002VO.optClftList;	
	                		       		for(var i = 0, leng=optData.length; i<leng; i++){
                		       			   if(optData[i].CD_DEF === e.CD_OPTCLFT){
                		       				 nmd = optData[i].NM_DEF;	
                		       			   }
	                		       		}	
            		       		    }
    	            		        return nmd;
	            		        }},
       		           { field : "NM_OPT", title: "옵션명", width: "160" },
       		           { field : "NO_MD", title: "모델 NO.", width: "160" },
       		           { field : "AM_SALE", title: "판매가 (+ , -)", width: "160" },
       		           { field : "QT_SSPL", title: "", hidden:true },
                       {command: [ "destroy" ]}
            	],
                collapse: function(e) {
                    // console.log(e.sender);
                    this.cancelRow();
                },
            	editable: true,
            	height: 360,
            	init: function() {
            		var self = this;
            		SyCodeSvc.getSubcodeList({cd: "IT_000010", search: "all"}).then(function (result) {
						self.searchCodeList = result.data;
                    });
            		SyCodeSvc.getSubcodeList({cd: "IT_000011", search: "all"}).then(function (result) {
						self.optClftList = result.data;
                    });
				},
				doConfirm : function () {
					var self = this;
					var CD_OPTS = [];
					for(var i = 0; i<self.dataSource._data.length; i++){
						if(self.dataSource._data[i].ROW_CHK == true){
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
            
        	bssOpt002VO.init();
            }]);
}());
