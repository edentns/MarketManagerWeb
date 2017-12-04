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
                        resData: ["AuthSvc", "$q", 'UtilSvc', function (AuthSvc, $q, UtilSvc) {
                        	var defer 	= $q.defer(),
                            resData = {};

	                        AuthSvc.isAccess().then(function (result) {
	                            resData.access = result[0];
	                        	var param = {
	        	                	procedureParam: "USP_SY_01DASHBOARD07_GET"
	                        	};
	            	            
	            				UtilSvc.getList(param).then(function (res) {
	            					resData.mainOpen = (res.data.results[0].length > 0)? true : false;
	            					resData.subOpen = (res.data.results[1].length > 0)? true : false;
	                                defer.resolve(resData);
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