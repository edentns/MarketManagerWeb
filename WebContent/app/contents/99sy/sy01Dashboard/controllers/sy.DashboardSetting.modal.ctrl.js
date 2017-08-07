/**
 * 공통 상세 팝업 BOX
 * Created by js.choi on 2015.08.25
 */
(function () {
	'use strict';

    /**
     * @ngdoc function
     * @name sy.Dashboard.controller : sy.DashboardCtrl
     * 코드관리
     */
    angular.module("sy.Dashboard.controller")
        .controller("sy.DashboardSettingModalCtrl", ['$scope', '$modalInstance', 'payload',
            function ($scope, $modalInstance, payload) {
	        $scope.options = {
	            data : angular.copy(payload.data, [])
	        };
	        
			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
	        
	        $scope.confirm = function() {
	            angular.forEach($scope.options.data, function(data) {
	                delete data.uuid;
	            });
	            $modalInstance.close($scope.options.data);
	        };
			
			$scope.upItem = function() {
	            $scope.options.api.upSelectedItem();
			};
			
			$scope.downItem = function() {
	            $scope.options.api.downSelectedItem();
			};
        }]);
}());