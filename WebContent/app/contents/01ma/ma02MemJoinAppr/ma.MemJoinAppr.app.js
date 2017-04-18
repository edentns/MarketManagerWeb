(function () {
    "use strict";

    // [ma] MemJoinAppr
    var memJoinApprApp = angular.module("ma.MemJoinAppr", ["ma.MemJoinAppr.controller", "ma.MemJoinAppr.service"]);
    angular.module("ma.MemJoinAppr.controller", [] );
    angular.module("ma.MemJoinAppr.service", [] );

    memJoinApprApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMemJoinAppr", {
            url		: "/01ma/maMemJoinAppr?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma02MemJoinAppr/templates/ma.MemJoinAppr.tpl.html",
                    controller  : "ma.MemJoinApprCtrl",
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
