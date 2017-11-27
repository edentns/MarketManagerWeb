(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Qa", ["ma.Qa.controller", "ma.Qa.service"]);
    angular.module("ma.Qa.controller", [] );
    angular.module("ma.Qa.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maQa", {
            url		: "/01ma/maQa?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma06Qa/templates/ma.Qa.tpl.html",
                    controller  : "ma.QaCtrl",
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