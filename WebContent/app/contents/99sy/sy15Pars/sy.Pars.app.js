(function () {
    "use strict";

    // [sa] Pars
    var shpStdbyOrdApp = angular.module("sy.Pars", ["sy.Pars.controller", "sy.Pars.service"]);
    angular.module("sy.Pars.controller", [] );
    angular.module("sy.Pars.service", [] );

    shpStdbyOrdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syPars", {
            url: "/99sy/syPars?menu:kind?mrk",
            views: {
            	contentView	: {
                    templateUrl	: "app/contents/99sy/sy15Pars/templates/sy.Pars.tpl.html",
                    controller  : "sy.ParsCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", "$stateParams", function (AuthSvc, $q, UtilSvc, $stateParams) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                            	var paramMrkName = $stateParams.mrk,
                            		returnResMrk = "";
                            	resData.access = result[0];
                            	UtilSvc.csMrkList().then(function (res) {                      
            						resData.csMrkDataSource = res.data;
            						if(resData.csMrkDataSource.length){
            							if(paramMrkName){
            								returnResMrk = paramMrkName;
                						}else{
                							returnResMrk = resData.csMrkDataSource[0].CD_DEF;
                						}
            						}else{
            							returnResMrk = "";
            						}
            						resData.resDataInitMrk = returnResMrk;
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
