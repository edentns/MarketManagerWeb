(function () {
    'use strict';

    // [SY] 로그인
    var loginApp = angular.module('sy.Login', ['sy.Login.controller', 'sy.Login.service']);
    angular.module('sy.Login.controller', []);
    angular.module('sy.Login.service', []);

    loginApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('login', {
            url  : '/99sy/syLogin',
            templateUrl : 'app/contents/99sy/sy02Login/templates/sy.Login.tpl.html',
            controller  : 'sy.LoginCtrl',
            resolve     : {
                isLogin : ['sy.LoginSvc', '$state', '$rootScope', '$q', function (LoginSvc, $state, $rootScope, $q) {
                    var defer = $q.defer();
                    LoginSvc.isLogin().then(function (result) {
                        if (result.status !== 401) {
	                        $state.go('app.syDashboard', { menu: true });
	                        defer.resolve();
                        } else {
	                        defer.resolve();
                            $rootScope.$emit('event:logout');
                        }
                    });
                    return defer.promise;
                }]
            }
        });
    }]);
}());