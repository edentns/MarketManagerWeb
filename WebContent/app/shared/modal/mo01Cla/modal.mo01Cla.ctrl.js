(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 약관보기
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.mo01ClaCtrl", ["$scope", "$modal", "$modalInstance", "resData", "$filter", "UtilSvc", "$timeout", 
			function ($scope, $modal, $modalInstance, resData, $filter, UtilSvc, $timeout) {

				var claVO;

				/**
				 * ===================================================
				 * @description 회원가입
				 * ===================================================
				 */
				claVO = $scope.claVO = {
					DC_CLA001: resData.DC_CLA001,
					DC_CLA002: resData.DC_CLA002,
					DC_CLA003: resData.DC_CLA003
				};
				
				/**
				 * 약관창 닫기
				 */
				claVO.doClose = function () {
					$modalInstance.dismiss( "cancel" );
				};
			}]);
}());