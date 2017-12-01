(function () {
    "use strict";

    // [ma] Dashboard
    var dashboardApp = angular.module("ma.Dashboard", ["ma.Dashboard.controller", "ma.Dashboard.service"]);
    angular.module("ma.Dashboard.controller", [] );
    angular.module("ma.Dashboard.service", [] );

    dashboardApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maDashboard", {
            url		: "/01ma/maDashboard?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma01Dashboard/templates/ma.Dashboard.tpl.html",
                    controller  : "ma.DashboardCtrl as vm",
                    resolve		: {
                        resData: ["AuthSvc", "$q", 'UtilSvc', function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                            	var param = {
            	                	procedureParam: "USP_MA_01DASHBOARD06_GET"
                            	};
                	            
                				UtilSvc.getList(param).then(function (res) {
                					resData.mainOpen = (res.data.results[0].length > 0)? true : false;
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