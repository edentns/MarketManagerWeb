(function () {
    "use strict";

    // [it] SaleSiteItem
    var saleSiteItemApp = angular.module("it.SaleSiteItem", ["it.SaleSiteItem.controller", "it.SaleSiteItem.service"]);
    angular.module("it.SaleSiteItem.controller", [] );
    angular.module("it.SaleSiteItem.service", [] );

    saleSiteItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itSaleSiteItem", {
            url		: "/02it/itSaleSiteItem?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/02it/it04SaleSiteItem/templates/it.SaleSiteItem.tpl.html",
                    controller  : "it.SaleSiteItemCtrl",
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
