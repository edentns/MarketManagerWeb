(function () {
    "use strict";

    // [sy] Dashboard
    var dashboardApp = angular.module("sy.Dashboard", ["sy.Dashboard.controller", "sy.Dashboard.service"]);
    angular.module("sy.Dashboard.controller", [] );
    angular.module("sy.Dashboard.service", [] );

    dashboardApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syDashboard", {
            url		: "/99sy/syDashboard?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy01Dashboard/templates/sy.Dashboard.tpl.html",
                    controller  : "sy.DashboardCtrl as vm",
                    resolve		: {
                        resData: ["AuthSvc", "$q", 'UtilSvc', "$analytics", function (AuthSvc, $q, UtilSvc, $analytics) {
                        	var defer 	= $q.defer(),
                            resData = {};

	                        AuthSvc.isAccess().then(function (result) {
	                            resData.access = result[0];
	                        	var param = {
	                        		noticeQa:{procedureParam: "USP_SY_01DASHBOARD07_GET"},
	                        		cmrkPars:{procedureParam: "USP_SY_01DASHBOARD08_GET"},
	                        		sacsCnt:{procedureParam: "USP_SY_01DASHBOARD09_GET"}
	                        	};
	            	            
	                        	$q.all([
                                    UtilSvc.getList(param.noticeQa),
                                    UtilSvc.getList(param.cmrkPars),
                                    UtilSvc.getList(param.sacsCnt)
                                ]).then(function (result) {
                                	resData.mainOpen = (result[0].data.results[0].length > 0)? true : false;
	            					resData.subOpen = (result[0].data.results[1].length > 0)? true : false;
	            					
	            					resData.cmrkOpen = (result[1].data.results[0].length > 0 && result[1].data.results[0][0].CNT_NO_MRK > 0)? true : false;
	            					resData.parsOpen = (result[1].data.results[1].length > 0 && result[1].data.results[1][0].CNT_CD_DEF > 0)? true : false;
	            					
	            					resData.sacsCnt = result[2].data.results;
	            					
                                    defer.resolve( resData );
                                    
                                    $analytics.pageTrack('/UserDashBoard');
                                });
	                        });
	
	                        return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());