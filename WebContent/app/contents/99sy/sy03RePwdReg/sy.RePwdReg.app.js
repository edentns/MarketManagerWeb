(function () {
    "use strict";

    // [sy] RePwdReg
    var rePwdApp = angular.module("sy.RePwdReg", ["sy.RePwdReg.controller", "sy.RePwdReg.service"]);
    angular.module("sy.RePwdReg.controller", [] );
    angular.module("sy.RePwdReg.service", [] );

    rePwdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syRePwdReg", {
            url		: "/99sy/syRePwdReg?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy03RePwdReg/templates/sy.RePwdReg.tpl.html",
                    controller  : "sy.RePwdRegCtrl",
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
