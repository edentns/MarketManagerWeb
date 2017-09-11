(function () {
    "use strict";

    // [ma] MngMrk
    var mngMrkApp = angular.module("ma.MngMrk", ["ma.MngMrk.controller", "ma.MngMrk.service"]);
    angular.module("ma.MngMrk.controller", [] );
    angular.module("ma.MngMrk.service", [] );

    mngMrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maMngMrk", {
            url		: "/01ma/maMngMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma03MngMrk/templates/ma.MngMrk.tpl.html",
                    controller  : "ma.MngMrkCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
                                strPcdParam = "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s";

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
            						procedureParam:strPcdParam,
            						L_NO_MNGCDHD:"SYCH00016",
            						L_CD_CLS:"SY_000016"
            					};
            					UtilSvc.getList(param).then(function (res) {
            						resData.methodDataSource = res.data.results[0];
            						defer.resolve(resData);
            					});
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());
