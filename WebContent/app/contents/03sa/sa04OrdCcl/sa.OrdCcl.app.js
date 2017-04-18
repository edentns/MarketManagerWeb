(function () {
    "use strict";

    // [sa] OrdCcl
    var ordCclApp = angular.module("sa.OrdCcl", ["sa.OrdCcl.controller", "sa.OrdCcl.service"]);
    angular.module("sa.OrdCcl.controller", [] );
    angular.module("sa.OrdCcl.service", [] );

    ordCclApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saOrdCcl", {
            url		: "/03sa/saOrdCcl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa04OrdCcl/templates/sa.OrdCcl.tpl.html",
                    controller  : "sa.OrdCclCtrl",
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
