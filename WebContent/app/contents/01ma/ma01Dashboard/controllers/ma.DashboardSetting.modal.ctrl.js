/**
 * 공통 상세 팝업 BOX
 * Created by js.choi on 2015.08.25
 */
(function () {
	'use strict';

    /**
     * @ngdoc function
     * @name ma.Dashboard.controller : ma.DashboardCtrl
     * 코드관리
     */
    angular.module("ma.Dashboard.controller")
        .controller("ma.DashboardSettingModalCtrl", ['$scope', '$modalInstance', 'payload',
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