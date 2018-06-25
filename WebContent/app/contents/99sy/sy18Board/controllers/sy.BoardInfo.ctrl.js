(function () {
    "use strict";

    /**
     * @ngdoc function
     * @name sy.BoardInfo.controller : sy.BoardInfoCtrl
     * 게시판 상세 조회
     */
    angular.module("sy.Board.controller")
        .controller("sy.BoardInfoCtrl", ["$stateParams", "$state", "$rootScope", "$sanitize", "$window", "$scope", "$http", "$q", "$log", "sy.BoardSvc", "sy.MyInfoSvc", "APP_CONFIG", "APP_CODE", "$timeout", "resData", "Page", "UtilSvc", "MenuSvc",
            function ($stateParams, $state, $rootScope, $sanitize, $window, $scope, $http, $q, $log, SyBoardSvc, SyMyInfoSvc, APP_CONFIG, APP_CODE, $timeout, resData, Page, UtilSvc, MenuSvc) {
	            var page  = $scope.page = new Page({ auth: resData.access }),
		            today = edt.getToday();
	            
	            var boardInfoDataVO = $scope.boardInfoDataVO = {
	            	boxTitle  : "게시글 상세 내용",
	            	params    : resData.params,
                	fileUrl   : APP_CONFIG.domain +"/ut05FileUpload",
                	NO_C      : $rootScope.webApp.user.NO_C,
                	NO_EMP    : $rootScope.webApp.user.NO_EMP,
	            	fileDataVO: {
	            		CD_AT:'011',
	            		limitCnt: 5,
	            		currentDataList: resData.currentDataList
	            	}
	            };
	            
	            // 게시글 초기화
	            boardInfoDataVO.init = function() {
	            	var param = {
    					procedureParam: "USP_SY_18BOARD03_SEARCH&L_NO_BOARD@s",
    					L_NO_BOARD: $stateParams.ids
    				};
                	UtilSvc.getList(param).then(function (res) {
						$scope.boardCommentDataVO.boxTitle = "댓글 "+res.data.results[1][0].CNT_COMMENT+"건";
						if(res.data.results[0].length >= 1) {
							$scope.boardCommentDataVO.listOptions.dataSource.data(res.data.results[0]);
							//e.success(res.data.results[0]);
							//$("#commentList").refresh();
						}else{
							$scope.boardCommentDataVO.listOptions.dataSource.data([]);
						}
					});
	            }
	            
	            // 게시글 수정
	            boardInfoDataVO.goUpdate = function() {
    				var defer = $q.defer();
    				
	            	SyMyInfoSvc.selectYnNkne().success(function(res) {
	            		if(res) {
	            			$state.go('app.syBoard', { kind: "", menu: null, write:true, ids: $stateParams.ids });
    						defer.resolve();
	            		}
	            		else {
	            			$state.go('app.syMyInfo', { kind: "", menu: null });
        					defer.reject();
	            		}
	            	}).error(function() {
	            		$state.go('app.syMyInfo', { kind: "", menu: null });
    					defer.reject();
	            	});
        			return defer.promise;
	            }
	            
	            // 게시글 삭제
	            boardInfoDataVO.goDelete = function() {
	            	if(!confirm("삭제하시겠습니까?")) {	
		            	var params = {
		            		NO_BOARD: $stateParams.ids
		            	};
		            	SyBoardSvc.boardSave(params, "D").then(function(res) {
	        				if(res.data) {
	        					alert('게시글 삭제하였습니다.');
	        					$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
	        				}
	        				else {
	        					alert('게시글 삭제에 실패하였습니다.');
	        				}
	        			});
	            	}
	            }
	            
	            // 목록으로 이동
	            boardInfoDataVO.goList = function() {
	            	$state.go('app.syBoard', { kind: 'list', menu: true, ids: null });
	            }
	            
	            var boardCommentDataVO = $scope.boardCommentDataVO = {
	            	boxTitle : "댓글",
	            	open     : false,
	            	listOptions: {
		            	dataSource: new kendo.data.DataSource({
		            		transport: {
		            			read: function(e) {
		            			},
		            			update: function(e) {
		            				var defer = $q.defer();
		            				
		        	            	SyMyInfoSvc.selectYnNkne().success(function(res) {
		        	            		if(res) {
				            				SyBoardSvc.boardCommentSave(e.data.models[0], "U").success(function(res) {
				                				if(res) {
				                					alert('댓글 수정하였습니다.');
				                					e.success();
				                					var param = {
				        		    					procedureParam: "USP_SY_18BOARD03_SEARCH&L_NO_BOARD@s",
				        		    					L_NO_BOARD: $stateParams.ids
				        		    				};
				                                	UtilSvc.getList(param).then(function (res) {
				                                		e.success();
				                						if(res.data.results[0].length >= 1) {
				                							$scope.boardCommentDataVO.listOptions.dataSource.data(res.data.results[0]);
				                						}
				                						defer.resolve();
				                					});
				                					// 댓글 리스트 수정
				                				}
				                				else {
				                					alert('댓글 등록에 실패하였습니다.');
				                					e.error();
				                					defer.reject();
				                				}
				                			}).error(function(msg, code) {
				            					e.error();
				            					defer.reject();
				            				});
		        	            		}
		        	            		else {
		        	            			$state.go('app.syMyInfo', { kind: "", menu: null });
		                					defer.reject();
		        	            		}
		        	            	}).error(function() {
		        	            		$state.go('app.syMyInfo', { kind: "", menu: null });
		            					defer.reject();
		        	            	});
		        	            		
	                    			return defer.promise;
		            			},
	                			destroy: function(e) {
	                				var defer = $q.defer();
		            				// 수정
		            				SyBoardSvc.boardCommentSave(e.data.models[0], "D").success(function(res) {
		                				if(res) {
		                					alert('댓글를 삭제하였습니다.');
		                					var param = {
		        		    					procedureParam: "USP_SY_18BOARD03_SEARCH&L_NO_BOARD@s",
		        		    					L_NO_BOARD: $stateParams.ids
		        		    				};
		                                	UtilSvc.getList(param).then(function (res) {
		                                		e.success();
		                						if(res.data.results[0].length >= 1) {
		                							$scope.boardCommentDataVO.listOptions.dataSource.data(res.data.results[0]);
		                						}
			                					defer.resolve();
		                					});
		                					// 댓글 리스트 수정
		                				}
		                				else {
		                					alert('댓글 삭제에 실패하였습니다.');
		                					e.error();
		                					defer.reject();
		                				}
		                			}).error(function(msg, code) {
		            					e.error();
		            					defer.reject();
		            				});
	                    			return defer.promise;
		            			},
	                			parameterMap: function(e, operation) {
	                				if(operation !== "read" && e.models) {
	                					return {models:kendo.stringify(e.models)};
	                				}
	                			}
		            		},
		            		batch: true,
		            		//pageSize: 1,
		            		schema: {
		            			model: {
		            				id: "NO_BOARD_COMMENT",
		            				fields: {
		            					NO_BOARD   : {type: "string", editable: false},
		            					NM_NKNE    : {type: "string", editable: false},
		            					DATE_INSERT: {type: "string", editable: false},
		            					TIME_INSERT: {type: "string", editable: false},
		            					DC_IPADDR  : {type: "string", editable: false},
		            					NO_C       : {type: "string", editable: false},
		            					NO_INSERT  : {type: "string", editable: false},
		            					DC_COMMENT : {type: "string"},
		            					YN_DEL     : {type: "string"}
		            				}
		            			}
		            		}
		            	}),
		            	template: kendo.template($("#boardCommentTemplate").html()),
		            	editTemplate: kendo.template($("#boardCommentEditTemplate").html()),
		            	remove: function(e) {
		            		if(!confirm("삭제하시겠습니까?")) {
		            			e.preventDefault();
		            		}
		            	}
	            	}
	            };
	            
	            var boardCmtRegDataVO = $scope.boardCmtRegDataVO = {
	            	boxTitle : "댓글등록",
	            	params : {
	            		DC_COMMENT : ""
	            	}
	            };
	            
	            boardCmtRegDataVO.goCommentSave = function() {
	            	var defer = $q.defer();
    				
	            	SyMyInfoSvc.selectYnNkne().success(function(res) {
	            		if(res) {
	            			boardCmtRegDataVO.params.NO_BOARD = $stateParams.ids;
	            			
	    	            	SyBoardSvc.boardCommentSave(boardCmtRegDataVO.params, "I").then(function(res) {
	            				if(res.data) {
	            					alert('댓글 등록하였습니다.');
	            					
	            					var param = {
	    		    					procedureParam: "USP_SY_18BOARD03_SEARCH&L_NO_BOARD@s",
	    		    					L_NO_BOARD: $stateParams.ids
	    		    				};
	                            	UtilSvc.getList(param).then(function (res) {
	            						if(res.data.results[0].length >= 1) {
	            							$scope.boardCommentDataVO.listOptions.dataSource.data(res.data.results[0]);
	            							$scope.boardCommentDataVO.boxTitle = "댓글 "+res.data.results[1][0].CNT_COMMENT+"건";
	            							boardCmtRegDataVO.params.DC_COMMENT = "";
	            						}
	            					});

	        						defer.resolve();
	            				}
	            				else {
	            					alert('댓글 등록에 실패하였습니다.');
	            					defer.reject();
	            				}
	            			});
	            		}
	            		else {
	            			$state.go('app.syMyInfo', { kind: "", menu: null });
        					defer.reject();
	            		}
	            	}).error(function() {
	            		$state.go('app.syMyInfo', { kind: "", menu: null });
    					defer.reject();
	            	});
        			return defer.promise;
	            };
	            
	            boardInfoDataVO.init();
            }]);
}());