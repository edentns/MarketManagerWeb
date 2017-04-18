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
