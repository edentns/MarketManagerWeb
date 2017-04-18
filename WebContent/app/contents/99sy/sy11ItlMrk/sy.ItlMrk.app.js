(function () {
    "use strict";

    // [sy] ItlMrk
    var itlMrkApp = angular.module("sy.ItlMrk", ["sy.ItlMrk.controller", "sy.ItlMrk.service"]);
    angular.module("sy.ItlMrk.controller", [] );
    angular.module("sy.ItlMrk.service", [] );

    itlMrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syItlMrk", {
            url		: "/99sy/syItlMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy11ItlMrk/templates/sy.ItlMrk.tpl.html",
                    controller  : "sy.ItlMrkCtrl",
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
