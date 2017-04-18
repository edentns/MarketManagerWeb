(function () {
    "use strict";

    // [sa] OrdShpAll
    var ordShpAllApp = angular.module("sa.OrdShpAll", ["sa.OrdShpAll.controller", "sa.OrdShpAll.service"]);
    angular.module("sa.OrdShpAll.controller", [] );
    angular.module("sa.OrdShpAll.service", [] );

    ordShpAllApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saOrdShpAll", {
            url		: "/03sa/saOrdShpAll?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa01OrdShpAll/templates/sa.OrdShpAll.tpl.html",
                    controller  : "sa.OrdShpAllCtrl",
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
