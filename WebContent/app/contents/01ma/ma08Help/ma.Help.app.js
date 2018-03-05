(function () {
    "use strict";

    // [ma] Notice
    var qaApp = angular.module("ma.Help", ["ma.Help.controller", "ma.Help.service"]);
    angular.module("ma.Help.controller", [] );
    angular.module("ma.Help.service", [] );

    qaApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.maHelp", {
            url		: "/01ma/maHelp?menu",
            views	: {
                contentView	: {
                    templateUrl	: "app/contents/01ma/ma08Help/templates/ma.Help.tpl.html",
                    controller  : "ma.HelpCtrl",
                    resolve		: {
                        resData: ["AuthSvc", "$q", "UtilSvc", function (AuthSvc, $q, UtilSvc) {
                            var defer 	= $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                defer.resolve(resData);
//                                var param = {
//        		    					procedureParam: "USP_MA_07Help_CODE_GET",
//        		    				};
//    		    				UtilSvc.getList(param).then(function (res) {
//    		    					resData.mngMrkData = res.data.results[0];
//    		    					resData.nmJobData  = res.data.results[1];
//    		    					resData.stJobData  = res.data.results[2];
//    		    					defer.resolve(resData);
//    							});
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());