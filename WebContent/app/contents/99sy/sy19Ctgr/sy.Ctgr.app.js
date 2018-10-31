(function () {
    "use strict";

    // [SY] > 권한관리
    var atrtApp = angular.module("sy.Ctgr", ["sy.Ctgr.controller", "sy.Ctgr.service"]);
    angular.module("sy.Ctgr.controller", []);
    angular.module("sy.Ctgr.service", []);

    atrtApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syCtgr", {
            url		: "/99sy/syCtgr?menu",
            views	: {
                contentView: {
                    templateUrl	: "app/contents/99sy/sy19Ctgr/templates/sy.Ctgr.tpl.html",
                    controller	: "sy.CtgrMngCtrl",
                    resolve: {
                        resData: ["$stateParams", "$q", "AuthSvc", "sy.AtrtSvc",
                            function ($stateParams, $q, AuthSvc) {
                                var defer   = $q.defer(),
                                    resData = {};

                                AuthSvc.isAccess().then(function (result) {
                                    resData.access = result[0];
	                                defer.resolve(resData);
                                });

                                return defer.promise;
                            }
                        ]
                    }
                }
            }
        });
    }]);
}());