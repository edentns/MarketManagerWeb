(function () {
    "use strict";

    // [ma] MngMrk
    var mngMrkApp = angular.module("ma.MngMrk", ["ma.MngMrk.controller", "ma.MngMrk.service"]);
    angular.module("ma.MngMrk.controller", [] );
    angular.module("ma.MngMrk.service", [] );

    mngMrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMngMrk", {
            url		: "/01ma/maMngMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma03MngMrk/templates/ma.MngMrk.tpl.html",
                    controller  : "ma.MngMrkCtrl",
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
