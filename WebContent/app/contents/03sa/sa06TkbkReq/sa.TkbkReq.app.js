(function () {
    "use strict";

    // [sa] TkbkReq
    var tkbkReqApp = angular.module("sa.TkbkReq", ["sa.TkbkReq.controller", "sa.TkbkReq.service"]);
    angular.module("sa.TkbkReq.controller", [] );
    angular.module("sa.TkbkReq.service", [] );

    tkbkReqApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saTkbkReq", {
            url		: "/03sa/saTkbkReq?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa06TkbkReq/templates/sa.TkbkReq.tpl.html",
                    controller  : "sa.TkbkReqCtrl",
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
