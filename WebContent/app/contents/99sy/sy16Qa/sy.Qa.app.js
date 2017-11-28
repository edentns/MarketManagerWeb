(function () {
    "use strict";

    // [sy] Notice
    var syQaApp = angular.module("sy.Qa", ["sy.Qa.controller", "sy.Qa.service"]);
    angular.module("sy.Qa.controller", [] );
    angular.module("sy.Qa.service", [] );

    syQaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syQa", {
            url		: "/99sy/syQa?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy16Qa/templates/sy.Qa.tpl.html",
                    controller  : "sy.QaCtrl",
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
