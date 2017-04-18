(function () {
    "use strict";

    // [sy] UserJoin
    var userJoinApp = angular.module("sy.UserJoin", ["sy.UserJoin.controller", "sy.UserJoin.service"]);
    angular.module("sy.UserJoin.controller", [] );
    angular.module("sy.UserJoin.service", [] );

    userJoinApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syUserJoin", {
            url		: "/99sy/syUserJoin?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy04UserJoin/templates/sy.UserJoin.tpl.html",
                    controller  : "sy.UserJoinCtrl",
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
