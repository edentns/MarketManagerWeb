(function () {
    "use strict";

    // [sy] CInfo
    var cInfoApp = angular.module("sy.CInfo", ["sy.CInfo.controller", "sy.CInfo.service"]);
    angular.module("sy.CInfo.controller", [] );
    angular.module("sy.CInfo.service", [] );

    cInfoApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syCInfo", {
            url		: "/99sy/syCInfo?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy06CInfo/templates/sy.CInfo.tpl.html",
                    controller  : "sy.CInfoCtrl",
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
