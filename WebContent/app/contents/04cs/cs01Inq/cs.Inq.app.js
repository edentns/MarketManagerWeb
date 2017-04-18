(function () {
    "use strict";

    // [cs] Inq
    var inqApp = angular.module("cs.Inq", ["cs.Inq.controller", "cs.Inq.service"]);
    angular.module("cs.Inq.controller", [] );
    angular.module("cs.Inq.service", [] );

    inqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.csInq", {
            url		: "/04cs/csInq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/04cs/cs01Inq/templates/cs.Inq.tpl.html",
                    controller  : "cs.InqCtrl",
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
