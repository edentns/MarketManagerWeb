(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.Pars.controller : sy.ParsCtrl
     * 
     */
    angular.module("sy.Pars.controller")
        .controller("sy.ParsCtrl", ["$scope", "$cookieStore", "$http", "$q", "$log", "$state", "sy.ParsSvc", "sy.CodeSvc", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc", 
            function ($scope, $cookieStore, $http, $q, $log, $state, saParsSvc, SyCodeSvc,APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday(),
		            menuId = MenuSvc.getNO_M($state.current.name);
	           
	            var syParsVO = $scope.syParsVO = {
	                    boxTitle: "택배사관리",
	                	mngMrkDs: {
	                		autoBind: true,         
	    	    			dataTextField: "NM_MRK",
	                        dataValueField: "NO_MRK",
	    	    			dataSource: new kendo.data.DataSource({
	    	    				transport: {
	    	    					read: function(e){ 
	    	    						var param = {
	        		    					procedureParam: "MarketManager.USP_SY_15PARS01_GET",
	        		    				};
	        		    				UtilSvc.getList(param).then(function (res) {
	        								e.success(res.data.results[0]);
	        								if(res.data.results[0].length > 0) {
	        									$scope.syParsVO.mngMrkMd = res.data.results[0][0].NO_MRK;
	        								}
	        							}); 
	    	    					}
	    	    				}
	    	    			}),
	    	    			valuePrimitive: true,
	                	},
	                	mngMrkMd: [""],
	                	initLoad: function(bLoading) {
	                		var self = this;
	                		self.mngMrkDs.dataSource.data = resData.mngMrkData;
	                		self.mngMrkMd                 = resData.mngMrkData[0].NO_MRK;
	                	}
	                };
	            
	            
	            
	            //검색
	            syParsVO.search = function(e){
	            	var me = this;
	            	me.param = {
	                    	procedureParam: "MarketManager.USP_SY_15PARS02_GET&NO_MRK@s",      	
	                    	NO_MRK:syParsVO.mngMrkMd
	                    };
	            		UtilSvc.getList(me.param).then(function (res) {
						e.success(res.data.results[0]);
//						if(res.data.results[0].length > 0) {
//							$scope.syParsVO.mngMrkMd = res.data.results[0][0].NO_MRK;
//						}
					}); 
      	
	            	//$scope.nkg.dataSource.read();
	            		//alert($scope.mrkName);
	            };	 
	             
	            //초기화버튼
	            syParsVO.inIt = function(){
	            	var self = this;
            		self.mngMrkDs.dataSource.data = resData.mngMrkData;
            		self.mngMrkMd                 = resData.mngMrkData[0].NO_MRK;
	            };
	            
	            var gridCusCodeVO = $scope.gridCusCodeVO = {
	                    messages: {
	            			noRows: "사용자코드가 존재하지 않습니다.",
	            			loading: "ERP 사용자정보를 가져오는 중...",
	                        requestFailed: "요청 ERP 사용자정보를 가져오는 중 오류가 발생하였습니다.",
	            			commands: {
	            				create: '추가',
	            				save: '저장',
	            				cancel: '취소',
	            				destroy: '삭제'
	            			}
	            		},
	            		boxTitle : "발송",
	            		edit: function (e) {
	                        if (e.model.isNew()) {
	                        	if(e.model.CD_CLS == ""){
	                        		e.model.set("YN_USE", "Y");
	                        		e.model.set("NO_MNGCDHD", $scope.gridCusCodeVO.NO_MNGCDHD);
	                        		e.model.set("CD_CLS", $scope.gridCusCodeVO.CD_CLS);
	                        	}
	                        }
	            		},
	            		dataSource: new kendo.data.DataSource({
	                		transport: {
	                			read: function(e) {
	                			},
	                    		create: function(e) {
	                    			SyCodeSvc.saveUserCode(e.data.models, "I").success(function () {
	                    				$scope.gridCusCodeVO.init();
	                                });
	                			},
	                			update: function(e) {
	                    			SyCodeSvc.saveUserCode(e.data.models, "U").success(function () {
	                    				$scope.gridCusCodeVO.init();
	                                });
	                			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
	                    			SyCodeSvc.saveUserCode(e.data.models, "DS").success(function () {
	            						defer.resolve();
	                    				$scope.gridCusCodeVO.init();
	                                });
	                    			return defer.promise;
	                			},
	                			parameterMap: function(e, operation) {
	                				
	                			}
	                		},
	                		batch: true,
	                		schema: {
	                			model: {
	                				id: "CD_DEF",
	                				fields: {
	                					CD_CLS: {},
	                					CD_DEF: { validation: {
	                							cd_defvalidation: function (input) {
	    										if (input.is("[name='CD_DEF']") && input.val().length == 0) {
	    											input.attr("data-cd_defvalidation-msg", "구분코드를 입력해주세요.");
	                                                return false;
	    										}
	    								    		if (input.is("[name='CD_DEF']")) {
	    								    			var grid = $("#gridCusCodeVO").data("kendoGrid").dataSource;
	    												var check = 0;
	    												for(var i = 0 ; i < grid._data.length; i++){
	    													if(input[0].value == grid._data[i].CD_DEF) check++;
	    													if(check >= 2){
	    														input.attr("data-cd_defvalidation-msg", "구분코드가 중복됩니다.");
	    	                                                    return false;
	    													}
	    												}
	                                            }
	    								    		return true;
	    							    	  	}
	    								}},
	                					CD_DEF_OLD: {},
	                					NM_DEF: { validation: {required: true}},
	                					DC_RMK1: {},
	                					DC_RMK2: {},
	                					DC_RMK3: {},
	                					DC_RMK4: {},
	                					DC_RMK5: {},
	                					YN_USE: {},
	                					DTS_UPDATE: {editable: false}
	                				}
	                			}
	                		}
	                	}),
	                	navigatable: true,
	                	toolbar: 
	                		["create", "save", "cancel"],
	                	columns: [
	                	       { field : "CD_DEF_OLD", hidden:true },   
	           		           { field : "NM_DEF", title: "택배사" },
	                           {command: [ "destroy" ]}
	                	],
	                    collapse: function(e) {
	                        // console.log(e.sender);
	                        this.cancelRow();
	                    },
	                	editable: true,
	                	height: 346,
	                	
	                	initLoad: function() {
	                		var self = this;
	                		
	                	    // 코드분류 row클릭시 정보를 받아 사용자코드를 조회한다.
	                        $scope.$on( "codeMng.customer:inquiry", function ( $event, oEntity, aData ) {
	                            self.NO_MNGCDHD = oEntity.NO_MNGCDHD;
	                            self.CD_CLS     = oEntity.CD_CLS;
	                            self.YN_SYS     = oEntity.YN_SYS;
	                            self.dataSource.data(aData);
	                            $("#gridCusCodeVO .k-grid-toolbar").show();
	                            
	                			if(self.YN_SYS == "Y"){
	                				$("#gridCusCodeVO .k-grid-toolbar").hide();
	                			}
	                        });
	                	},
	                	init: function() {
	                		var self = this;
	                		var param = {                    	
	        						procedureParam: "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s",
	        						L_NO_MNGCDHD: self.NO_MNGCDHD,
	        						L_CD_CLS: self.CD_CLS
	                        	};
	                		UtilSvc.getList(param).then(function (res) {
	                			self.dataSource.data(res.data.results[1]);
	                        });
	    				}
	                };
            
//	            var syCodeVO = $scope.syCodeVO = {
//	            		boxTitle : "발송",
//	                    messages: {
//	            			noRows: "코드가 존재하지 않습니다.",
//	            			loading: "코드를 가져오는 중...",
//	                        requestFailed: "요청 코드를 가져오는 중 오류가 발생하였습니다."
//	            		},
//	            		dataSource: new kendo.data.DataSource({
//	                		batch: true,
//	                		transport: {
//    	    					read: function(e){ 
//    	    						var param = {
//        		    					procedureParam: "MarketManager.USP_SY_15PARS01_GET",
//        		    				};
//        		    				UtilSvc.getList(param).then(function (res) {
//        								e.success(res.data.results[0]);
//        								if(res.data.results[0].length > 0) {
//        									$scope.syParsVO.mngMrkMd = res.data.results[0][0].NO_MRK;
//        								}
//        							}); 
//    	    					}
//    	    				},
//	                		schema: {
//	                			model: {
//	                				fields: {
//	                					NO_MNGCDHD: { },
//	                					CD_CLS:     { },
//	                					NM_CLS:     { },
//	                					DC_RMK:     { },
//	                					YN_SYS:     { },
//	                					DTS_UPDATE: { }
//	                				}
//	                			}
//	                		}
//	                	}),
//	                	navigatable: true,
//	                	columns: [
//	                	    { field : "NO_MNGCDHD", title: "", width: 0, cellClass: "ta-c", hidden:true },
//	                	    { field : "CD_CLS", title: "분류코드", width: 90, cellClass: "ta-c" },
//	                        { field : "NM_CLS", title: "분류명칭", width: 120, cellClass: "ta-c" },
//	                        { field : "DC_RMK", title: "비고", width: 100 },
//	                        { field : "YN_SYS", title: "수정여부", width: 80, cellClass: "ta-c", template: '#if (YN_SYS == "Y") {# #="불가능"# #} else {# #="가능"# #} #'},
//	                        { field : "DTS_UPDATE", title: "수정일시", width: 120, cellClass: "ta-c" }
//	                	],
//	                    collapse: function(e) {
//	                        // console.log(e.sender);
//	                        this.cancelRow();
//	                    },
//	                	editable: false,
//	                	height: 680,
//	                	
//	                	initLoad: function() {
//	                		var self = this;
//	                		self.inquiry();
//	                	},
//	                    
//	                    inquiry: function() {
//	                    	var self = this,
//	    					param = {
//	                        	procedureParam: self.procedureParam,
//	                        	L_SEARCHKIND: self.searchKind,
//	                        	L_SEARCHNAME: self.searchNm
//	                        };
//
//	                        $scope.$emit( "event:autoLoader", false );
//	                        
//	                        UtilSvc.getList(param).then(function (res) {
//	                        	self.dataSource.data(res.data.results[0]);
//	    						self.data = res.data.results[0];
//
//	                            var codeParam = {
//	                            	NO_MNGCDHD : "",
//	                                CD_CLS : "",
//	                                YN_SYS : ""
//	                            };
//
//	                            if (res.data.results[0].length > 0) {
//	                                $timeout(function () {
//	                                    self.selected = res.data.results[0][0];
//
//	                                    codeParam.NO_MNGCDHD = self.selected.NO_MNGCDHD;
//	                                    codeParam.CD_CLS = self.selected.CD_CLS;
//	                                    codeParam.YN_SYS = self.selected.YN_SYS;
//	                                    
//	                                    self.inquiryAll(codeParam);
//	                                });
//	                            } else {
//	                                $scope.$emit( "event:autoLoader", true );
//	                            }
//	    					});
//	                    }
//						
//	                };
//		            syCodeVO.initLoad();
	            
           }]);                              
}());
		