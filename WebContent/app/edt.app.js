(function () {
    'use strict';

    var edtApp = angular.module('edtApp', [
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ngCookies',
        'ngAnimate',
        'ngTable',
        'angularGrid',
        'ui.grid',
        'ui.grid.expandable',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.resizeColumns',
        'ui.grid.pinning',
        'ui.grid.selection',
        'ui.grid.autoResize',
        'ui.grid.exporter',
        'ui.bootstrap',
        'ngTouch',
        'angularFileUpload',
        'textAngular',
        'edtApp.common',
        'edtApp.ma',
        'edtApp.it',
        'edtApp.sa',
        'edtApp.cs',
        'edtApp.te',
        'edtApp.sy',
        'edtApp.ui',
        'angulartics', 
        'angulartics.google.analytics'
    ]);

    // common
    angular.module('edtApp.common', ['edtApp.common.service', 'edtApp.common.filter', 'edtApp.common.directive', 'edtApp.common.modal', 'edtApp.common.model']);
    angular.module('edtApp.common.service', ['ui.router']);
    angular.module('edtApp.common.filter', []);
    angular.module('edtApp.common.directive', []);
    angular.module('edtApp.common.model', []);
    angular.module('edtApp.common.modal', []);
    angular.module('edtApp.ui', []);
        
    // default page
    edtApp.config(['$stateProvider', '$urlRouterProvider', '$analyticsProvider', function ($stateProvider, $urlRouterProvider, $analyticsProvider) {
        $urlRouterProvider.when('', '/99sy/syLogin');
        $urlRouterProvider.when('', '/99sy/syRePwdReg/:DC_URLCRYTO?:noOwnconf');
        $urlRouterProvider.when('', '/99sy/syUserJoin');
        
        $analyticsProvider.virtualPageviews(false);    
        //$analyticsProvider.settings.ga.userId = 'UA-85190289-1'; 
        
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'app/app.tpl.html'
            });
    }]);    
}());
