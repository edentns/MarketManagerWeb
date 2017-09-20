(function () {
    "use strict";

    // [sy] Mrk
    var mrkApp = angular.module("sy.Mrk", ["sy.Mrk.controller", "sy.Mrk.service"]);
    angular.module("sy.Mrk.controller", [] );
    angular.module("sy.Mrk.service", [] );

    mrkApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syMrk", {
            url		: "/99sy/syMrk?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy09Mrk/templates/sy.Mrk.tpl.html",
                    controller  : "sy.MrkCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {},
                                strPcdParam = "USP_SY_10CODE02_GET&L_NO_MNGCDHD@s|L_CD_CLS@s";

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                var param = {
            						procedureParam:strPcdParam,
            						L_NO_MNGCDHD:"SYCH00005",
            						L_CD_CLS:"SY_000005"
            					};
            					UtilSvc.getList(param).then(function (res) {
            						resData.cdMrkDftDataSource = res.data.results[0];
            						var param = {
                						procedureParam:strPcdParam,
                						L_NO_MNGCDHD:"SYCH00027",
                						L_CD_CLS:"SY_000027"
                					};
            						UtilSvc.getList(param).then(function (res) {
                						resData.cdNtDataSource = res.data.results[0];
                						defer.resolve(resData);
                					});
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
