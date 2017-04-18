(function () {
    "use strict";

    // [it] SaleItem
    var saleItemApp = angular.module("it.SaleItem", ["it.SaleItem.controller", "it.SaleItem.service"]);
    angular.module("it.SaleItem.controller", [] );
    angular.module("it.SaleItem.service", [] );

    saleItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itSaleItem", {
            url		: "/02it/itSaleItem?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/02it/it03SaleItem/templates/it.SaleItem.tpl.html",
                    controller  : "it.SaleItemCtrl",
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
