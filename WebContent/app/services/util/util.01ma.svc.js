(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @description
	 * 관리자 유틸 서비스
	 */
	angular.module('edtApp.common.service').service('Util01maSvc', ['$rootScope', '$state', '$window', '$http', 'APP_CONFIG', 'MenuSvc',
		function ($rootScope, $state, $window, $http, APP_CONFIG, MenuSvc) {
			var user = $rootScope.webApp.user,
				menu = $rootScope.webApp.menu;
		}
	]);
}());