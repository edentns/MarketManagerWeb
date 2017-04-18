(function () {
    "use strict";

    // [it] BssItem
    var bssItemApp = angular.module("it.BssItem", ["it.BssItem.controller", "it.BssItem.service"]);
    angular.module("it.BssItem.controller", [] );
    angular.module("it.BssItem.service", [] );

    bssItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itBssItem", {
            url		: "/02it/itBssItem?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/02it/it02BssItem/templates/it.BssItem.tpl.html",
                    controller  : "it.BssItemCtrl",
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
