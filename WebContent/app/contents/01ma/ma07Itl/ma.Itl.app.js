(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Itl", ["ma.Itl.controller", "ma.Itl.service"]);
    angular.module("ma.Itl.controller", [] );
    angular.module("ma.Itl.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maItl", {
            url		: "/01ma/maItl?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma07Itl/templates/ma.Itl.tpl.html",
                    controller  : "ma.ItlCtrl",
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