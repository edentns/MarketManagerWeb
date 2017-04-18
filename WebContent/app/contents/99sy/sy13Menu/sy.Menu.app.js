(function () {
    "use strict";

    // [SY] > 메뉴관리
    var menuApp = angular.module("sy.Menu", ["sy.Menu.controller", "sy.Menu.service"]);
    angular.module("sy.Menu.controller", []);
    angular.module("sy.Menu.service", []);

    menuApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state( "app.syMenu", {
            url   : "/99sy/syMenu?menu",
            views : {
                contentView : {
                    templateUrl : "app/contents/99sy/sy13Menu/templates/sy.Menu.tpl.html",
                    controller  : "sy.MenuCtrl",
                    resolve     : {
                        resData : ["AuthSvc", "$q", function (AuthSvc, $q) {
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