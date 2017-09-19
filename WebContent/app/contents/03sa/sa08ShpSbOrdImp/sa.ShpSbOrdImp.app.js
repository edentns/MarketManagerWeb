(function () {
    "use strict";

    // [sa] ShpSbOrdImp
    var shpStdbyOrdApp = angular.module("sa.ShpSbOrdImp", ["sa.ShpSbOrdImp.controller", "sa.ShpSbOrdImp.service"]);
    angular.module("sa.ShpSbOrdImp.controller", [] );
    angular.module("sa.ShpSbOrdImp.service", [] );

    shpStdbyOrdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saShpSbOrdImp", {
            url		: "/03sa/saShpSbOrdImp?menu",
            views	: {
            	contentView	: {
                    templateUrl	: "app/contents/03sa/sa08ShpSbOrdImp/templates/sa.ShpSbOrdImp.tpl.html",
                    controller  : "sa.ShpSbOrdImpCtrl",
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
