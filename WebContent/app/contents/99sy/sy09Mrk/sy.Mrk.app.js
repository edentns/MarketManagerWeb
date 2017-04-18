(function () {
    "use strict";

    // [sy] Mrk
    var mrkApp = angular.module("sy.Mrk", ["sy.Mrk.controller", "sy.Mrk.service"]);
    angular.module("sy.Mrk.controller", [] );
    angular.module("sy.Mrk.service", [] );

    mrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syMrk", {
            url		: "/99sy/syMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy09Mrk/templates/sy.Mrk.tpl.html",
                    controller  : "sy.MrkCtrl",
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
