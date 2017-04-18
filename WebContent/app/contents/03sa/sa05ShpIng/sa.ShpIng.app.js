(function () {
    "use strict";

    // [sa] ShpIng
    var shpIngApp = angular.module("sa.ShpIng", ["sa.ShpIng.controller", "sa.ShpIng.service"]);
    angular.module("sa.ShpIng.controller", [] );
    angular.module("sa.ShpIng.service", [] );

    shpIngApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.saShpIng", {
            url		: "/03sa/saShpIng?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/03sa/sa05ShpIng/templates/sa.ShpIng.tpl.html",
                    controller  : "sa.ShpIngCtrl",
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
