(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("sy.Itl", ["sy.Itl.controller", "sy.Itl.service"]);
    angular.module("sy.Itl.controller", [] );
    angular.module("sy.Itl.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.syItl", {
            url		: "/99sy/syItl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/99sy/sy17Itl/templates/sy.Itl.tpl.html",
                    controller  : "sy.ItlCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                
                                var param = {
        		    					procedureParam: "MarketManager.USP_MA_07ITL_CODE_GET",
        		    				};
        		    				UtilSvc.getList(param).then(function (res) {
        		    					resData.mngMrkData = res.data.results[0];
        		    					resData.nmJobData  = res.data.results[1];
        		    					resData.stJobData  = res.data.results[2];
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