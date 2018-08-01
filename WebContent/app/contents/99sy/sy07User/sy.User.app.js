(function () {
    "use strict";

    // [SY] > 유저관리
    var userApp = angular.module("sy.User", ["sy.User.controller", "sy.User.service"]);
    angular.module("sy.User.controller", []);
    angular.module("sy.User.service", []);

    userApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syUser", {
            url		: "/99sy/syUser/:kind?menu&ids",
            views	: {
                contentView	: {
                    templateUrl	: function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "app/contents/99sy/sy07User/templates/sy.User"+ edt.getMenuFileName($stateParams.kind) +".tpl.html";
                    },
                    controllerProvider: ["$stateParams", function ($stateParams) {
                        if ($stateParams.menu) {
                            $stateParams.kind = "list";
                        }
                        return "sy.User"+ edt.getMenuFileName($stateParams.kind) +"Ctrl";
                    }],
                    resolve		: {
                        resData: ["AuthSvc", "$q", "$stateParams", "sy.UserListSvc", "sy.CodeSvc", "UtilSvc", 
                                  function (AuthSvc, $q, $stateParams, UserListSvc, SyCodeSvc, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                if($stateParams.kind === "list") {
                                	var paramDept      = {search: "all"}
                                	  , paramRankCd    = {cd: "SY_000020", search: "all"}
                                	  , paramEmpStatCd = {cd: "SY_000025", search: "all"}
                                	  , paramAtrtCd    = {procedureParam: "USP_SY_08ATRT01_GET"};
                                	
                                	$q.all([
                                	    UserListSvc.getDepart(paramDept).then(function (res) {
                                	    	return res.data;
                                	    }),
                                	    SyCodeSvc.getSubcodeList(paramRankCd).then(function (res) {
                                	    	return res.data;
                                	    }),
                                	    SyCodeSvc.getSubcodeList(paramEmpStatCd).then(function (res) {
                                	    	return res.data;
                                	    }),
                                		UtilSvc.getList(paramAtrtCd).then(function (res) {
                                	    	return res.data.results[0];
                                		}),
                                		UtilSvc.grid.getInquiryParam().then(function (res) {
                                			return res.data;
                                		})
                                    ]).then(function (result) {
                                    	resData.departCodeList = result[0];
                                		resData.rankCodeList   = result[1];
                                		resData.empStatList    = result[2];
                            			resData.atrtCodeList   = result[3];
                            			
                            			var history = result[4];
                            			
                            			if(history){
            	                    		resData.selectedDeptIds               = history.DEPT_LIST;
            	                    		resData.departCodeList.setSelectNames = history.DEPT_LIST_SELECT_INDEX;
            	                    		resData.selectedRankIds               = history.RANK_LIST;
            	                    		resData.rankCodeList.setSelectNames   = history.RANK_LIST_SELECT_INDEX;
            	                    		resData.selectedStatIds               = history.STAT_LIST;
            	                    		resData.empStatList.setSelectNames    = history.STAT_LIST_SELECT_INDEX;
            	                    		resData.selectedAtrtIds               = history.ATRT_LIST;
            	                    		resData.atrtCodeList.setSelectNames   = history.ATRT_LIST_SELECT_INDEX;
            	                    		resData.searchName                    = history.SEARCH_NAME;
            			            	}
            	                    	else {
            	                    		resData.selectedDeptIds = "*";
        				            		resData.selectedRankIds = "*";
        				            		resData.selectedStatIds = "*";
        				            		resData.selectedAtrtIds = "*";
        				            		resData.searchName      = "";
            	                    	}
            	                    	
            	                    	defer.resolve(resData);
                                    });
                                }
                                else {
                                	defer.resolve(resData);	
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
