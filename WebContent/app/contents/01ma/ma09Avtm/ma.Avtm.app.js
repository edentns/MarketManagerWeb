(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Avtm", ["ma.Avtm.controller", "ma.Avtm.service"]);
    angular.module("ma.Avtm.controller", [] );
    angular.module("ma.Avtm.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maAvtm", {
            url		: "/01ma/maAvtm?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma09Avtm/templates/ma.Avtm.tpl.html",
                    controller  : "ma.AvtmCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
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