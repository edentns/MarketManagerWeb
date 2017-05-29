(function () {
    "use strict";

    // [sy] RePwdReg
    var rePwdApp = angular.module("sy.RePwdReg", ["sy.RePwdReg.controller", "sy.RePwdReg.service"]);
    angular.module("sy.RePwdReg.controller", [] );
    angular.module("sy.RePwdReg.service", [] );

    rePwdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("syRePwdReg", {
            url		: "/99sy/syRePwdReg/:DC_URLCRYTO",
            templateUrl	: "app/contents/99sy/sy03RePwdReg/templates/sy.RePwdReg.tpl.html",
            controller  : "sy.RePwdRegCtrl",
            resolve		: {
                resData: ['sy.RePwdRegSvc', '$stateParams', '$state', '$location', '$rootScope', '$q', "UtilSvc",
                          function (RePwdRegSvc, $stateParams, $state, $location, $rootScope, $q, UtilSvc) {
                	var defer 	= $q.defer(),
                        resData = {};
                	
                	RePwdRegSvc.rePwdGet01($stateParams.DC_URLCRYTO).success(function (result) {
                		resData.DC_URLCRYTO = $stateParams.DC_URLCRYTO;
                        defer.resolve(resData);
                	}).error(function(msg, code) {
                		defer.resolve();
			            $location.url("/99sy/syLogin");
                    });
                	
                    return defer.promise;
                }]
            }
        });
    }]);
}());
