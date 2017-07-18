(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name
	 * modal - 메뉴그룹 등록
	 */
	angular.module("edtApp.common.modal")
		.controller("modal.mo04NewGroupSaveCtrl", ["$scope", "$modal", "modal.NewGroupSaveSvc", "$modalInstance", "$timeout", 
			function ($scope, $modal, moNewGrpSaveSvc, $modalInstance, $timeout) {
				var newGroupVO;

				/**
				 * ===================================================
				 * @description 검색 layout을 관리한다.
				 * ===================================================
				 */
				newGroupVO = $scope.newGroupVO = {
				};
				
				/**
				 * 선택된 거래처 정보를 부모창에 전달하고, 모달팝업창을 닫는다.
				 */
				newGroupVO.doConfirm = function () {
//					if (!/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/.test(rePwdVO.email)) {
//						return edt.invalidFocus("rePwdVO.email", "[형식] 이메일은 유효하지 않은 형식입니다.");
//					}
					moNewGrpSaveSvc.newGroupSave(newGroupVO.nmGroup).then(function (res) {
						if(res.status === 200) {
							alert('저장성공');
							$modalInstance.close();
						}
					});
				};

				/**
				 * 모달창을 닫는다.
				 */
				newGroupVO.doCancle = function () {
					$modalInstance.dismiss( "cancel" );
				};

				// 처음 로드되었을 때 실행된다.
				(function  () {
					$timeout(function () {
                        edt.id("nmGroup").focus();
                    }, 500);
				}());
			}]);
}());