(function () {
    "use strict";

    // [ma] MrkOpt
    var mrkOptApp = angular.module("ma.MrkOpt", ["ma.MrkOpt.controller", "ma.MrkOpt.service"]);
    angular.module("ma.MrkOpt.controller", [] );
    angular.module("ma.MrkOpt.service", [] );

    mrkOptApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMrkOpt", {
            url		: "/01ma/maMrkOpt?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/04ma/ma01MrkOpt/templates/ma.MrkOpt.tpl.html",
                    controller  : "ma.MrkOptCtrl",
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