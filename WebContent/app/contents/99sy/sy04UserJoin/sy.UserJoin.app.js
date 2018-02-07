(function () {
    'use strict';

    // [SY] 로그인
    var loginApp = angular.module('sy.UserJoin', ['sy.UserJoin.controller', 'sy.UserJoin.service']);
    angular.module('sy.UserJoin.controller', []);
    angular.module('sy.UserJoin.service', []);

    loginApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('syUserJoin', {
            url  : '/99sy/syUserJoin',
            templateUrl : 'app/contents/99sy/sy04UserJoin/templates/sy.UserJoin.tpl.html',
            controller  : 'sy.UserJoinCtrl',
            resolve     : {
                isLogin : ['sy.LoginSvc', '$state', '$rootScope', '$q', function (LoginSvc, $state, $rootScope, $q) {
                    var defer = $q.defer();
                    defer.resolve();
//                    LoginSvc.isLogin().then(function (result) {
//                        if (result.status !== 401) {
//	                        $state.go('app.syDashboard', { menu: true });
//	                        defer.resolve();
//                        } else {
//	                        defer.resolve();
//                            $rootScope.$emit('event:logout');
//                        }
//                    });
                    return defer.promise;
                }]
            }
        });
    }]);
}());