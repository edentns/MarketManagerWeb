(function () {
    "use strict";

    // [SY] > 코드관리
    var codeApp = angular.module("sy.Code", ["sy.Code.controller", "sy.Code.service"]);
    angular.module("sy.Code.controller", []);
    angular.module("sy.Code.service", []);

    codeApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syCode", {
            url: "/99sy/syCode?menu",
            views: {
                contentView: {
                    templateUrl : "app/contents/99sy/sy10Code/templates/sy.Code.tpl.html",
                    controller  : "sy.CodeCtrl",
                    resolve     : {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer = $q.defer(),
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