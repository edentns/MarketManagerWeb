(function () {
    "use strict";

    // [sa] ShpStdbyOrd
    var shpStdbyOrdApp = angular.module("sa.ShpStdbyOrd", ["sa.ShpStdbyOrd.controller", "sa.ShpStdbyOrd.service"]);
    angular.module("sa.ShpStdbyOrd.controller", [] );
    angular.module("sa.ShpStdbyOrd.service", [] );

    shpStdbyOrdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saShpStdbyOrd", {
            url		: "/03sa/saShpStdbyOrd?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa03ShpStdbyOrd/templates/sa.ShpStdbyOrd.tpl.html",
                    controller  : "sa.ShpStdbyOrdCtrl",
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
