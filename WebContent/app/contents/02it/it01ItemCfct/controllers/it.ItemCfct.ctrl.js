(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name it.ItemCfct.controller : it.ItemCfctCtrl
     * 상품분류관리
     */
    angular.module("it.ItemCfct.controller")
        .controller("it.ItemCfctCtrl", ["$scope", "$http", "$q", "$log", "it.ItemCfctSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc",
            function ($scope, $http, $q, $log, itItemCfctSvc, APP_CODE, $timeout, resData, Page, UtilSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            num = 0;
	            
	            $(document).on('click', '.k-textbox', function () {
	                var self = this,
	                	inx  = 0,
	                	VO   = $scope.it01ItemCfctGridVO;
	                for(var i=0; i< VO.length;i++){
	                	if( VO[i].dataSource._data[0] && VO[i].dataSource._data.length != 0){
	                		if(VO[i].dataSource._data[0].ID_CTGR == ""){
	                			inx = i+1;
	                		}
	                	}
	                }
	                if(inx-1 >= 0){
		                if(VO[inx-1].dataSource._data[0].ID_CTGR == ""){
			                for(; VO.length > inx; inx++) {
			        			it01ItemCfctGridVO[inx].dataSource.data([]);
							}
		                }
	                }
	            });
	            
	            $(document).on("click", ".cell", function(e) {
	            	if($scope.it01ItemCfctVO.chFlag){
	            		var grid = $("#grid"+e.currentTarget.id).data("kendoGrid");
						grid.cancelChanges();
	            	}else{
	            		$scope.it01ItemCfctVO.gridNum = e.currentTarget.id;  
	            	}
	            	$scope.it01ItemCfctVO.chFlag = false;
	            });
	            
	            var gridCheck = function(gridNum) {
	            	/*if($scope.it01ItemCfctVO.gridNum == "999" || $scope.it01ItemCfctVO.gridNum == gridNum){  //초기상태 =999, 현재 수정중인 그리드 와 버튼을 누른 그리드 같은지 판별
	                	return true;
	                }else{
	                	alert("다른그리드 수정중");
	                	return false;
	                }*/
	            	if($scope.it01ItemCfctVO.gridNum != "999"){
	            		var grid = $("#grid"+$scope.it01ItemCfctVO.gridNum).data("kendoGrid").dataSource;
	            		var f = grid.hasChanges();
		            	if( $scope.it01ItemCfctVO.gridNum == gridNum || !grid.hasChanges()){  //초기상태 =999, 현재 수정중인 그리드 와 버튼을 누른 그리드 같은지 판별
		                	return true;
		                }else{
		                	alert("다른그리드 수정중");
		                	return false;
		                }
	            	}else{
	            		return true;
	            	}
				};
	            
	            var it01ItemCfctVO = $scope.it01ItemCfctVO = {
	            		chFlag  : true,
	            		gridNum : "999",
		            	boxTitle: "검색",
		            	ctgrId: [""],
		            	initLoad: function(bLoading) {
		            		var self = this;
		            		self.ctgrId                   = resData.cfctData[0].ID_CTGR;

		            		if(bLoading) {
			                	angular.forEach($scope.it01ItemCfctGridVO, function (it01ItemCfctLocalGridVO, iIndex) {
			                		it01ItemCfctLocalGridVO = $scope.it01ItemCfctGridVO.addCommonGridVO(it01ItemCfctLocalGridVO, iIndex);
			                    });
		            		}
		    	            
		            		self.doInquiry();
		            	},
		            	
		            	modal: function() {   // 팝업 버튼
		            		 var NO_MNGMRK,
		            		     param = {
			    					procedureParam: "MarketManager.USP_MA_04MNGMRK01_GET"
			    				 };
		            		 UtilSvc.getList(param).then(function (res) {
		    					 NO_MNGMRK = res.data.results[0][0].NO_MNGMRK;
			            		 itItemCfctSvc.modal(NO_MNGMRK);
							 });
						},
						
						add : function(e) {   // 추가 버튼
							var self = this;
							var grid = $("#grid"+e).data("kendoGrid");
							if(gridCheck(e)){
								$scope.it01ItemCfctVO.gridNum = e;
		                    	grid.addRow();
							}
						},
						
						cancel: function(e) {   // 취소 버튼
							var self = this;
							var grid = $("#grid"+e).data("kendoGrid");
							if(gridCheck(e)){
								grid.cancelChanges();
			                	$scope.it01ItemCfctVO.gridNum="999";
							}
						},
						
						save: function(e) {   // 저장 버튼
							var self = this;
							var grid = $("#grid"+e).data("kendoGrid");
	                		if(gridCheck(e)){
		                	    if (confirm("저장 하시겠습니까?")) {
		                	    	grid.saveChanges();
		                	    	$scope.it01ItemCfctVO.gridNum="999";
		                	    }
	                		}
						}
		            };
		            
		            it01ItemCfctVO.doInquiry = function() {
		            	$scope.it01ItemCfctGridVO.doGetList(''
	            			, 0      // 처음부터
	            			, function(res){
		    					//alert("조회 성공하였습니다.");
	            			}
	            		);
		            };

					var it01ItemCfctGridVO = $scope.it01ItemCfctGridVO = [{
		        			boxTitle: "대분류",
		                    selectable: "multipleLarge"
			            },
			            {
			            	boxTitle: "중분류",
		                    selectable: "multipleMedium"
			            },
			            {
			            	boxTitle: "소분류",
		                    selectable: "multipleSmall"
			            }
			        ];

		            it01ItemCfctGridVO.addCommonGridVO = function(it01ItemCfctLocalGridVO, iIndex) {
		            	var localSelf = it01ItemCfctLocalGridVO;
		            	localSelf.iIndex = iIndex;
		            	localSelf.messages = {
	        				noRows: "정보가 존재하지 않습니다.",
	        				loading: "정보를 가져오는 중...",
	        				requestFailed: "정보를 가져오는 중 오류가 발생하였습니다.",
	        				retry: "갱신",
	        				commands: {
	                            create: '추가',
	                            destroy: '삭제',
	                            save: '저장',
	                            cancel: '취소'
	                        },
	        			};
		            	localSelf.navigatable              = true;
		            	localSelf.pageable                 = true;
		            	//localSelf.enableRowSelection       = true;
		            	//localSelf.enableRowHeaderSelection = false;
		            	//localSelf.multiSelect              = false;
		            	//localSelf.editable                 = false;
		            	//localSelf.selected                 = null;
		            	localSelf.change                   = rowClick;
		            	localSelf.height                   = 317;
		            	localSelf.flag                     = true;
		            	localSelf.dataSource = new kendo.data.DataSource({
		            		autoBind: false,
	        				transport: {
	        					read: function(e) {
	        						
	        					},
	        					create: function(e) {
	        						var param = [];
	                				param.push(e.data);
	        						itItemCfctSvc.saveCtgr(param, "I").success(function () {
	                    				$scope.it01ItemCfctVO.doInquiry();
	                                });
		            			},
	                			update: function(e) {
	                				var param = [];
	                				param.push(e.data);
	                				itItemCfctSvc.saveCtgr(param, "U").success(function () {
	                    				$scope.it01ItemCfctVO.doInquiry();
	                                });
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
	                				var param = [];
	                				param.push(e.data);
	                				itItemCfctSvc.saveCtgr(param, "D").success(function () {
	            						defer.resolve();
	                    				$scope.it01ItemCfctVO.doInquiry();
	                                });
	                    			return defer.promise;
	                			},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	        				},
	        				pageSize: 10,
	        				schema: {
	        					model: {
	            					id:"ID_CTGR",
	            					fields: {
	            						ID_CTGR: {type:"string"},
	            						NM_CTGR: {type:"string",validation: {required: true}},
	            						ID_HRNKCTGR: {defaultValue: ""},
	            						YN_USE : {defaultValue: "Y"},
	            						YN_DEL : {defaultValue: "N"}
	            					}
	        					}
	        				},
	        			});
		            	localSelf.editable = {confirmation:false};
		            	localSelf.pageable = {
	        				buttonCount: 10
	        			};
		            	localSelf.toolbar = 
	                		[{ template: "<div ng-click='it01ItemCfctVO.add("+localSelf.iIndex+")' class='k-button k-button-icontext'><span class='k-icon k-i-add'></span>추가</div>"},
	                		 { template: "<div ng-click='it01ItemCfctVO.save("+localSelf.iIndex+")' class='k-button k-button-icontext'><span class='k-icon k-i-update'></span>저장</div>"},
	                		 { template: "<div ng-click='it01ItemCfctVO.cancel("+localSelf.iIndex+")' class='k-button k-button-icontext'><span class='k-icon k-i-cancel'></span>취소</div>"}];
		            	localSelf.columns  = [
		              		{
		              			field: "ID_CTGR", 
		              			title: "카테고리아이디", 
		              			width: 100,
								cellClass: "ta-c",
								hidden: true,
								headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"}
		              		},
		            			{
		              			field: "NM_CTGR",
		              			title: localSelf.boxTitle, 
		              			width: 100, 
								cellClass: "ta-c",
								headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
								template: "<div class='cell' id='"+localSelf.iIndex+"' >#=NM_CTGR#</div>"
		              		},{command: [ {
		                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
		                            e.preventDefault();
		                            var dataItem = this.dataItem($(e.target).closest("tr"));
		                            if(gridCheck(this.options.iIndex)){
		                            	if (confirm('하위 분류도 같이 삭제 됩니다\n삭제 하시겠습니까?')) { // 빈거 지울때 안내메시지 바꾸려면
			                                var dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource;
			                                dataSource.remove(dataItem);
			                                /*dataSource.sync();*/  //바로 반영
			                            }
		                            }
		                            
		                        }
		                    } ],width:19}
	            		];
		            	localSelf.edit = function(e) {
		            		var self = this
		            	      , iIndex = self.options.iIndex+1;
		            		
		            		if(e.container["0"].id == ""){
		            			if(e.sender.options.iIndex > 0){
		            				var grid = $("#grid"+(iIndex-2)).data("kendoGrid");
		            				var selectedItem = grid.dataItem(grid.select());
		            				var ID_HRNKCTGR = selectedItem.ID_CTGR;
		            				e.model.set("ID_HRNKCTGR", ID_HRNKCTGR);
		            			}
		            		}
		            		for(;it01ItemCfctGridVO.length > iIndex; iIndex++) {
		            			it01ItemCfctGridVO[iIndex].dataSource.data([]);
	    					}
		            		localSelf.flag = true;
	                	};
		            	localSelf.dataBound = function(e) {
		            		/*if($scope.it01ItemCfctVO.gridNum == ""){
		            			$scope.it01ItemCfctVO.gridNum = e.sender.options.iIndex;
		            		}*/
		            		var self = this;
		            		if(!localSelf.flag || (e.sender.dataSource._data[0] && e.sender.dataSource._data[0].ID_CTGR == "")) {
		            			localSelf.flag = false;
		            			return;
		            		}
		            		e.sender.select("tr:eq(0)");
	                	};
	                	
	                	return localSelf;
		            };

		            it01ItemCfctGridVO.doGetList = function(strIdCtgr, iIndex, fnThen) {
		            	var self = this,
		            		nextIndex = iIndex+1;
		            	var param = {
	    					procedureParam: "MarketManager.USP_IT_01ITEMCFCT02_GET&IT_ID_CTGR@s",
	    					IT_ID_CTGR: strIdCtgr
	    					};
			            	
		    				UtilSvc.getList(param).then(function (res) {
		    					self[iIndex].dataSource.data(res.data.results[0]);
		    					num++;
		    					
		    					if(num == self.length){
		    						$scope.it01ItemCfctVO.gridNum = "999";
		    					}
		    					
		    					if(self.length === nextIndex) {
		    						fnThen(res);
		    					}
	
		    					for(;self.length > nextIndex; nextIndex++) {
		    						self[nextIndex].dataSource.data([]);
		    					}
							});
		            };

				    var rowClick = function( arg ) {
				    	
				    	if( gridCheck( arg.sender.options.iIndex ) ){
				    		
				    		var selected = $.map(this.select(), function(item) {
					    		var innerValue = new Array();
					    		innerValue[0]=item.childNodes[0].innerText;
					    		innerValue[1]=item.childNodes[1].innerText;
					    		return innerValue;
					        }),
					        nextIndex = arg.sender.options.iIndex+1;
					    	
					        if(!selected[0] == ""){  //추가된 row인지 판별
					        	if($scope.it01ItemCfctGridVO.length > nextIndex) {
					            	$scope.it01ItemCfctGridVO.doGetList(selected[0]
					        			, nextIndex
					        			, function(res){
					    					//alert("조회 성공하였습니다.");
					        			}
					        		);
						    	}
					        };
				    	}else{
				    		$scope.it01ItemCfctVO.chFlag = true;
		                }
				    	
				    	
					};
		            $scope.it01ItemCfctVO.initLoad(true);
            }]);
}());