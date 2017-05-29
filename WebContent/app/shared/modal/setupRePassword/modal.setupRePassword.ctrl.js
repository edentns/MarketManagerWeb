(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 고객사 검색
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.setupRePasswordCtrl", ["$scope", "$modal", "$modalInstance", "ngTableParams", "sy.LoginSvc", "$sce", "$filter", "UtilSvc", "$timeout", 
			function ($scope, $modal, $modalInstance, ngTableParams, SyLoginSvc, $sce, $filter, UtilSvc, $timeout) {

				var rePwdVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				rePwdVO = $scope.rePwdVO = {
				};
				
				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				rePwdVO.doConfirm = function () {
					if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(rePwdVO.email)) {
						return edt.invalidFocus("rePwdVO.email", "[형식] 이메일은 유효하지 않은 형식입니다.");
					}
					SyLoginSvc.setupRePwd(rePwdVO.email).then(function (res) {
						if(res.status === 200) {
							alert('메일을 발송하였습니다');
							$modalInstance.close();
						}
						/*else {
							
						}*/
					});
				};

				/**
				 * 모달창을 닫는다.
				 */
				rePwdVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};

				// 처음 로드되었을 때 실행된다.
				(function  () {
					$timeout(function () {
                        edt.id("rePwdEmail").focus();
                    }, 500);
				}());
			}]);
}());