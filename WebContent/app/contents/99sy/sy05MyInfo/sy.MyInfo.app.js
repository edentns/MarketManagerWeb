(function () {
    "use strict";

    // [co] profile
    var myInfoApp = angular.module("sy.MyInfo", ["sy.MyInfo.controller", "sy.MyInfo.service"]);
    angular.module("sy.MyInfo.controller", []);
    angular.module("sy.MyInfo.service", []);

    myInfoApp.config(["$stateProvider", function ($stateProvider){
        $stateProvider.state("app.syMyInfo", {
            url   : "/99sy/syMyInfo",
            views : {
                contentView : {
                    templateUrl : "app/contents/99sy/sy05MyInfo/templates/sy.MyInfo.tpl.html",
                    controller  : "sy.MyInfoCtrl",
                    resolve		: {
                        resData : ["sy.LoginSvc", "$q", "$rootScope", function (SyLoginSvc, $q, $rootScope) {
                            var defer = $q.defer(),
                                resData = {};

                            SyLoginSvc.isLogin().then(function () {
                                $rootScope.$emit("event:login");
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