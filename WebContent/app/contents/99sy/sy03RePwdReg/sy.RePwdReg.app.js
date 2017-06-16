(function () {
    "use strict";

    // [sy] RePwdReg
    var rePwdApp = angular.module("sy.RePwdReg", ["sy.RePwdReg.controller", 'sy.Ownconf.controller', "sy.RePwdReg.service"]);
    angular.module("sy.RePwdReg.controller", [] );
    angular.module('sy.Ownconf.controller', []);
    angular.module("sy.RePwdReg.service", [] );

    rePwdApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("syRePwdReg", {
            url		: "/99sy/syRePwdReg/:DC_URLCRYTO?:noOwnconf",
            templateUrl	: function($stateParams) {
            	var url = 'app/contents/99sy/sy03RePwdReg/templates/sy.RePwdReg.tpl.html';
            	if($stateParams.DC_URLCRYTO === 'chkMeConf') {
            		url = 'app/contents/99sy/sy03RePwdReg/templates/sy.Ownconf.tpl.html';
            	}
            	return url;
            },
            controllerProvider  : ["$stateParams", function($stateParams) {
            	var ctrl = 'sy.RePwdRegCtrl';
            	if($stateParams.DC_URLCRYTO === 'chkMeConf') {
            		ctrl = 'sy.OwnconfCtrl';
            	}
            	return ctrl;
            }],
            resolve		: {
                resData: ['sy.RePwdRegSvc', '$stateParams', '$state', '$location', '$rootScope', '$q', "UtilSvc", "sy.LoginSvc",
                          function (RePwdRegSvc, $stateParams, $state, $location, $rootScope, $q, UtilSvc, LoginSvc) {
                	var defer 	  = $q.defer(),
                		noOwnconf = '',
                        resData   = {};
                	
                	if($stateParams.DC_URLCRYTO === 'chkMeConf') {
                		noOwnconf = $stateParams.noOwnconf;
                        
                        LoginSvc.updateChkMeConf(noOwnconf).success(function (result) {
	                        resData.data = result;
	                        defer.resolve(resData);
                        }).error(function(msg, code) {
	                		defer.resolve();
				            $location.url("/99sy/syLogin");
	                    });
                	}
                	else {
	                	RePwdRegSvc.rePwdGet01($stateParams.DC_URLCRYTO).success(function (result) {
	                		resData.DC_URLCRYTO = $stateParams.DC_URLCRYTO;
	                        defer.resolve(resData);
	                	}).error(function(msg, code) {
	                		defer.resolve();
				            $location.url("/99sy/syLogin");
	                    });
                	}
                	
                    return defer.promise;
                }]
            }
        });
    }]);
}());
