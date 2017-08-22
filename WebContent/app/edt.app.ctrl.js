(function () {

'use strict';

angular.module('edtApp')
	.controller('AppCtrl', ['MenuSvc', 'APP_AUTH', '$scope', '$state', function (MenuSvc, APP_AUTH, $scope, $state) {
		MenuSvc.activeMenu($state.current.name);
		$scope.menu = {
			data: MenuSvc.getNavigation()
		};
		kendo.culture('ko-KR');
	}]);
}());