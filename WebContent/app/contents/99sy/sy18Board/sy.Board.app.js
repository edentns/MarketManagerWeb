(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("sy.Board", ["sy.Board.controller", "sy.Board.service"]);
    angular.module("sy.Board.controller", [] );
    angular.module("sy.Board.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syBoard", {
            url		: "/99sy/syBoard/:kind?menu&write&ids",
            views	: {
                contentView	: {
                    templateUrl	: function($stateParams) {
                    	if     ($stateParams.menu)  $stateParams.kind = "";
                    	else if($stateParams.write) $stateParams.kind = "Write";
                    	else                        $stateParams.kind = "Info";
                    	return "app/contents/99sy/sy18Board/templates/sy.Board"+$stateParams.kind+".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams) {
                    	if     ($stateParams.menu)  $stateParams.kind = "";
                    	else if($stateParams.write) $stateParams.kind = "Write";
                    	else                        $stateParams.kind = "Info";
                    	return "sy.Board"+$stateParams.kind+"Ctrl";
                    }],
                    resolve		: {
                        resData: ["$stateParams", "AuthSvc", "$q", "UtilSvc", "sy.BoardSvc", '$state', function ($stateParams, AuthSvc, $q, UtilSvc, SyBoardSvc, $state) {
                            var defer 	= $q.defer(),
                                resData = {},
                                self    = this,
                                today   = edt.getToday();

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                if($stateParams.menu) {
                                	// 1. 게시글 목록
	                                $q.all([
	                            		UtilSvc.grid.getInquiryParam().then(function (res) {
	                            			return res.data;
	                            		})
	                                ]).then(function (result) {
	                                	var history = result[0];
	                        			
	                        			if(history){
	    				            		resData.subject    = history.subject;
	    				            		resData.writer     = history.writer;
	    				            		resData.selectDate = UtilSvc.grid.getSelectDate(history.selected, history.start, history.end);
	    				            	}
	    				            	else {
	    				            		resData.subject         = "";
	    				            		resData.writer          = "";
	    				            		resData.selectDate        = {};
	    				            		resData.selectDate.start  = angular.copy(edt.getToday());
	    				            		resData.selectDate.end    = angular.copy(edt.getToday());
	    				            		resData.selectDate.selected = '1Week';
	    				            	}
	    				            		
	    		    					defer.resolve(resData);
	                                });
                                }
                                else if($stateParams.write) {
                                	// 2. 게시글 수정
                                	if($stateParams.ids !== "new") {
                                		var param = {
            		    					procedureParam: "USP_SY_18BOARD02_SEARCH&L_NO_BOARD@s",
            		    					L_NO_BOARD: $stateParams.ids
            		    				};
                                    	
                                    	UtilSvc.getList(param).then(function (res) {
                    						resData.params = res.data.results[0][0];
                    						resData.currentDataList = res.data.results[1];

                                        	defer.resolve(resData);
                    					});                                		
                                	}
                                	// 3. 글쓰기
                                	else {
                                		resData.params = {
                    	            		DC_SBJ         : '',
                    	            		DC_HTMLCONTENT : '',
                    	            	};
                                		resData.currentDataList = null;
                                		defer.resolve(resData);
                                	}
                                }
                                else {
                                	// 4. 게시글 보기
                                	var params = {
                                		NO_BOARD: $stateParams.ids
                                	};
                                	SyBoardSvc.boardCntSelSave(params).then(function(res) {
	                                	var param = {
	        		    					procedureParam: "USP_SY_18BOARD02_SEARCH&L_NO_BOARD@s",
	        		    					L_NO_BOARD: $stateParams.ids
	        		    				};
	                                	
	                                	UtilSvc.getList(param).then(function (res) {
	                						resData.params = res.data.results[0][0];
	                						resData.currentDataList = res.data.results[1];
	
	                                    	defer.resolve(resData);
	                					});
                                	});
                                }
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());