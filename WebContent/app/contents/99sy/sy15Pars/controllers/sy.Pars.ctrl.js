(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Pars.controller : sy.ParsCtrl
     * 
     */
    angular.module("sy.Pars.controller")
        .controller("sy.ParsCtrl", ["$scope", "$cookieStore", "$http", "$q", "$log", "$state", "sy.ParsSvc", "sy.CodeSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", 
            function ($scope, $cookieStore, $http, $q, $log, $state, syParsSvc, SyCodeSvc,APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	           
	            var mrkName = $scope.mrkName = {
	                    boxTitle: "택배사관리",
	                	mngMrkDs: {
	                		autoBind: true,         
	    	    			dataTextField: "NM_DEF",
	                        dataValueField: "CD_DEF",
	    	    			dataSource: resData.csMrkDataSource,
	    	    			valuePrimitive: true,
	                	},
	                	mngMrkMd: resData.csMrkDataSource[0].CD_DEF
	                };
	            
	            var sy15ParsVO = $scope.sy15ParsVO = {
	            		ParsCodeList : [],
		            	initLoad: function(bLoading) {
		            		var self = this;
		            		//self.ctgrId                   = resData.cfctData[0].ID_CTGR;

		            		if(bLoading) {
			                	angular.forEach($scope.sy15ParsGridVO, function (sy15ParsLocalGridVO, iIndex) {
			                		sy15ParsLocalGridVO = $scope.sy15ParsGridVO.addCommonGridVO(sy15ParsLocalGridVO, iIndex);
			                		$timeout(function() {
				                		if(!page.isWriteable()){
				                			for(var i = 0 ; i < 3 ; i++){
					                			var grid = $("#grid"+i).data("kendoGrid");
					                			var op = {editable : false};
						    					grid.setOptions(op);
		            	    					grid.hideColumn(1);
						    					$("#grid"+i+" .k-grid-toolbar").hide();
				                			}
					    				}
			                		});
			                    });
			                	
		            		}
		            	}
		            };
	            
	            //검색
	            sy15ParsVO.search = function(e){
	            	var gridCheck = false;
	            	for( var i = 0; i < 3 ; i++ ){
	            		var grid = $("#grid"+i).data("kendoGrid").dataSource;
	            		if( grid.hasChanges() ){
	            			if(confirm('수정된 사항이 있습니다.\n저장하시겠습니까?')){
	            				gridCheck = true;
	            				break;
	            			}else{
	            				for( var j = 0; j < 3 ; j++ ){
	        	            		var acgrid = $("#grid"+j).data("kendoGrid");
	        	            		acgrid.dataSource.transport.read();
	        	            	}
	            				return;
	            			}
	            		}
	            	}
	            	if( gridCheck ){
	            		for( var i = 0; i < 3 ; i++ ){
    	            		var acgrid = $("#grid"+i).data("kendoGrid").dataSource;
    	            		acgrid.sync();
    	            	}
	            		return;
	            	}else{
	            		for( var j = 0; j < 3 ; j++ ){
    	            		var acgrid = $("#grid"+j).data("kendoGrid");
    	            		acgrid.dataSource.transport.read();
    	            	}
	            		return;
	            	}
	            	
	            };	 
	             
	            //초기화버튼
	            sy15ParsVO.inIt = function(){
	            	var self = this;
	            	var gridCheck = false;
	            	for( var i = 0; i < 3 ; i++ ){
	            		var grid = $("#grid"+i).data("kendoGrid").dataSource;
	            		if( grid.hasChanges() ){
	            			if(confirm('수정된 사항이 있습니다.\n초기화 하시겠습니까?')){
	            				grid.cancelChanges();
	            			}else{
	            				return;
	            			}
	            		}
	            	}
	            	mrkName.mngMrkMd = resData.csMrkDataSource[0].CD_DEF;
	            	self.search();
	            };
	            
	            sy15ParsVO.dropDownEditor = function(container, options, objDataSource, arrField) {
		       		$('<input required name='+ options.field +' data-bind="value:' + options.field + '" />')
		    		.appendTo(container)
		    		.kendoDropDownList({
		    			autoBind: true,
		    			dataTextField: arrField[0],
                        dataValueField: arrField[1],
		    			dataSource: objDataSource,
		    			valuePrimitive: true
		    		});
                };
                
                sy15ParsVO.fTemplate = function(e, objDataSource, arrField) {
                	var nmd = (!e[arrField[2]].hasOwnProperty(arrField[0])) ?  e[arrField[2]] : "";
	       		    var grdData = objDataSource;	
		       		for(var i = 0, leng=grdData.length; i<leng; i++){
		       			if(grdData[i][arrField[0]] === e[arrField[2]]){
		       				nmd = grdData[i][arrField[1]];
		       				break;
		       			}
		       		}	
                	return nmd;
                };

					var sy15ParsGridVO = $scope.sy15ParsGridVO = [{
		        			boxTitle: "발송"
			            },
			            {
			            	boxTitle: "회수"
			            },
			            {
			            	boxTitle: "재발송"
			            }
			        ];

		            sy15ParsGridVO.addCommonGridVO = function(sy15ParsLocalGridVO, iIndex) {
		            	var localSelf = sy15ParsLocalGridVO;
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
		            	/*localSelf.pageable                 = {
					    	messages: UtilSvc.gridPageableMessages,
					    	buttonCount: 10
					    };*/
		            	//localSelf.enableRowSelection       = true;
		            	//localSelf.enableRowHeaderSelection = false;
		            	//localSelf.multiSelect              = false;
		            	//localSelf.editable                 = false;
		            	//localSelf.selected                 = null;
		            	localSelf.height                   = 642;
		            	localSelf.dataSource = new kendo.data.DataSource({
		            		autoBind: false,
		            		batch : true,
	        				transport: {
	        					read: function(e) {
	        						var ls = localSelf;
        							var	param = {
        			                    	procedureParam: "MarketManager.USP_SY_15PARS01_GET&NO_MRK@s|L_FLAG@s",
        			                    	NO_MRK:$scope.mrkName.mngMrkMd,
        			                    	L_FLAG : String(ls.iIndex)
        			                    };
        			            		UtilSvc.getList(param).then(function (res) {
        			            			sy15ParsVO.ParsCodeList = res.data.results[1];
        			            			ls.dataSource.data(res.data.results[0]);
        							});
	        					},
	        					create: function(e) {
	        						var self = this;
	        						syParsSvc.savePars(e.data.models, "I").success(function () {
	        							self.read(e);
	                                });
		            			},
	                			update: function(e) {
	                				var self = this;
	                				syParsSvc.savePars(e.data.models, "U").success(function () {
	                					self.read(e);
	                                });
	                			},
	                			destroy: function(e) {
	                				var self = this,
	                					defer = $q.defer();
	                				syParsSvc.savePars(e.data.models, "D").success(function () {
	                					self.read(e);
	            						defer.resolve();
	                                });
	                    			return defer.promise;
	                			},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
	        				},
	        				/*pageSize: 10,*/
	        				schema: {
	        					model: {
	            					id:"CD_DEF",
	            					fields: {
	            						CD_CLS: {type:"string"},
	            						CD_DEF: {type:"string"},
	            						DC_RMK1: {type:"string"},
	            						DC_RMK2: {type:"string",
	            							validation: {
												cd_parsvalidation: function (input) {
													if (input.is("[name='DC_RMK2']") && input.val().length == 0) {
														input.attr("data-cd_parsvalidation-msg", "택배사를 선택해주세요.");
	                                                    return false;
													}
													if (input.is("[name='DC_RMK2']")) {
	  									    			var grid = $("#grid"+localSelf.iIndex).data("kendoGrid").dataSource;
	  													var check = 0;
		  												for(var i = 0 ; i < grid._data.length; i++){
		  													if(input[0].value == grid._data[i].DC_RMK2) check++;
		  													if(check >= 2){
		  														input.attr("data-cd_parsvalidation-msg", "택배사가 중복됩니다.");
		  	                                                    return false;
		  													}
		  												}
	                                                }
	  									    		return true;
										    	  	}
											}},
	            						DC_RMK3: {type:"string"}
	            					}
	        					}
	        				},
	        			});
		            	localSelf.editable = {
		            		confirmation:false
		            	};
		            	localSelf.toolbar = 
	                		["create", "save", "cancel"];
		            	localSelf.columns  = [
		              		{
		              			field: "DC_RMK2", 
		              			title: "택배사", 
		              			width: 300,
								cellClass: "ta-c",
								headerAttributes: {"class": "table-header-cell" ,style: "text-align: center; font-size: 12px"},
								editor: function(container, options) {
									sy15ParsVO.dropDownEditor(container, options, sy15ParsVO.ParsCodeList, ["NM_DEF","CD_DEF"]);
	           		        	},
	           		        	template: function(e){
	          		       	   		return sy15ParsVO.fTemplate(e, sy15ParsVO.ParsCodeList, ["CD_DEF", "NM_DEF", "DC_RMK2"]);
	          		       	  	},
		              		},
		              		{command: [ {
		                        name: "삭제", imageClass: "k-icon k-i-close", click: function (e) {  //삭제 버튼
		                            e.preventDefault();
	                            	if (confirm('정말 삭제 하시겠습니까?')) { // 빈거 지울때 안내메시지 바꾸려면
		                                var dataSource = $("#"+e.delegateTarget.id).data("kendoGrid").dataSource,
		                                	dataItem = this.dataItem($(e.target).closest("tr"));
		                                dataSource.remove(dataItem);
		                            }
		                        }
		                    } ],minwidth:10}
	            		];
		            	localSelf.edit = function(e) {
		            		var self = this;
		            		if(self._data[0].DC_RMK1 == ""){
		            			self._data[0].DC_RMK1 = $scope.mrkName.mngMrkMd;
		            			if(self.options.boxTitle == "발송"){
		            				self._data[0].DC_RMK3 = "001";
		            			}else if(self.options.boxTitle == "회수"){
		            				self._data[0].DC_RMK3 = "002";
		            			}else if(self.options.boxTitle == "재발송"){
		            				self._data[0].DC_RMK3 = "003";
		            			}
		            		}
	                	};
	                	
	                	return localSelf;
		            };
		            $scope.sy15ParsVO.initLoad(true);
           }]);                              
}());
		