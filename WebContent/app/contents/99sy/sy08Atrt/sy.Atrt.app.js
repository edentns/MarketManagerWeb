(function () {
    "use strict";

    // [SY] > 권한관리
    var atrtApp = angular.module("sy.Atrt", ["sy.Atrt.controller", "sy.Atrt.service"]);
    angular.module("sy.Atrt.controller", []);
    angular.module("sy.Atrt.service", []);

    atrtApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syAtrt", {
            url		: "/99sy/syAtrt?menu",
            views	: {
                contentView: {
                    templateUrl	: "app/contents/99sy/sy08Atrt/templates/sy.Atrt.tpl.html",
                    controller	: "sy.AtrtMngCtrl",
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