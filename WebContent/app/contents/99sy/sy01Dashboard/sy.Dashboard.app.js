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
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                defer.resolve(resData);
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());