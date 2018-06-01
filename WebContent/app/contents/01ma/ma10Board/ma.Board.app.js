(function () {
    "use strict";

    // [ma] Board
    var qaApp = angular.module("ma.Board", ["ma.Board.controller", "ma.Board.service"]);
    angular.module("ma.Board.controller", [] );
    angular.module("ma.Board.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maBoard", {
            url		: "/01ma/maBoard/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function($stateParams) {
                    	if     ($stateParams.menu)  $stateParams.kind = "";
                    	else                        $stateParams.kind = "Info";
                    	return "app/contents/01ma/ma10Board/templates/ma.Board"+$stateParams.kind+".tpl.html";
                    },
                    controllerProvider  : ["$stateParams",function($stateParams) {
                    	if     ($stateParams.menu)  $stateParams.kind = "";
                    	else                        $stateParams.kind = "Info";
                    	return "ma.Board"+$stateParams.kind+"Ctrl";
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
	    				            		resData.fbdCheck   = history.fbdCheck;
	    				            		resData.selectDate = UtilSvc.grid.getSelectDate(history.selected, history.start, history.end);
	    				            	}
	    				            	else {
	    				            		resData.subject         = "";
	    				            		resData.writer          = "";
	    				            		resData.fbdCheck        = "";
	    				            		resData.selectDate        = {};
	    				            		resData.selectDate.start  = angular.copy(edt.getToday());
	    				            		resData.selectDate.end    = angular.copy(edt.getToday());
	    				            		resData.selectDate.selected = '1Week';
	    				            	}
	    				            		
	    		    					defer.resolve(resData);
	                                });
                                }
                                else {
                                	// 4. 게시글 보기
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
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());